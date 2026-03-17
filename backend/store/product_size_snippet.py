from django.db import models

class ProductSize(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    size = models.CharField(max_length=20)
    quantity = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) # Optional override
    weight = models.DecimalField(max_digits=5, decimal_places=2, default=0.00) # In kg

    def __str__(self):
        return f"{self.product.name} - {self.size}"
