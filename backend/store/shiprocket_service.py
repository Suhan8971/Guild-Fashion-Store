import requests
import os
import json
from datetime import datetime

class ShiprocketClient:
    BASE_URL = "https://apiv2.shiprocket.in/v1/external"

    def __init__(self):
        self.email = os.environ.get('SHIPROCKET_EMAIL')
        self.password = os.environ.get('SHIPROCKET_PASSWORD')
        self.token = None

    def login(self):
        url = f"{self.BASE_URL}/auth/login"
        payload = {
            "email": self.email,
            "password": self.password
        }
        try:
            response = requests.post(url, json=payload)
            if response.status_code == 200:
                self.token = response.json().get('token')
                return True
            else:
                print(f"Shiprocket Login Failed: {response.text}")
                return False
        except Exception as e:
            print(f"Shiprocket Login Error: {e}")
            return False

    def create_order(self, order):
        if not self.token:
            if not self.login():
                return None

        url = f"{self.BASE_URL}/orders/create/adhoc"
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.token}'
        }

        # Prepare Order Items
        order_items = []
        for item in order.items.all():
            order_items.append({
                "name": item.product.name,
                "sku": str(item.product.id),
                "units": item.quantity,
                "selling_price": float(item.price),
                "discount": "",
                "tax": "",
                "hsn": "" 
            })

        # Prepare Payload (Basic Mock Data for now as strict validation exists)
        # In a real app, address details should come from the user/order
        current_date = datetime.now().strftime("%Y-%m-%d %H:%M")
        
        # Calculate total weight in kg and estimated box dimensions
        total_weight_grams = 0
        max_length = 0
        max_breadth = 0
        total_height = 0

        for item in order.items.all():
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
                # Length = max(item lengths)
                if item_length > max_length:
                    max_length = item_length
                    
                # Breadth/Width = max(item widths)
                if item_width > max_breadth:
                    max_breadth = item_width
                    
                # Height = sum(item heights) across all quantities
                total_height += (item_height * item.quantity)
                
            except Exception:
                # Fallback if variant not found or no size
                total_weight_grams += 0 # Or a default weight
                
        # Shiprocket expects weight in KG, and at least some positive value (min 0.5kg usually enforced)
        total_weight_kg = max(total_weight_grams / 1000.0, 0.5)
        
        # Ensure dimensions are at least 1 cm to avoid API errors (0 length will fail validation)
        final_length = max(float(max_length), 1.0)
        final_breadth = max(float(max_breadth), 1.0)
        final_height = max(float(total_height), 1.0)
        payload = {
            "order_id": str(order.id),
            "order_date": current_date,
            "pickup_location": "Primary", # User needs to set this in Shiprocket Panel
            "billing_customer_name": order.user.first_name or order.user.username,
            "billing_last_name": order.user.last_name or "",
            "billing_address": "Test Address", # Placeholder
            "billing_city": "Bangalore",
            "billing_pincode": "560001",
            "billing_state": "Karnataka",
            "billing_country": "India",
            "billing_email": order.user.email,
            "billing_phone": "9999999999", # Placeholder
            "shipping_is_billing": True,
            "order_items": order_items,
            "payment_method": "Prepaid",
            "sub_total": float(order.total_price),
            "length": final_length,
            "breadth": final_breadth,
            "height": final_height,
            "weight": total_weight_kg
        }

        try:
            response = requests.post(url, json=payload, headers=headers)
            if response.status_code == 200:
                return response.json()
            else:
                print(f"Shiprocket Create Order Failed: {response.text}")
                return {"error": response.text}
        except Exception as e:
             return {"error": str(e)}

    def calculate_shipping_rate(self, pickup_pincode, delivery_pincode, weight, length, breadth, height, declared_value):
        if not self.token:
            if not self.login():
                return {"error": "Failed to authenticate with Shiprocket API."}

        url = f"{self.BASE_URL}/courier/generate/awb" # Wait, the requirement says "call Shiprocket rate API (serviceability / courier rate)"
        # actually the rate API is /v1/external/courier/serviceability/
        url = f"{self.BASE_URL}/courier/serviceability/"
        
        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.token}'
        }

        params = {
            'pickup_postcode': pickup_pincode,
            'delivery_postcode': delivery_pincode,
            'weight': max(float(weight), 0.5), # Minimum 0.5 kg
            'cod': 0, # Assuming Prepaid for now
            'declared_value': float(declared_value),
            'length': max(float(length), 1.0),
            'breadth': max(float(breadth), 1.0),
            'height': max(float(height), 1.0)
        }

        try:
            response = requests.get(url, headers=headers, params=params)
            if response.status_code == 200:
                data = response.json()
                if data.get('status') == 200 and data.get('data') and data['data'].get('available_courier_companies'):
                    couriers = data['data']['available_courier_companies']
                    # Get the recommended or cheapest courier rate
                    # Here we fetch the lowest rate available
                    cheapest_courier = min(couriers, key=lambda x: x.get('rate', float('inf')))
                    
                    return {
                        "status": "success",
                        "shipping_cost": cheapest_courier.get('rate'),
                        "courier_name": cheapest_courier.get('courier_name'),
                        "estimated_delivery_days": cheapest_courier.get('etd') # Estimated Time of Delivery
                    }
                else:
                    print(f"Shiprocket Serviceability Failed Data: {data}")
                    return {"error": "No courier service available for the selected pincode.", "details": data}
            else:
                print(f"Shiprocket Rate API Failed: {response.text}")
                return {"error": response.text}
        except Exception as e:
            print(f"Shiprocket Rate Exception: {e}")
            return {"error": str(e)}
