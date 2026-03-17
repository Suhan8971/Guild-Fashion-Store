
import os
import sys
import django
from dotenv import load_dotenv

load_dotenv()

sys.path.append(os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_project.settings")
django.setup()

from django.test import RequestFactory
from django.contrib.auth import get_user_model
from store.models import Product, Cart, CartItem, Category
from store.views import CartViewSet
from rest_framework.test import force_authenticate

User = get_user_model()

def test_cart_update():
    print("Setting up test environment...")
    # Create user
    user, created = User.objects.get_or_create(username='testcartuser', email='testcart@example.com')
    if created:
        user.set_password('password123')
        user.save()
    
    # Create product
    category, _ = Category.objects.get_or_create(name='Test Category', slug='test-category')
    product, _ = Product.objects.get_or_create(
        name='Test Product',
        category=category,
        price=100.00,
        description='Test Description',
        stock=10
    )

    # Create Cart and CartItem
    cart, _ = Cart.objects.get_or_create(user=user)
    cart_item, _ = CartItem.objects.get_or_create(cart=cart, product=product)
    cart_item.quantity = 1
    cart_item.save()
    print(f"Created CartItem ID: {cart_item.id} with quantity: {cart_item.quantity}")

    # Test update_quantity view using Client to verify URL routing
    from django.test import Client
    client = Client()
    client.force_login(user)

    # Test increasing quantity
    print("\nTesting quantity update to 2 via Client...")
    data = {'item_id': cart_item.id, 'quantity': 2}
    response = client.post('/api/cart/update_quantity/', data, content_type='application/json')
    
    print(f"Response Status: {response.status_code}")
    if response.status_code != 200:
        print(f"Response Content: {response.content.decode()}")

    cart_item.refresh_from_db()
    print(f"New Quantity in DB: {cart_item.quantity}")

    if cart_item.quantity == 2:
        print("SUCCESS: Quantity updated to 2")
    else:
        print("FAILURE: Quantity did not update")

    # Test decreasing quantity
    print("\nTesting quantity update to 1 via Client...")
    data = {'item_id': cart_item.id, 'quantity': 1}
    response = client.post('/api/cart/update_quantity/', data, content_type='application/json')
    
    cart_item.refresh_from_db()
    print(f"New Quantity in DB: {cart_item.quantity}")

    if cart_item.quantity == 1:
        print("SUCCESS: Quantity updated to 1")
    else:
        print("FAILURE: Quantity did not update")

if __name__ == "__main__":
    try:
        test_cart_update()
    except Exception as e:
        print(f"An error occurred: {e}")
