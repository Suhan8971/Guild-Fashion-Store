from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Category, Product, ProductSize, MatchingOutfit, Order, OrderItem, Transaction, Cart, CartItem, ReturnRequest, ContactQuery, OrderItemShipmentProof

User = get_user_model()

class OrderItemShipmentProofSerializer(serializers.ModelSerializer):
    uploaded_by_admin_name = serializers.ReadOnlyField(source='uploaded_by_admin.username')

    class Meta:
        model = OrderItemShipmentProof
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role')

class SuperAdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role', 'plain_password', 'date_joined')
        read_only_fields = ('date_joined',)

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'confirm_password')

    def validate_email(self, value):
        # Prevent Google Auth vs Email Auth collisions
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def validate(self, data):
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        # Remove confirm_password as create_user doesn't take it
        validated_data.pop('confirm_password', None)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role='customer'
        )
        return user

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSize
        fields = ['id', 'size', 'quantity', 'price', 'weight', 'length', 'width', 'height']

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    variants = ProductSizeSerializer(many=True, required=False)
    linked_bottoms = serializers.SerializerMethodField()
    linked_shirts = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = '__all__'

    def get_linked_bottoms(self, obj):
        return [{'id': match.bottom.id, 'name': match.bottom.name} for match in obj.suggested_bottoms.all()]

    def get_linked_shirts(self, obj):
        return [{'id': match.shirt.id, 'name': match.shirt.name} for match in obj.suggested_for_shirts.all()]

    def create(self, validated_data):
        variants_data = validated_data.pop('variants', [])
        product = Product.objects.create(**validated_data)
        for variant_data in variants_data:
            ProductSize.objects.create(product=product, **variant_data)
        return product

    def update(self, instance, validated_data):
        variants_data = validated_data.pop('variants', None)

        # Update standard fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update Variants if provided
        if variants_data is not None:
            instance.variants.all().delete()
            for variant_data in variants_data:
                ProductSize.objects.create(product=instance, **variant_data)
        
        return instance

class MatchingOutfitSerializer(serializers.ModelSerializer):
    shirt_details = ProductSerializer(source='shirt', read_only=True)
    bottom_details = ProductSerializer(source='bottom', read_only=True)

    class Meta:
        model = MatchingOutfit
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    product_image = serializers.ReadOnlyField(source='product.image.url')
    shipment_proofs = OrderItemShipmentProofSerializer(many=True, read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_name', 'product_image', 'quantity', 'price', 'size', 'shipment_proofs')

class ReturnRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReturnRequest
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_username = serializers.ReadOnlyField(source='user.username')
    return_request = ReturnRequestSerializer(read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'

class CartItemSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)
    total_price = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = ('id', 'product', 'product_details', 'quantity', 'size', 'total_price')

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ('id', 'items', 'created_at')

class ContactQuerySerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactQuery
        fields = '__all__'
