
import os
import django
from django.utils.text import slugify
from dotenv import load_dotenv

load_dotenv()

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_project.settings")
django.setup()

from store.models import Category, Product

def clean_categories():
    allowed_map = {
        'Shirt': 'shirt',
        'Pant': 'pant',
        'T-Shirt': 't-shirt',
        'Lower': 'lower'
    }
    
    # 1. Create desired categories
    created_cats = {}
    for name, slug in allowed_map.items():
        cat, created = Category.objects.get_or_create(name=name, defaults={'slug': slug})
        created_cats[name] = cat
        if created:
            print(f"Created category: {name}")
        else:
            print(f"Category exists: {name}")

    # 2. Map known bad categories to good ones (optional migration)
    corrections = {
        'Tshirt': 'T-Shirt',
        'tshirt': 'T-Shirt',
        'Pants': 'Pant',
        'pants': 'Pant',
        'Shirts': 'Shirt',
        'Lowers': 'Lower'
    }

    for bad, good in corrections.items():
        try:
            bad_cat = Category.objects.get(name__iexact=bad)
            # Ensure it's not one of the good ones (e.g. if 'Pant' is in corrections for some reason)
            if bad_cat.name in allowed_map:
                continue
                
            good_cat = created_cats[good]
            cnt = Product.objects.filter(category=bad_cat).update(category=good_cat)
            if cnt > 0:
                print(f"Moved {cnt} products from '{bad_cat.name}' to '{good_cat.name}'")
            bad_cat.delete()
            print(f"Deleted bad category: {bad_cat.name}")
        except Category.DoesNotExist:
            pass

    # 3. Delete any other categories not in the allowed list
    all_cats = Category.objects.all()
    for cat in all_cats:
        if cat.name not in allowed_map:
            # Check if it has products?
            count = Product.objects.filter(category=cat).count()
            if count > 0:
                print(f"WARNING: Category '{cat.name}' has {count} products. Moving to 'Shirt' (default) before deleting.")
                Product.objects.filter(category=cat).update(category=created_cats['Shirt'])
            
            cat.delete()
            print(f"Deleted unauthorized category: {cat.name}")

    print("\nFinal Categories:")
    for c in Category.objects.all():
        print(f"- {c.name} (slug: {c.slug})")

if __name__ == '__main__':
    clean_categories()
