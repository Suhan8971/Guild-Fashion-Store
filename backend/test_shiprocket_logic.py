import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from store.models import Product, Category, User, Order, OrderItem, ProductSize
from store.shiprocket_service import ShiprocketClient
from unittest.mock import patch, MagicMock

# 1. Create Mock Models without committing to DB for a quick logic test
class MockUser:
    def __init__(self):
        self.username = "test_user"
        self.email = "test@test.com"
        self.first_name = "Test"
        self.last_name = "User"

class MockVariant:
    def __init__(self, size, weight, length, width, height):
        self.size = size
        self.weight = weight
        self.length = length
        self.width = width
        self.height = height

class MockQuerySet:
    def __init__(self, data):
        self.data = data
    def all(self):
        return self.data
    def get(self, **kwargs):
        size = kwargs.get('size')
        for i in self.data:
            if i.size == size:
                return i
        raise Exception("Not Found")
    def count(self):
        return len(self.data)

class MockProduct:
    def __init__(self, name, id, variants):
        self.name = name
        self.id = id
        self.variants = MockQuerySet(variants)

class MockOrderItem:
    def __init__(self, product, size, quantity, price):
        self.product = product
        self.size = size
        self.quantity = quantity
        self.price = price

class MockOrder:
    def __init__(self, items):
        self.id = 999
        self.user = MockUser()
        self.total_price = 2000
        self.items = MockQuerySet(items)

v1 = MockVariant("M", 500, 30, 25, 5)
v2 = MockVariant("L", 700, 30, 25, 5)
v3 = MockVariant("S", 300, 20, 15, 2)

p1 = MockProduct('Shirt', 1, [v1])
p2 = MockProduct('Pants', 2, [v2])
p3 = MockProduct('T-shirt', 3, [v3])

oi1 = MockOrderItem(p1, "M", 1, 500)
oi2 = MockOrderItem(p2, "L", 1, 700)
oi3 = MockOrderItem(p3, "S", 2, 300)

o = MockOrder([oi1, oi2, oi3])

# Run the logic via mock
with patch('requests.post') as mock_post:
    client = ShiprocketClient()
    client.token = "mock_token" # Bypass login
    
    mock_post.return_value = MagicMock()
    mock_post.return_value.status_code = 200
    mock_post.return_value.json.return_value = {"order_id": "test"}
    
    client.create_order(o)
    
    called_args, called_kwargs = mock_post.call_args
    payload = called_kwargs['json']
    
    print("\n📦 Test Shiprocket Payload Dimensions:")
    print(f"Calculated Weight (kg): {payload['weight']}  -- Expected: 1.8")
    print(f"Calculated Length (cm): {payload['length']}    -- Expected: 30")
    print(f"Calculated Breadth (cm): {payload['breadth']}   -- Expected: 25")
    # Height = Shirt(5x1) + Pants(5x1) + Tshirt(2x2) = 5 + 5 + 4 = 14
    print(f"Calculated Height (cm): {payload['height']}    -- Expected: 14")
    
    # Assertions
    assert payload['weight'] == 1.8, "Weight calculation failed"
    assert payload['length'] == 30.0, "Length calculation failed"
    assert payload['breadth'] == 25.0, "Breadth calculation failed"
    assert payload['height'] == 14.0, "Height calculation failed"
    
    print("\n✅ All logic assertions passed perfectly according to the rules!")
