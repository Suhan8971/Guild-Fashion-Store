from django.db import migrations

def rename_pant_category(apps, schema_editor):
    Category = apps.get_model('store', 'Category')
    Product = apps.get_model('store', 'Product')

    # Get or create target category
    bottom_cat, created = Category.objects.get_or_create(
        slug='bottom',
        defaults={'name': 'Bottom'}
    )
    if not created and bottom_cat.name != 'Bottom':
        bottom_cat.name = 'Bottom'
        bottom_cat.save()

    # Move products from Pant to Bottom
    try:
        pant_cat = Category.objects.get(name='Pant')
        Product.objects.filter(category=pant_cat).update(category=bottom_cat)
        pant_cat.delete()
    except Category.DoesNotExist:
        pass

    # Move products from Lower to Bottom
    try:
        lower_cat = Category.objects.get(name='Lower')
        Product.objects.filter(category=lower_cat).update(category=bottom_cat)
        lower_cat.delete()
    except Category.DoesNotExist:
        pass

class Migration(migrations.Migration):

    dependencies = [
        ('store', '0005_rename_pant_matchingoutfit_bottom_and_more'),
    ]

    operations = [
        migrations.RunPython(rename_pant_category),
    ]
