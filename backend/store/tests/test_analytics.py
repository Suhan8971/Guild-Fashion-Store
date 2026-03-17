from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from store.models import Product, Order, OrderItem, Category

User = get_user_model()

class AnalyticsViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='admin', password='password', role='admin')
        self.client.force_authenticate(user=self.user)
        
        self.category = Category.objects.create(name='Test Category', slug='test-category')
        self.product = Product.objects.create(
            name='Test Product', 
            price=100.00, 
            cost_price=50.00,
            category=self.category,
            description='Test'
        )
        
        self.order = Order.objects.create(
            user=self.user,
            total_price=100.00,
            status='placed'
        )
        OrderItem.objects.create(
            order=self.order,
            product=self.product,
            quantity=1,
            price=100.00
        )

    def test_get_analytics(self):
        url = reverse('analytics')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_sales', response.data)
        self.assertIn('total_investment', response.data)
        self.assertIn('profit', response.data)
        self.assertIn('peak_hours', response.data)
        self.assertIn('sales_over_time', response.data)
        
        self.assertEqual(float(response.data['total_sales']), 100.00)
        self.assertEqual(float(response.data['total_investment']), 50.00)
        self.assertEqual(float(response.data['profit']), 50.00)
