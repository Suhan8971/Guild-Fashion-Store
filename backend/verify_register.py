import requests

url = "http://127.0.0.1:8000/api/auth/register/"

print("TEST 1: Register a new user (testuser_auth, test_auth@example.com)")
data = {
    "username": "testuser_auth",
    "email": "test_auth@example.com",
    "password": "SecurePassword123",
    "role": "admin"  # Attempt to pass admin role (should be ignored)
}
res = requests.post(url, json=data)
print(f"Status Code: {res.status_code}")
print(f"Response: {res.json()}")
print("-" * 50)

print("TEST 2: Attempt duplicate email registration (different username, same email)")
data_duplicate = {
    "username": "duplicate_user_auth",
    "email": "test_auth@example.com",
    "password": "SecurePassword123"
}
res_dup = requests.post(url, json=data_duplicate)
print(f"Status Code: {res_dup.status_code}")
print(f"Response: {res_dup.json()}")
