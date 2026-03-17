import requests
import sys

try:
    response = requests.get('http://localhost:8002/api/products/', timeout=5)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("Backend is running and accessible on port 8002.")
    else:
        print("Backend reachable but returned non-200.")
except requests.exceptions.ConnectionError:
    print("Connection refused. Backend NOT running on 8002.")
except Exception as e:
    print(f"Error: {e}")
