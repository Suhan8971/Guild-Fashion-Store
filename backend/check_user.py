import os
import django
from dotenv import load_dotenv

load_dotenv()

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_project.settings")
django.setup()

from django.contrib.auth import get_user_model
User = get_user_model()

try:
    # Check by email or username
    email = os.getenv('DEBUG_USER_EMAIL', 'debug@example.com')
    password = os.getenv('DEBUG_USER_PASSWORD', 'debugpass')
    u = User.objects.filter(email=email).first() or User.objects.filter(username=email).first()
    
    if u:
        print(f"User found: {u.username} (Email: {u.email})")
        print(f"Password check: {u.check_password(password)}")
    else:
        print("User not found")
except User.DoesNotExist:
    print("User not found")
except Exception as e:
    print(f"Error: {e}")
