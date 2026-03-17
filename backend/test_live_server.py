
import requests
import sys

def test_live_server():
    print("Testing live server at http://localhost:8000/api/cart/update_quantity/")
    
    # We need a token to test this properly, or at least get a 401/403.
    # If we get 404, it confirms the endpoint is missing.
    
    url = "http://localhost:8000/api/cart/update_quantity/"
    try:
        response = requests.post(url, json={'item_id': 1, 'quantity': 2})
        print(f"Response Status Code: {response.status_code}")
        print(f"Response Content: {response.text}")
        
        if response.status_code == 404:
            print("FAILURE: Endpoint not found (404)")
            sys.exit(1)
        elif response.status_code == 401:
            print("SUCCESS: Endpoint exists (got 401 Unauthorized as expected without token)")
            sys.exit(0)
        elif response.status_code == 200:
             print("SUCCESS: Endpoint exists and worked")
             sys.exit(0)
        else:
             print(f"Endpoint exists, returned {response.status_code}")
             sys.exit(0)

    except requests.exceptions.ConnectionError:
        print("FAILURE: Could not connect to server. Is it running?")
        sys.exit(1)

if __name__ == "__main__":
    test_live_server()
