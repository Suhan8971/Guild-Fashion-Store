import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from store.models import Order
Order.objects.filter(id=8).update(status='delivered')
print('Order 8 updated to delivered successfully.')
