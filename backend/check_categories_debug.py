import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from store.models import Category

print("Existing Categories:")
for cat in Category.objects.all():
    print(f"- {cat.name} (slug: {cat.slug})")

if not Category.objects.exists():
    print("No categories found!")
