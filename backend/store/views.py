from rest_framework import viewsets, permissions, status, generics, filters
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.views import APIView
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from django.db.models import Sum, Count, F
from django.db.models.functions import ExtractHour, ExtractWeekDay, TruncDate, TruncHour, TruncMonth
from django.utils import timezone
from datetime import timedelta, datetime
from django.contrib.auth import get_user_model
from .models import Category, Product, MatchingOutfit, Order, OrderItem, Transaction, Cart, CartItem, ContactQuery, OrderItemShipmentProof
from .serializers import (
    UserSerializer, RegisterSerializer, CategorySerializer, ProductSerializer,
    MatchingOutfitSerializer, OrderSerializer, TransactionSerializer, CartSerializer,
    ReturnRequestSerializer, ContactQuerySerializer, OrderItemShipmentProofSerializer
)
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

import requests
from django.conf import settings
from django.core.mail import send_mail
from django.core.cache import cache
import random

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://localhost:5176"
    client_class = OAuth2Client

User = get_user_model()

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        email = request.data.get('username')  # Frontend sends email in 'username' field (or we can change frontend)
        password = request.data.get('password')

        if not email or not password:
             return Response({'error': 'Please provide both email and password'}, status=status.HTTP_400_BAD_REQUEST)

        # Try to find user by email
        user = User.objects.filter(email=email).first()

        # If not found by email, try username (optional fallback)
        if not user:
            user = User.objects.filter(username=email).first()

        if user and user.check_password(password):
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user_id': user.pk,
                'username': user.username,
                'email': user.email,
                'role': user.role
            })
        
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        # Proceed strictly with standard authentication logic (no simultaneous OTP)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.perform_create(serializer)
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        return serializer.save()

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('id')
    serializer_class = ProductSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'description', 'category__name']

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        
        # Convert QueryDict to a standard dict to handle lists correctly
        if hasattr(data, 'dict'):
            dict_data = data.dict()
        else:
            dict_data = dict(data)

        if 'variants' in dict_data and isinstance(dict_data['variants'], str):
            import json
            try:
                dict_data['variants'] = json.loads(dict_data['variants'])
            except:
                pass 
        
        serializer = self.get_serializer(data=dict_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        data = request.data.copy()
        
        if hasattr(data, 'dict'):
            dict_data = data.dict()
        else:
            dict_data = dict(data)

        if 'variants' in dict_data and isinstance(dict_data['variants'], str):
            import json
            try:
                dict_data['variants'] = json.loads(dict_data['variants'])
            except:
                pass 

        serializer = self.get_serializer(instance, data=dict_data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def get_queryset(self):
        from django.db.models import Q
        queryset = Product.objects.all()
        category = self.request.query_params.get('category')
        if category:
            if category.isdigit():
                queryset = queryset.filter(category__id=category)
            else:
                queryset = queryset.filter(Q(category__name__iexact=category) | Q(category__slug__iexact=category))
        return queryset
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'last_updated']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()] # Ideally IsAdminUser for modifications

    @action(detail=False, methods=['get'])
    def last_updated(self, request):
        latest_product = Product.objects.order_by('-updated_at').first()
        latest_category = Category.objects.order_by('-updated_at').first()
        
        p_time = latest_product.updated_at if latest_product else None
        c_time = latest_category.updated_at if latest_category else None
        
        # Return the most recent timestamp
        if p_time and c_time:
            latest = p_time if p_time > c_time else c_time
        elif p_time:
            latest = p_time
        else:
            latest = c_time
            
        return Response({'last_updated': latest})

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class MatchingOutfitViewSet(viewsets.ModelViewSet):
    queryset = MatchingOutfit.objects.all()
    serializer_class = MatchingOutfitSerializer

    @action(detail=False, methods=['get'])
    @action(detail=False, methods=['get'])
    def match(self, request):
        product_id = request.query_params.get('product_id')
        if not product_id:
            # Fallback to old behavior or just error
            shirt_id = request.query_params.get('shirt_id')
            if shirt_id:
                product_id = shirt_id
            else:
                 return Response({"error": "product_id is required"}, status=400)

        # Find where product is a shirt
        matches_as_shirt = MatchingOutfit.objects.filter(shirt_id=product_id)
        # Find where product is a bottom
        matches_as_bottom = MatchingOutfit.objects.filter(bottom_id=product_id)

        results = []
        for match in matches_as_shirt:
            results.append(match.bottom) # Return the Bottom object
        for match in matches_as_bottom:
            results.append(match.shirt) # Return the Shirt object
        
        # Serialize the product list
        serializer = ProductSerializer(results, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def link(self, request):
        shirt_id = request.data.get('shirt_id')
        bottom_id = request.data.get('bottom_id')

        if not shirt_id or not bottom_id:
            return Response({"error": "Both shirt_id and bottom_id are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if already linked
        existing_link = MatchingOutfit.objects.filter(shirt_id=shirt_id, bottom_id=bottom_id).exists()
        if existing_link:
            return Response({"message": "Already linked."}, status=status.HTTP_200_OK)

        # Create link
        MatchingOutfit.objects.create(shirt_id=shirt_id, bottom_id=bottom_id)
        return Response({"message": "Successfully linked."}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def unlink(self, request):
        shirt_id = request.data.get('shirt_id')
        bottom_id = request.data.get('bottom_id')

        if not shirt_id or not bottom_id:
            return Response({"error": "Both shirt_id and bottom_id are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Delete link
        deleted, _ = MatchingOutfit.objects.filter(shirt_id=shirt_id, bottom_id=bottom_id).delete()
        if deleted:
            return Response({"message": "Successfully unlinked."}, status=status.HTTP_200_OK)
        return Response({"message": "Link not found."}, status=status.HTTP_404_NOT_FOUND)

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Check if status is being updated to 'packed' or 'shipped' (assuming Shiprocket handles 'shipped' transit, but locally 'packed' might be a state)
        new_status = request.data.get('status')
        if new_status in ['packed', 'shipped'] and new_status != instance.status:
            items = instance.items.all()
            for item in items:
                if not item.shipment_proofs.exists():
                    return Response(
                        {"error": f"Cannot mark order as '{new_status}'. Pre-shipment proof photos are missing for {item.product.name}."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                    
        return super().update(request, *args, **kwargs)

    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'developer']:
            return Order.objects.all().order_by('-created_at')
        return Order.objects.filter(user=user).order_by('-created_at')

    @action(detail=False, methods=['post'])
    def calculate_shipping(self, request):
        user = request.user
        cart = Cart.objects.filter(user=user).first()
        
        if not cart or not cart.items.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check for selected items
        selected_item_ids = request.data.get('selected_item_ids')
        if selected_item_ids:
            cart_items = cart.items.filter(id__in=selected_item_ids)
            if not cart_items.exists():
                 return Response({"error": "No valid items selected from cart"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            cart_items = cart.items.all()
            
        delivery_pincode = request.data.get('delivery_pincode')
        if not delivery_pincode:
            return Response({"error": "Delivery pincode is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate dimensions and weight based on selected cart items
        total_weight_grams = 0
        max_length = 0
        max_breadth = 0
        total_height = 0
        declared_value = 0

        for item in cart_items:
            try:
                # Find the corresponding variant
                variant = item.product.variants.get(size=item.size)
                
                # Weight calculation
                total_weight_grams += float(variant.weight) * item.quantity
                
                # Dimensions calculation (assuming CM)
                item_length = float(variant.length)
                item_width = float(variant.width)
                item_height = float(variant.height)
                
                # Estimated Package calculation:
                if item_length > max_length:
                    max_length = item_length
                if item_width > max_breadth:
                    max_breadth = item_width
                total_height += (item_height * item.quantity)
                
            except Exception:
                pass
                
            declared_value += item.product.price * item.quantity

        from .shiprocket_service import ShiprocketClient
        client = ShiprocketClient()
        
        # Hardcoding pickup pincode for now or using a settings variable
        # Ideally, this should be the warehouse pincode. Shiprocket account setting.
        pickup_pincode = getattr(settings, 'SHIPROCKET_PICKUP_PINCODE', '560001') # Fallback assumption
        
        rate_response = client.calculate_shipping_rate(
            pickup_pincode=pickup_pincode,
            delivery_pincode=delivery_pincode,
            weight=total_weight_grams / 1000.0,
            length=max_length,
            breadth=max_breadth,
            height=total_height,
            declared_value=declared_value
        )
        
        if rate_response.get("status") == "success":
            return Response(rate_response)
        else:
            return Response(rate_response, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def request_return(self, request, pk=None):
        order = self.get_object()

        # Only standard customer or order owner can request
        if order.user != request.user:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

        # Only delivered orders can be returned
        if order.status != 'delivered':
            return Response({'error': 'Order must be delivered to request a return'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if return already requested
        if hasattr(order, 'return_request'):
             return Response({'error': 'Return request already exists for this order'}, status=status.HTTP_400_BAD_REQUEST)

        reason = request.data.get('reason')
        description = request.data.get('description', '')
        image = request.FILES.get('image')

        if not reason:
            return Response({'error': 'Reason is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Create return request
        from .models import ReturnRequest
        try:
            return_request = ReturnRequest.objects.create(
                order=order,
                reason=reason,
                description=description,
                status='pending'
            )
            
            if image:
                return_request.image = image
                return_request.save()
            order.status = 'return_requested'
            order.save()
            return Response({'status': 'Return requested successfully'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request, *args, **kwargs):
        user = request.user
        cart = Cart.objects.filter(user=user).first()
        
        if not cart or not cart.items.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Check for selected items
        selected_item_ids = request.data.get('selected_item_ids')
        
        if selected_item_ids:
            # Filter cart items
            # Validate that these items actually belong to the user's cart
            cart_items = cart.items.filter(id__in=selected_item_ids)
            if not cart_items.exists():
                 return Response({"error": "No valid items selected from cart"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            # Default to all items
            cart_items = cart.items.all()

        # Create Order
        shipping_cost = request.data.get('shipping_cost', 0.00)
        shipping_state = request.data.get('shipping_state', '')
        shipping_city = request.data.get('shipping_city', '')
        
        order = Order.objects.create(
            user=user, 
            status='placed', 
            total_price=0, 
            shipping_cost=shipping_cost,
            shipping_state=shipping_state,
            shipping_city=shipping_city
        )
        
        total_price = 0
        items_to_create = []
        
        from django.db.models import F
        
        for cart_item in cart_items:
            order_item = OrderItem(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                price=cart_item.product.price,
                size=cart_item.size
            )
            items_to_create.append(order_item)
            total_price += cart_item.product.price * cart_item.quantity
            
            # Deduct stock atomically
            cart_item.product.stock = F('stock') - cart_item.quantity
            cart_item.product.save(update_fields=['stock'])
            cart_item.product.refresh_from_db()
            
        OrderItem.objects.bulk_create(items_to_create)
        
        order.total_price = total_price + float(shipping_cost)
        order.save()
        
        # Now automatically create the Shiprocket order directly
        from .shiprocket_service import ShiprocketClient
        client = ShiprocketClient()
        response = client.create_order(order)
        
        if response and 'order_id' in response and not response.get('error'):
            order.shiprocket_order_id = response['order_id']
            order.shipment_id = response.get('shipment_id')
            order.awb_code = response.get('awb_code')
            order.status = 'placed' # Still 'placed' in our system until dispatched
            order.save()
            print(f"Successfully created Shiprocket order for #{order.id}")
        else:
            print(f"Failed to create order in Shiprocket during checkout: {response}")
        
        # Remove *only* the processed items from Cart
        cart_items.delete()
        
        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ReturnRequestViewSet(viewsets.ModelViewSet):
    serializer_class = ReturnRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'developer']:
            from .models import ReturnRequest
            return ReturnRequest.objects.all().order_by('-created_at')
        # Typical customer shouldn't directly query the pool like this, they see it on their order
        # But we could allow them to see their own
        from .models import ReturnRequest
        return ReturnRequest.objects.filter(order__user=user).order_by('-created_at')

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        if request.user.role not in ['admin', 'developer']:
            return Response(status=status.HTTP_403_FORBIDDEN)
            
        return_req = self.get_object()
        if return_req.status != 'pending':
            return Response({'error': 'Only pending requests can be approved'}, status=status.HTTP_400_BAD_REQUEST)
            
        return_req.status = 'approved'
        return_req.save()
        
        return_req.order.status = 'returned'
        return_req.order.save()
        
        return Response({'status': 'Return request approved and order marked as returned'})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        if request.user.role not in ['admin', 'developer']:
            return Response(status=status.HTTP_403_FORBIDDEN)
            
        return_req = self.get_object()
        if return_req.status != 'pending':
            return Response({'error': 'Only pending requests can be rejected'}, status=status.HTTP_400_BAD_REQUEST)
            
        return_req.status = 'rejected'
        return_req.save()
        
        return_req.order.status = 'return_rejected'
        return_req.order.save()
        
        return Response({'status': 'Return request rejected'})

class CartViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CartSerializer

    def get_queryset(self):
        return Cart.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        size = request.data.get('size') # Optional

        if not product_id:
            return Response({'error': 'Product ID is required'}, status=400)

        product = generics.get_object_or_404(Product, pk=product_id)
        
        # Check if item exists with same product and size to determine if it's a new item
        existing_query = CartItem.objects.filter(cart=cart, product=product)
        if size:
            existing_query = existing_query.filter(size=size)
            
        if not existing_query.exists():
            # This means we are about to add a NEW item. Check limit.
            if cart.items.count() >= 15:
                 return Response({'error': 'Cart is full (15 items max). Please remove some items.'}, status=400)

        # Check if item exists with same product and size
        if size:
            cart_item, item_created = CartItem.objects.get_or_create(cart=cart, product=product, size=size)
        else:
            cart_item, item_created = CartItem.objects.get_or_create(cart=cart, product=product)

        if not item_created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity
        
        cart_item.save()

        return Response({'status': 'Item added to cart'}, status=200)

    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        cart = generics.get_object_or_404(Cart, user=request.user)
        item_id = request.data.get('item_id')
        
        if not item_id:
             return Response({'error': 'Item ID is required'}, status=400)
             
        item = generics.get_object_or_404(CartItem, pk=item_id, cart=cart)
        item.delete()
        
        return Response(self.get_serializer(cart).data)

    @action(detail=False, methods=['post'])
    def update_quantity(self, request):
        print(f"DEBUG: update_quantity called with data: {request.data}")
        cart = generics.get_object_or_404(Cart, user=request.user)
        item_id = request.data.get('item_id')
        quantity = int(request.data.get('quantity', 1))

        if not item_id:
            print("DEBUG: Item ID missing")
            return Response({'error': 'Item ID is required'}, status=400)

        print(f"DEBUG: Finding CartItem {item_id} in cart {cart.id}")
        item = generics.get_object_or_404(CartItem, pk=item_id, cart=cart)
        
        if quantity > 0:
            print(f"DEBUG: Updating quantity to {quantity}")
            item.quantity = quantity
            item.save()
        else:
            print("DEBUG: Deleting item (quantity 0)")
            item.delete()

        serializer = self.get_serializer(cart)
        print("DEBUG: update_quantity success")
        return Response(serializer.data)

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated] # Should be Admin/Developer

    def get(self, request):
        total_sales = Order.objects.aggregate(Sum('total_price'))['total_price__sum'] or 0
        total_orders = Order.objects.count()
        total_products = Product.objects.count()
        low_stock_products = Product.objects.filter(stock__lt=10).count()

        return Response({
            "total_sales": total_sales,
            "total_orders": total_orders,
            "total_products": total_products,
            "low_stock_products": low_stock_products
        })

class AnalyticsView(APIView):
    permission_classes = [permissions.IsAuthenticated] # Should be Admin

    def get(self, request):
        date_range = request.query_params.get('range', 'today')
        custom_start = request.query_params.get('start')
        custom_end = request.query_params.get('end')

        now = timezone.now()
        today = now.date()

        if date_range == 'today':
            start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
            end_date = now
        elif date_range == 'last_2_days':
            start_date = now - timedelta(days=2)
            end_date = now
        elif date_range == 'weekly':
            start_date = now - timedelta(days=7)
            end_date = now
        elif date_range == 'monthly':
            start_date = now - timedelta(days=30)
            end_date = now
        elif date_range == 'yearly':
            start_date = now - timedelta(days=365)
            end_date = now
        elif date_range == 'custom' and custom_start and custom_end:
            try:
                start_date = datetime.strptime(custom_start, '%Y-%m-%d')
                end_date = datetime.strptime(custom_end, '%Y-%m-%d').replace(hour=23, minute=59, second=59)
            except ValueError:
                return Response({"error": "Invalid date format"}, status=400)
        else:
            # Default to today
            start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
            end_date = now

        # Base Querysets
        orders = Order.objects.filter(created_at__range=[start_date, end_date]).exclude(status__in=['return_rejected', 'returned'])
        order_items = OrderItem.objects.filter(order__in=orders)

        # 1. Top Level Metrics
        total_orders = orders.count()
        total_sales = orders.aggregate(Sum('total_price'))['total_price__sum'] or 0
        total_investment = sum((item.product.cost_price * item.quantity for item in order_items if item.product), 0)
        profit = float(total_sales) - float(total_investment)
        profit_margin = round((profit / float(total_sales)) * 100, 2) if total_sales > 0 else 0
        average_order_value = float(total_sales) / total_orders if total_orders > 0 else 0

        # 2. Charts Data
        duration = end_date - start_date
        if duration.days > 31: # Yearly/Custom long
            sales_over_time = orders.annotate(date=TruncMonth('created_at')).values('date').annotate(sales=Sum('total_price')).order_by('date')
        elif duration.days > 2: # Weekly/Monthly
            sales_over_time = orders.annotate(date=TruncDate('created_at')).values('date').annotate(sales=Sum('total_price')).order_by('date')
        else: # Today/2 Days
            sales_over_time = orders.annotate(hour=TruncHour('created_at')).values('hour').annotate(sales=Sum('total_price')).order_by('hour')

        formatted_sales_over_time = [
            {
                'name': (x.get('date') or x.get('hour')).strftime('%b %d') if duration.days > 2 else (x.get('date') or x.get('hour')).strftime('%I %p'),
                'Revenue': float(x['sales'] or 0),
                # Generating mock profit trend for visual richness (sales * avg margin)
                'Profit': float(x['sales'] or 0) * (profit_margin / 100) 
            } for x in sales_over_time
        ]

        # 3. State Distribution (Pie Chart)
        state_distribution = list(orders.exclude(shipping_state__exact='').values('shipping_state').annotate(value=Count('id')).order_by('-value'))

        # 4. Order Status Breakdown (Doughnut Chart)
        status_breakdown = list(orders.values('status').annotate(value=Count('id')).order_by('-value'))

        # 5. Category Wise Sales (Bar Chart)
        category_sales = list(order_items.values('product__category__name').annotate(value=Sum('quantity')).order_by('-value'))
        formatted_category_sales = [{'name': c['product__category__name'], 'Sold': c['value']} for c in category_sales]

        # 6. E-commerce Insights
        top_products = order_items.values(
            'product__name', 'product__image'
        ).annotate(
            total_sold=Sum('quantity'),
            revenue=Sum(F('price') * F('quantity'))
        ).order_by('-total_sold')[:5]

        low_stock_products = Product.objects.filter(stock__gt=0, stock__lte=10).values('id', 'name', 'stock', 'image')[:5]
        out_of_stock_products = Product.objects.filter(stock=0).values('id', 'name', 'stock', 'image')[:5]

        # 7. Mock Conversion Rate (Assuming ~3% + random jitter based on total orders for realism)
        conversion_rate = round(3.2 + (total_orders * 0.05), 2)
        if conversion_rate > 15: conversion_rate = 15.0

        # Compile Payload
        data = {
            # Top Metrics
            'total_sales': float(total_sales),
            'total_orders': total_orders,
            'total_investment': float(total_investment),
            'profit': profit,
            'profit_margin': profit_margin,
            'average_order_value': round(average_order_value, 2),
            'conversion_rate': conversion_rate,

            # Charts
            'sales_over_time': formatted_sales_over_time,
            'state_distribution': state_distribution,
            'status_breakdown': status_breakdown,
            'category_sales': formatted_category_sales,

            # Insights
            'top_products': list(top_products),
            'low_stock': list(low_stock_products),
            'out_of_stock': list(out_of_stock_products)
        }
        
        return Response(data)

import razorpay
from django.conf import settings

# Initialize Razorpay Client
client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

class CreateRazorpayOrder(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        amount = request.data.get('amount')
        if not amount:
            return Response({'error': 'Amount is required'}, status=400)
        
        try:
            # Create Order
            # Amount should be in paise (multiply by 100)
            data = {
                "amount": int(float(amount) * 100),
                "currency": "INR",
                "payment_capture": "1"
            }
            order = client.order.create(data=data)
            return Response(order)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

class VerifyRazorpayPayment(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data
        try:
            # Verify Signature
            client.utility.verify_payment_signature(data)
            
            # Signature matches - Payment Successful
            # Create Transaction Record
            # We expect 'order_id' (our internal order ID) to be passed if we want to link it immediately,
            # OR we can just store the transaction and link it later. 
            # Ideally frontend sends our internal Order ID too.
            
            # For now, let's just return success so frontend can proceed to create the actual Order
            return Response({'status': 'Payment verified successfully'})
        except razorpay.errors.SignatureVerificationError:
            return Response({'error': 'Signature verification failed'}, status=400)
        except Exception as e:
            return Response({'error': str(e)}, status=500)


from django.core.cache import cache
import random

class SendOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone = request.data.get('phone')
        if not phone:
            return Response({'error': 'Phone number is required'}, status=400)

        # Clean phone number (remove spaces, -, etc. MSG91 usually expects country code, default 91)
        clean_phone = ''.join(filter(str.isdigit, str(phone)))
        if len(clean_phone) == 10:
            clean_phone = f"91{clean_phone}"

        # Generate 6 digit OTP
        otp = str(random.randint(100000, 999999))
        
        # Store in cache for 10 minutes
        cache_key = f'otp_{clean_phone}'
        cache.set(cache_key, otp, timeout=600)

        if settings.MSG91_AUTH_KEY:
            try:
                # MSG91 Send OTP API Endpoint
                url = f"https://control.msg91.com/api/v5/otp?template_id={settings.MSG91_TEMPLATE_ID}&mobile={clean_phone}&authkey={settings.MSG91_AUTH_KEY}&otp={otp}"
                
                response = requests.post(url)
                if response.status_code == 200:
                    data = response.json()
                    if data.get("type") == "success":
                         return Response({'message': 'OTP sent via MSG91 successfully', 'otp_length': 6})
                    else:
                         # MSG91 returned an error (e.g. invalid template, out of balance)
                         print(f"MSG91 Error payload: {data}")
                         return Response({'error': 'Failed to send SMS via provider', 'details': data}, status=500)
                else:
                    return Response({'error': 'SMS Provider API Error'}, status=500)

            except Exception as e:
                print(f"MSG91 Exception: {e}")
                return Response({'error': 'Internal server error while sending SMS'}, status=500)
        else:
            # Fallback for local testing if no API key is set
            print(f"\n{'='*40}", flush=True)
            print(f" PHONE VERIFICATION OTP FOR {clean_phone} (NO API KEY SET)", flush=True)
            print(f" OTP CODE: {otp}", flush=True)
            print(f"{'='*40}\n", flush=True)

            return Response({'message': 'OTP sent successfully (check console fallback)', 'otp': otp})

class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone = request.data.get('phone')
        otp_entered = request.data.get('otp')

        if not phone or not otp_entered:
            return Response({'error': 'Phone and OTP are required'}, status=400)

        clean_phone = ''.join(filter(str.isdigit, str(phone)))
        if len(clean_phone) == 10:
            clean_phone = f"91{clean_phone}"

        cache_key = f'otp_{clean_phone}'
        stored_otp = cache.get(cache_key)

        if stored_otp and str(stored_otp) == str(otp_entered):
            # Clear it after successful use to prevent reuse
            cache.delete(cache_key)
            return Response({'message': 'Phone verified successfully', 'verified': True})
        
        return Response({'error': 'Invalid or expired OTP', 'verified': False}, status=400)

class SendRegistrationEmailOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email address is required'}, status=400)

        # Check if user already exists
        if User.objects.filter(email=email).exists():
            return Response({'error': 'A user with this email already exists'}, status=400)

        otp = str(random.randint(100000, 999999))
        cache_key = f'email_otp_{email}'
        cache.set(cache_key, otp, timeout=600) # 10 mins

        try:
            send_mail(
                subject='Your Registration OTP for Guild Fashion Store',
                message=f'Hello,\n\nYour OTP for registration is: {otp}\n\nThis code will expire in 10 minutes.\n\nThank you!',
                from_email=settings.EMAIL_HOST_USER or 'noreply@guildfashion.com',
                recipient_list=[email],
                fail_silently=False,
            )
            return Response({'message': 'OTP sent to email successfully'})
        except Exception as e:
            print(f"Email Sending Error: {e}")
            # Fallback for dev
            print(f"\n{'='*40}", flush=True)
            print(f" EMAIL OVP FOR {email}", flush=True)
            print(f" OTP CODE: {otp}", flush=True)
            print(f"{'='*40}\n", flush=True)
            return Response({'message': 'Failed to send email. Check console if in Dev Mode.', 'error': str(e)}, status=200) # Return 200 so UI thinks it sent if local

class VerifyRegistrationEmailOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp_entered = request.data.get('otp')

        if not email or not otp_entered:
            return Response({'error': 'Email and OTP are required'}, status=400)

        cache_key = f'email_otp_{email}'
        stored_otp = cache.get(cache_key)

        if stored_otp and str(stored_otp) == str(otp_entered):
            # Clear the OTP cache to prevent reuse
            cache.delete(cache_key)
            
            # Set a NEW verification token to prove to the Register endpoint that this email passed verification
            verify_key = f'email_verified_{email}'
            cache.set(verify_key, True, timeout=1200) # Give them 20 mins to finish filling form

            return Response({'message': 'Email verified successfully', 'verified': True})
        
        return Response({'error': 'Invalid or expired OTP', 'verified': False}, status=400)

class ContactQueryViewSet(viewsets.ModelViewSet):
    serializer_class = ContactQuerySerializer
    queryset = ContactQuery.objects.all().order_by('-created_at')

    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def list(self, request, *args, **kwargs):
        if request.user.role not in ['admin', 'developer']:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        return super().list(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        if request.user.role not in ['admin', 'developer']:
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        return super().partial_update(request, *args, **kwargs)

class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.email == 'suhankaminofficial@gmail.com')

class SuperAdminViewSet(viewsets.ModelViewSet):
    permission_classes = [IsSuperAdmin]
    
    def get_serializer_class(self):
        from .serializers import SuperAdminUserSerializer
        return SuperAdminUserSerializer

    def get_queryset(self):
        return User.objects.filter(role__in=['admin', 'developer']).order_by('-date_joined')

    def create(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        role = request.data.get('role', 'admin')

        if not email or not password:
            return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email=email).exists():
            return Response({'error': 'User with this email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        # Generate a username since it's required by AbstractUser
        username = email.split('@')[0]
        while User.objects.filter(username=username).exists():
            username = f"{username}{random.randint(100, 999)}"

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role=role,
            plain_password=password
        )
        
        serializer = self.get_serializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        user = self.get_object()
        password = request.data.get('password')
        email = request.data.get('email')
        
        if email:
            if User.objects.filter(email=email).exclude(id=user.id).exists():
                return Response({'error': 'Email is already in use by another account.'}, status=status.HTTP_400_BAD_REQUEST)
            user.email = email
            user.username = email.split('@')[0] # keep username sync if needed
            
        if password:
            user.set_password(password)
            user.plain_password = password
            
        user.save()
        serializer = self.get_serializer(user)
        return Response(serializer.data)

class OrderItemShipmentProofViewSet(viewsets.ModelViewSet):
    serializer_class = OrderItemShipmentProofSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['admin', 'developer']:
            return OrderItemShipmentProof.objects.all().order_by('-uploaded_at')
        return OrderItemShipmentProof.objects.none()

    def perform_create(self, serializer):
        # We assume the order_item and order are passed in the request data
        serializer.save(uploaded_by_admin=self.request.user)
