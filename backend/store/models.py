from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('developer', 'Developer'),
        ('admin', 'Store Owner'),
        ('customer', 'Customer'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    plain_password = models.CharField(max_length=255, blank=True, null=True)

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Categories'

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=200)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    price = models.DecimalField(max_digits=10, decimal_places=2) # Selling Price
    actual_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00) # MRP / Original Price
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    description = models.TextField()
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    stock = models.PositiveIntegerField(default=0)
    sizes = models.CharField(max_length=50, default='S,M,L,XL')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class ProductSize(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    size = models.CharField(max_length=20)
    quantity = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) # Optional override
    weight = models.DecimalField(max_digits=10, decimal_places=2, default=0.00) # In grams
    length = models.DecimalField(max_digits=5, decimal_places=2, default=0.00) # In cm
    width = models.DecimalField(max_digits=5, decimal_places=2, default=0.00) # In cm
    height = models.DecimalField(max_digits=5, decimal_places=2, default=0.00) # In cm

    def __str__(self):
        return f"{self.product.name} - {self.size}"

class MatchingOutfit(models.Model):
    # Requirement: "While adding a shirt, admin can link matching pants"
    # So shirt is the source, pant is the target.
    shirt = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='suggested_bottoms')
    bottom = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='suggested_for_shirts')

    def __str__(self):
        return f"{self.shirt.name} -> {self.bottom.name}"

class Order(models.Model):
    STATUS_CHOICES = (
        ('placed', 'Placed'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('return_requested', 'Return Requested'),
        ('returned', 'Returned'),
        ('return_rejected', 'Return Rejected'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='placed')
    created_at = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    shipping_state = models.CharField(max_length=100, blank=True, null=True)
    shipping_city = models.CharField(max_length=100, blank=True, null=True)
    
    # Shiprocket Integration Fields
    shiprocket_order_id = models.CharField(max_length=100, blank=True, null=True)
    shipment_id = models.CharField(max_length=100, blank=True, null=True)
    awb_code = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    size = models.CharField(max_length=10, blank=True, null=True)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

class Transaction(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='transactions')
    payment_id = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    razorpay_order_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_signature = models.CharField(max_length=200, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Tx {self.payment_id} - ${self.amount}"
class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cart')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart of {self.user.username}"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    # Consider storing size if products have sizes! The requirement says "whatever things go to cart should go to database".
    # User selects a size for the product (especially clothes).
    size = models.CharField(max_length=10, blank=True, null=True) 

    def __str__(self):
        return f"{self.quantity} x {self.product.name} ({self.size})"

    @property
    def total_price(self):
        return self.product.price * self.quantity

class ReturnRequest(models.Model):
    REASON_CHOICES = (
        ('size', 'Size Issue'),
        ('damaged', 'Damaged Product'),
        ('not_liked', 'Do Not Like It'),
        ('other', 'Other'),
    )
    STATUS_CHOICES = (
        ('pending', 'Pending Approval'),
        ('approved', 'Return Approved'),
        ('rejected', 'Return Rejected'),
    )
    
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='return_request')
    reason = models.CharField(max_length=20, choices=REASON_CHOICES)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='returns/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Return for Order #{self.order.id} - {self.status}"

class ContactQuery(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    query = models.TextField()
    is_resolved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Query from {self.name} - {self.email}"

class OrderItemShipmentProof(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='shipment_proofs')
    order_item = models.ForeignKey(OrderItem, on_delete=models.CASCADE, related_name='shipment_proofs')
    image = models.ImageField(upload_to='shipment_proofs/')
    uploaded_by_admin = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Proof for Order #{self.order.id} - Item {self.order_item.id}"
