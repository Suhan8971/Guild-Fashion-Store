import os
import django
from dotenv import load_dotenv

load_dotenv()

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from store.models import User, Product, Cart, CartItem, Order, OrderItem

def test_create_order():
    try:
        # Get or create a test user
        user = User.objects.filter(username='testuser').first()
        if not user:
            print("Creating test user...")
            user = User.objects.create_user(username='testuser', password='password123', email='test@example.com')
        
        print(f"Testing with User: {user.username}")

        # Ensure product exists
        product = Product.objects.first()
        if not product:
            print("No products found. Creating one...")
            from store.models import Category
            cat, _ = Category.objects.get_or_create(name='Test Category', slug='test-cat')
            product = Product.objects.create(name='Test Product', price=100.00, category=cat, stock=10)

        # Create/Get Cart
        cart, created = Cart.objects.get_or_create(user=user)
        
        # Add Item to Cart
        CartItem.objects.create(cart=cart, product=product, quantity=1, size='M')
        print("Added item to cart.")

        # Simulate Order Creation Logic
        print("Attempting to create order...")
        
        order = Order.objects.create(user=user, status='placed', total_price=0)
        
        total_price = 0
        items_to_create = []
        
        for cart_item in cart.items.all():
            print(f"Processing cart item: {cart_item}")
            order_item = OrderItem(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                price=cart_item.product.price,
                size=cart_item.size
            )
            items_to_create.append(order_item)
            total_price += cart_item.product.price * cart_item.quantity
            
        print(f"Bulk creating {len(items_to_create)} items...")
        OrderItem.objects.bulk_create(items_to_create)
        
        order.total_price = total_price
        order.save()
        
        print(f"Order created successfully! ID: {order.id}, Total: {order.total_price}")
        
        # Cleanup
        cart.items.all().delete()
        print("Cart cleared.")

    except Exception as e:
        print(f"FAILED: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_create_order()
