
import os
import django
import sys

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from store.models import Category

try:
    cat = Category.objects.filter(slug='test-category').first()
    if not cat:
        cat = Category.objects.filter(name='test-category').first()

    if cat:
        print(f"Deleting category: {cat.name} (slug: {cat.slug})")
        cat.delete()
        print("Successfully deleted.")
    else:
        print("Category 'test-category' not found.")
except Exception as e:
    print(f"Error: {e}")
