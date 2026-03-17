import requests
import json

data = {
    'name': 'Test API Shirt',
    'price': '100.00',
    'category': 1,  # Assuming shirt category exists here
    'stock': '10',
    'description': 'Test Description',
    'sizes': 'S,M',
    'variants': json.dumps([
        {'size': 'S', 'quantity': 5, 'weight': 0.1, 'price': '100.00'},
        {'size': 'M', 'quantity': 5, 'weight': 0.1, 'price': '100.00'}
    ])
}

# Add a dummy file to simulate multipart/form-data with a file (even if it's not strictly required in the model, Django forms sometimes expect it depending on how the frontend sends it, but let's test just the data first)
response = requests.post('http://localhost:8000/api/products/', data=data)

print(response.status_code)
print(response.json())

# Check variants in db via shell
