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
    phone_number = models.CharField(max_length=20, blank=True, null=True)

class Address(models.Model):
    ADDRESS_TYPE_CHOICES = (
        ('home', 'Home'),
        ('work', 'Work'),
        ('other', 'Other'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    full_name = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    house_name = models.CharField(max_length=255)
    street_area = models.CharField(max_length=255)
    landmark = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default='India')
    pincode = models.CharField(max_length=20)
    address_type = models.CharField(max_length=10, choices=ADDRESS_TYPE_CHOICES, default='home')
    is_default = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.is_default:
            Address.objects.filter(user=self.user).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.full_name} - {self.address_type} ({self.pincode})"

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    is_womens = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    is_returnable = models.BooleanField(default=True)
    is_exchangeable = models.BooleanField(default=True)
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
    is_returnable = models.BooleanField(default=True)
    is_exchangeable = models.BooleanField(default=True)
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
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='placed')
    created_at = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    shipping_state = models.CharField(max_length=100, blank=True, null=True)
    shipping_city = models.CharField(max_length=100, blank=True, null=True)
    shipping_name = models.CharField(max_length=255, blank=True, null=True)
    shipping_address = models.TextField(blank=True, null=True)
    shipping_pincode = models.CharField(max_length=20, blank=True, null=True)
    shipping_phone = models.CharField(max_length=20, blank=True, null=True)
    
    # Shiprocket Integration Fields
    shiprocket_order_id = models.CharField(max_length=100, blank=True, null=True)
    shipment_id = models.CharField(max_length=100, blank=True, null=True)
    awb_code = models.CharField(max_length=100, blank=True, null=True)
    delivered_at = models.DateTimeField(blank=True, null=True)

    # Order Cancellation & Refund Fields
    refund_transaction_id = models.CharField(max_length=100, blank=True, null=True)
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    refund_status = models.CharField(max_length=50, blank=True, null=True)
    refunded_at = models.DateTimeField(blank=True, null=True)
    cancellation_reason = models.TextField(blank=True, null=True)
    refund_gateway_response = models.JSONField(blank=True, null=True)

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
    image = models.ImageField(upload_to='shipment_proofs/', blank=True, null=True)
    video = models.FileField(upload_to='shipment_proof_videos/', blank=True, null=True)
    uploaded_by_admin = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Proof for Order #{self.order.id} - Item {self.order_item.id}"

class ReturnPolicyConfig(models.Model):
    return_window_days = models.PositiveIntegerField(default=7)
    exchange_window_days = models.PositiveIntegerField(default=7)
    reasons = models.TextField(default="Size Issue, Damaged Product, Do Not Like It, Wrong Item, Other")
    is_active = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    @classmethod
    def get_solo(cls):
        obj, _ = cls.objects.get_or_create(id=1)
        return obj

    def __str__(self):
        return f"Return Policy ({self.return_window_days} days)"

class StockReservation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='stock_reservations')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    size = models.CharField(max_length=20)
    quantity = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def __str__(self):
        return f"Reservation for {self.user.username} - {self.product.name} ({self.size}) x {self.quantity}"

class OrderReturnRequest(models.Model):
    STATUS_CHOICES = (
        ('requested', 'Requested'),
        ('approved', 'Approved'),
        ('pickup_scheduled', 'Pickup Scheduled'),
        ('picked_up', 'Picked Up'),
        ('refunded', 'Refunded'),
        ('replacement_shipped', 'Replacement Shipped'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected'),
    )
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='multi_return_requests')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='multi_return_requests')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='requested')
    admin_notes = models.TextField(blank=True, null=True)
    shiprocket_order_id = models.CharField(max_length=100, blank=True, null=True)
    shipment_id = models.CharField(max_length=100, blank=True, null=True)
    awb_code = models.CharField(max_length=100, blank=True, null=True)
    courier_name = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Return Request #{self.id} for Order #{self.order.id} ({self.status})"

class OrderReturnRequestItem(models.Model):
    REQUEST_TYPE_CHOICES = (
        ('return', 'Return & Refund'),
        ('exchange', 'Size Exchange'),
        ('replacement', 'Replacement'),
    )
    request = models.ForeignKey(OrderReturnRequest, on_delete=models.CASCADE, related_name='items')
    order_item = models.ForeignKey(OrderItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    request_type = models.CharField(max_length=20, choices=REQUEST_TYPE_CHOICES, default='return')
    reason = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='return_proofs/', blank=True, null=True)
    exchange_size = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"RequestItem #{self.id} ({self.request_type}) - {self.order_item.product.name}"

class InventoryAuditLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='inventory_logs')
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=50) # manual_adjust, order_fulfillment, return_restock
    size = models.CharField(max_length=20, blank=True, null=True)
    quantity = models.IntegerField() # positive for addition, negative for deduction
    notes = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Inventory Log #{self.id} - {self.product.name} ({self.action}): {self.quantity}"
