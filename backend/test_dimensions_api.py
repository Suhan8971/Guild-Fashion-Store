import os
import django
import json
import sys

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Guild_Backend.settings')
django.setup()

from store.models import Product, Category, User
from rest_framework.test import APIClient

def test_create_product_with_dimensions():
    # Setup test data
    user, _ = User.objects.get_or_create(username='admin', defaults={'role': 'admin', 'is_staff': True})
    category, _ = Category.objects.get_or_create(name='Shirt', slug='shirt')
    
    client = APIClient()
    client.force_authenticate(user=user)

    # Variant data including dimensions
    variants_data = [
        {
            "size": "M",
            "quantity": 10,
            "weight": 500.0,
            "length": 15.0,
            "width": 20.0,
            "height": 5.0
        },
        {
            "size": "L",
            "quantity": 5,
            "weight": 600.0,
            "length": 16.0,
            "width": 21.0,
            "height": 6.0
        }
    ]

    # Payload
    payload = {
        'name': 'Dimension Test Shirt',
        'category': category.id,
        'price': '49.99',
        'actual_price': '59.99',
        'description': 'Testing dimensions.',
        'stock': 15,
        'sizes': 'M,L',
        'variants': json.dumps(variants_data) # Send as JSON string like frontend
    }

    # Simulate multipart/form-data request
    response = client.post('/api/products/', payload, format='multipart')
    
    if response.status_code == 201:
        print("Product created successfully!")
        product_id = response.data['id']
        
        # Verify from DB directly
        product = Product.objects.prefetch_related('variants').get(id=product_id)
        print(f"Product: {product.name}")
        for variant in product.variants.all():
            print(f"  Size: {variant.size}, L: {variant.length}, W: {variant.width}, H: {variant.height}, Weight: {variant.weight}")
            
            # Assertion
            if variant.size == 'M':
                assert float(variant.length) == 15.0, f"Expected L 15.0, got {variant.length}"
                assert float(variant.width) == 20.0, f"Expected W 20.0, got {variant.width}"
                assert float(variant.height) == 5.0, f"Expected H 5.0, got {variant.height}"
            elif variant.size == 'L':
                assert float(variant.length) == 16.0, f"Expected L 16.0, got {variant.length}"
            
        print("Success: Dimension assertions passed!")
    else:
        print(f"Failed to create product: {response.data}")

if __name__ == '__main__':
    test_create_product_with_dimensions()
