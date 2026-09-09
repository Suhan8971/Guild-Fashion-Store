# Guild Fashion Store - Database Architecture & Schema Analysis

This document provides a detailed breakdown of the database schema, custom tables, relationship diagrams, and business logic mapping for the **Guild Fashion Store** Django backend.

---

## 📌 1. Database Overview
*   **Database Engine**: PostgreSQL
*   **Purpose**: Transactional database (OLTP) optimized for handling customer accounts, profiles, matching outfits, real-time inventory checks, shopping carts, checkout order flows, online payments, post-order return workflows, and audit logging.

---

## 📋 2. Core Tables and Schema Reference

### 👤 `User` Table (Django Model: `User`)
Extends Django's `AbstractUser` to support roles and customized profile data.
*   **Fields**:
    *   `id` (BigIntegerField, PK): Unique auto-increment ID.
    *   `role` (CharField): Defines role access: `developer`, `admin` (Store Owner), or `customer`.
    *   `plain_password` (CharField, Nullable): Used in developer environment audits (if applicable).
    *   `phone_number` (CharField, Nullable): User's primary contact number, used for OTP validations.
*   **Purpose**: Manages customer profiles, admin dashboards, and custom role permissions.

---

### 📍 `Address` Table (Django Model: `Address`)
Maintains a list of delivery addresses for users.
*   **Fields**:
    *   `id` (BigIntegerField, PK): Primary key.
    *   `user_id` (ForeignKey to `User` on delete CASCADE): The user who owns this address.
    *   `full_name` (CharField): Name of recipient.
    *   `phone_number` (CharField): Recipient's phone number.
    *   `house_name` (CharField): House/Flat/Building info.
    *   `street_area` (CharField): Street/Area/Locality description.
    *   `landmark` (CharField, Nullable): Optional landmark nearby.
    *   `city` (CharField): City.
    *   `state` (CharField): State.
    *   `country` (CharField, Default: 'India'): Country.
    *   `pincode` (CharField): Shipping postal code.
    *   `address_type` (CharField): Categorized as `home`, `work`, or `other`.
    *   `is_default` (BooleanField): Flags if this is the default shipping address.
*   **Purpose**: Provides Amazon/Myntra-style address book storage. Prefills shipping fields dynamically on checkout.

---

### 🏷️ `Category` Table (Django Model: `Category`)
Organizes products into taxonomic categories (e.g., Shirts, Pants, Accessories).
*   **Fields**:
    *   `id` (BigIntegerField, PK): Primary key.
    *   `name` (CharField): Human-readable category title.
    *   `slug` (SlugField, Unique): URL-friendly string auto-generated from `name`.
    *   `is_womens` (BooleanField): Distinguishes Men's versus Women's collections.
    *   `is_published` (BooleanField): Visibility toggle on the frontend category menu.
    *   `is_returnable` (BooleanField): Configurable default return eligibility rule.
    *   `is_exchangeable` (BooleanField): Configurable default size exchange eligibility rule.
    *   `updated_at` (DateTimeField): Auto-updated timestamp.
*   **Purpose**: Powers dynamic navigation drawers, responsive off-canvas filters, and returns policies.

---

### 👕 `Product` Table (Django Model: `Product`)
Contains catalog details for individual items sold.
*   **Fields**:
    *   `id` (BigIntegerField, PK): Primary key.
    *   `name` (CharField): Product name.
    *   `category_id` (ForeignKey to `Category` on delete CASCADE): Linked category.
    *   `price` (DecimalField): Selling price (MRP after discounts).
    *   `actual_price` (DecimalField, Default: 0.0): original retail price (MRP). Used for displaying discount tags.
    *   `cost_price` (DecimalField, Default: 0.0): Inventory cost price (used to calculate store profit metrics).
    *   `description` (TextField): Markdown/HTML body describing the product.
    *   `image` (ImageField): Path to main product catalog thumbnail image.
    *   `stock` (PositiveIntegerField): Legacy global stock count.
    *   `sizes` (CharField): Legacy sizes listing helper.
    *   `is_returnable` (BooleanField): Override category-level return eligibility.
    *   `is_exchangeable` (BooleanField): Override category-level exchange eligibility.
*   **Purpose**: Serves as the catalog source of truth.

---

### 📏 `ProductSize` Table (Django Model: `ProductSize`)
Manages inventory at the variant/size level (e.g. Size S, M, L, XL).
*   **Fields**:
    *   `id` (BigIntegerField, PK): Primary key.
    *   `product_id` (ForeignKey to `Product` on delete CASCADE): Reference to parent catalog item.
    *   `size` (CharField): Variant size identifier (S, M, L, XL, XXL).
    *   `quantity` (PositiveIntegerField): Actual stock units remaining on shelves.
    *   `price` (DecimalField, Nullable): Optional price override for specific sizes.
    *   `weight` (DecimalField): Weight in grams (used in Shiprocket shipping cost calculation).
    *   `length` / `width` / `height` (DecimalField): Package volume dimensions in cm (used for volumetric shipping cost).
*   **Purpose**: Manages product variations, actual warehouse inventory tracking, and shipping rates.

---

### 🔗 `MatchingOutfit` Table (Django Model: `MatchingOutfit`)
Models recommendations to help clients match shirts with pants.
*   **Fields**:
    *   `id` (BigIntegerField, PK): Primary key.
    *   `shirt_id` (ForeignKey to `Product` on delete CASCADE): The shirt being viewed.
    *   `bottom_id` (ForeignKey to `Product` on delete CASCADE): Recommended matching bottom product.
*   **Purpose**: Powers "Get Matching Bottoms" upsell features on product description pages.

---

### 🛒 `Cart` Table (Django Model: `Cart`)
Stores active shopping baskets for users.
*   **Fields**:
    *   `id` (BigIntegerField, PK): Primary key.
    *   `user_id` (OneToOneField to `User` on delete CASCADE): Binds one cart to each user.
    *   `created_at` (DateTimeField): Timestamp when cart was initialized.
*   **Purpose**: Persists shopping baskets across sessions and devices.

---

### 🛍️ `CartItem` Table (Django Model: `CartItem`)
Individual rows of products added to a cart.
*   **Fields**:
    *   `id` (BigIntegerField, PK): Primary key.
    *   `cart_id` (ForeignKey to `Cart` on delete CASCADE): Parent cart.
    *   `product_id` (ForeignKey to `Product` on delete CASCADE): The catalog item added.
    *   `quantity` (PositiveIntegerField): Total quantity requested.
    *   `size` (CharField): Selected clothes size.
*   **Purpose**: Tracks items chosen for future checkout.

---

### 📦 `Order` Table (Django Model: `Order`)
Documents checkouts, logistics tracking, and financial transactions.
*   **Fields**:
    *   `id` (BigIntegerField, PK): Primary key (serves as Order ID).
    *   `user_id` (ForeignKey to `User` on delete CASCADE): Customer who placed the order.
    *   `status` (CharField): Options: `placed`, `shipped`, `delivered`, `return_requested`, `returned`, `return_rejected`, `cancelled`, `refunded`.
    *   `created_at` (DateTimeField): Date order was created.
    *   `total_price` (DecimalField): Total price paid by the customer.
    *   `shipping_cost` (DecimalField): Computed Shiprocket shipping charge.
    *   `shipping_name` / `shipping_phone` / `shipping_address` / `shipping_city` / `shipping_state` / `shipping_pincode` (CharField/TextField): Snapshotted shipping coordinates to prevent historic edits from breaking past order details.
    *   `shiprocket_order_id` / `shipment_id` / `awb_code` (CharField, Nullable): Shiprocket tracking IDs.
    *   `delivered_at` (DateTimeField, Nullable): Timestamp when delivery status updated to `delivered`. Used for checking return eligibility windows.
    *   `refund_transaction_id` / `refund_amount` / `refund_status` / `refunded_at` (CharField/DecimalField/DateTimeField): Razorpay online gateway refund audit.
    *   `cancellation_reason` (TextField, Nullable): Reason why order was aborted by admin.
*   **Purpose**: Central hub tracking checkout details, invoice receipts, shipment parameters, and payment status.

---

### 🏷️ `OrderItem` Table (Django Model: `OrderItem`)
Snapshots items purchased at their purchase price.
*   **Fields**:
    *   `id` (BigIntegerField, PK): Primary key.
    *   `order_id` (ForeignKey to `Order` on delete CASCADE): Linked parent order.
    *   `product_id` (ForeignKey to `Product` on delete CASCADE): Reference product.
    *   `quantity` (PositiveIntegerField): Quantity bought.
    *   `price` (DecimalField): Historical price locked at purchase time.
    *   `size` (CharField): Historical size bought.
*   **Purpose**: Prevents pricing/size modifications of catalog items from altering historical sales reports.

---

### 💳 `Transaction` Table (Django Model: `Transaction`)
Records invoice payments processed via payment processors (Razorpay).
*   **Fields**:
    *   `id` (BigIntegerField, PK): Primary key.
    *   `order_id` (ForeignKey to `Order` on delete CASCADE): Associated order.
    *   `payment_id` (CharField): Payment identifier.
    *   `amount` (DecimalField): Amount collected.
    *   `razorpay_order_id` / `razorpay_payment_id` / `razorpay_signature` (CharField): Razorpay webhook validation payload.
    *   `created_at` (DateTimeField): Payment timestamp.
*   **Purpose**: Keeps audit history of successful invoices and financial collections.

---

### 📸 `OrderItemShipmentProof` Table (Django Model: `OrderItemShipmentProof`)
Pre-shipment verification uploads uploaded by admins to avoid fraudulent returns.
*   **Fields**:
    *   `id` (BigIntegerField, PK): Primary key.
    *   `order_id` (ForeignKey to `Order` on delete CASCADE): Target order.
    *   `order_item_id` (ForeignKey to `OrderItem` on delete CASCADE): Specific item.
    *   `image` / `video` (ImageField/FileField): Admin uploads demonstrating item condition.
    *   `uploaded_by_admin_id` (ForeignKey to `User` on delete SET_NULL): Admin who packed the item.
    *   `uploaded_at` (DateTimeField): Timestamp.
    *   `notes` (TextField, Nullable): Text notes.
*   **Purpose**: Protects merchants against return fraud by keeping packing-time evidence.

---

### 🕒 `StockReservation` Table (Django Model: `StockReservation`)
Holds items in inventory during the checkout/payment gateway window.
*   **Fields**:
    *   `id` (BigIntegerField, PK): Primary key.
    *   `user_id` (ForeignKey to `User` on delete CASCADE): Reserving shopper.
    *   `product_id` (ForeignKey to `Product` on delete CASCADE): Target item.
    *   `size` (CharField): Selected size.
    *   `quantity` (PositiveIntegerField): Units held.
    *   `created_at` (DateTimeField): Time reservation was placed.
    *   `expires_at` (DateTimeField): Expiration timestamp (e.g., 5-15 mins).
    *   `is_active` (BooleanField): Toggles off once order completes or reservation expires.
*   **Purpose**: Solves "double selling" issues during concurrent payment operations.

---

### 📜 `InventoryAuditLog` Table (Django Model: `InventoryAuditLog`)
Maintains a detailed change log of product stocks.
*   **Fields**:
    *   `id` (BigIntegerField, PK): Primary key.
    *   `timestamp` (DateTimeField): Auto-created timestamp.
    *   `user_id` (ForeignKey to `User` on delete SET_NULL): User or admin initiating change.
    *   `action` (CharField): Logged action: `reservation_create`, `reservation_expiry`, `purchase_success`, `payment_fail`, `manual_adjust`, `pre_shipment_upload`.
    *   `product_id` (ForeignKey to `Product` on delete CASCADE): Product affected.
    *   `size` (CharField): Size affected.
    *   `quantity` (IntegerField): Quantity offset (negative for deductions, positive for returns/additions).
    *   `order_id` (ForeignKey to `Order` on delete SET_NULL): Order context.
    *   `notes` (TextField): Context notes.
*   **Purpose**: Allows admins to debug stock drift and trace shelf activity.

---

### ⚙️ `ReturnPolicyConfig` Table (Django Model: `ReturnPolicyConfig`)
Stores the dynamic post-purchase settings for returns.
*   **Fields**:
    *   `id` (BigIntegerField, PK): Primary key.
    *   `return_window_days` (PositiveIntegerField): Maximum days from delivery for returns.
    *   `exchange_window_days` (PositiveIntegerField): Maximum days for exchanges.
    *   `reasons` (JSONField): Array of options presented to customers in request menus.
    *   `is_active` (BooleanField): Global enable/disable flag.
*   **Purpose**: Allows admin owners to modify policies dynamically on the fly.

---

### 🔄 `OrderReturnRequest` Table (Django Model: `OrderReturnRequest`)
Parent container for post-order claims (returns, exchanges, replacements).
*   **Fields**:
    *   `id` (BigIntegerField, PK): Primary key.
    *   `order_id` (ForeignKey to `Order` on delete CASCADE): Original purchase invoice.
    *   `user_id` (ForeignKey to `User` on delete CASCADE): Shopper claiming.
    *   `status` (CharField): Options: `requested`, `approved`, `rejected`, `pickup_scheduled`, `picked_up`, `replacement_shipped`, `refunded`, `completed`.
    *   `admin_notes` (TextField, Nullable): Status update notes.
    *   `shiprocket_order_id` / `shipment_id` / `awb_code` / `courier_name` (CharField, Nullable): Shiprocket reverse pickup logistics parameters.
*   **Purpose**: Tracks reverse shipment status, customer claims, and admin approval records.

---

### 📍 `OrderReturnRequestItem` Table (Django Model: `OrderReturnRequestItem`)
Specific items requested for return/exchange in a request.
*   **Fields**:
    *   `id` (BigIntegerField, PK): Primary key.
    *   `request_id` (ForeignKey to `OrderReturnRequest` on delete CASCADE): Parent return request.
    *   `order_item_id` (ForeignKey to `OrderItem` on delete CASCADE): Original item line.
    *   `quantity` (PositiveIntegerField): Quantity claimed.
    *   `request_type` (CharField): Claim type: `return`, `exchange`, `replacement`.
    *   `reason` (CharField): Dropdown reason selected.
    *   `description` (TextField, Nullable): Written explanations.
    *   `image` (ImageField, Nullable): Customer upload demonstrating condition.
    *   `exchange_size` (CharField, Nullable): New size requested (exchanges only).
*   **Purpose**: Manages item-level return details and replacement parameters.

---

### ✉️ `ContactQuery` Table (Django Model: `ContactQuery`)
Records support queries sent from the public website contact form.
*   **Fields**:
    *   `id` (BigIntegerField, PK): Primary key.
    *   `name` / `email` / `phone` (CharField): Sender identity.
    *   `query` (TextField): Support text request.
    *   `is_resolved` (BooleanField): Tracks resolution status.
*   **Purpose**: Power support contact forms.

The above content shows the entire, complete file contents of the requested file.
