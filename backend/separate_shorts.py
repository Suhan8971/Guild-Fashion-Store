import os
import django
import sys
from dotenv import load_dotenv

load_dotenv()

sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from store.models import Category, Product
from django.db.models import Q

def separate_shorts():
    # 1. Create Short Category
    short_cat, created = Category.objects.get_or_create(name='Short', slug='short')
    if created:
        print("Created 'Short' category.")
    else:
        print("'Short' category already exists.")

    try:
        bottom_cat = Category.objects.get(slug='bottom')
    except Category.DoesNotExist:
        print("'Bottom' category does not exist. Skipping migration.")
        return

    # 2. Find products in Bottom that are likely Shorts
    # Look for 'short' in name or description
    products_to_move = Product.objects.filter(
        category=bottom_cat
    ).filter(
        Q(name__icontains='short') | 
        Q(description__icontains='short')
    )

    count = products_to_move.count()
    print(f"Found {count} products in 'Bottom' that look like Shorts.")

    # 3. Move them
    if count > 0:
        for product in products_to_move:
            print(f"Moving '{product.name}' to Short category.")
            product.category = short_cat
            product.save()
        print("Migration complete.")
    else:
        print("No products to move.")

if __name__ == "__main__":
    separate_shorts()
