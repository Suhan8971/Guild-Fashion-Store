from store.models import Category, Product, User, MatchingOutfit

from django.utils.text import slugify

def seed():
    # Create Categories
    cats = ['Shirt', 'Pant', 'Lower', 'T-Shirt']
    categories = []
    for c in cats:
        cat, created = Category.objects.get_or_create(name=c, defaults={'slug': slugify(c)})
        categories.append(cat)
    
    print(f"Created {len(categories)} categories.")

    # Create Products
    products = [
        {'name': 'Classic White Tee', 'price': 29.99, 'stock': 100, 'category': categories[0], 'image': 'https://plus.unsplash.com/premium_photo-1673327680679-b1d54be2f6d6?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
        {'name': 'Slim Fit Jeans', 'price': 59.99, 'stock': 50, 'category': categories[1], 'image': 'https://images.unsplash.com/photo-1598522325327-14238190740a?q=80&w=1549&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
        {'name': 'Leather Jacket', 'price': 199.99, 'stock': 20, 'category': categories[2], 'image': 'https://images.unsplash.com/photo-1551028919-ac7edd0583dc?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
        {'name': 'Black Chinos', 'price': 49.99, 'stock': 60, 'category': categories[1], 'image': 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1394&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
        {'name': 'Denim Jacket', 'price': 89.99, 'stock': 30, 'category': categories[2], 'image': 'https://images.unsplash.com/photo-1520975661595-dc9982fb0b52?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'},
    ]

    created_products = []
    for p in products:
        prod, created = Product.objects.get_or_create(name=p['name'], defaults=p)
        if created:
            print(f"Created product: {prod.name}")
        created_products.append(prod)

    # Create Matching Outfits
    
    if len(created_products) >= 4:
        tee = created_products[0]
        jeans = created_products[1]
        jacket = created_products[2]
        chinos = created_products[3]

        MatchingOutfit.objects.get_or_create(shirt=tee, pants=jeans)
        MatchingOutfit.objects.get_or_create(shirt=jacket, pants=chinos)
        print("Created matching outfits.")

    print("Seeding complete.")
