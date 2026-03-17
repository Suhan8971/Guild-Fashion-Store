
import os
import django
from dotenv import load_dotenv

load_dotenv()

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend_project.settings")
django.setup()

from store.models import Category, Product

def check_everything():
    print("--- Categories ---")
    cats = Category.objects.all()
    found = False
    for c in cats:
        print(f"ID: {c.id} | Name: '{c.name}' | Slug: '{c.slug}'")
        if 'testcat' in c.name.lower() or 'testcat' in c.slug.lower():
            print(f"!!! FOUND MATCH !!! Deleting ID {c.id}...")
            c.delete()
            found = True
            print("Deleted.")

    if not found:
        print("No category matching 'testcat' found.")

    print("\n--- Products ---")
    prods = Product.objects.all()
    for p in prods:
        print(f"ID: {p.id} | Name: '{p.name}' | Category: '{p.category.name}'")

if __name__ == '__main__':
    check_everything()
