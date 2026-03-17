from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView, ProductViewSet, CategoryViewSet, MatchingOutfitViewSet, 
    OrderViewSet, DashboardStatsView, CustomAuthToken, CartViewSet,
    CreateRazorpayOrder, VerifyRazorpayPayment, GoogleLogin, AnalyticsView,
    SendOTPView, VerifyOTPView, SendRegistrationEmailOTPView, VerifyRegistrationEmailOTPView,
    ReturnRequestViewSet, ContactQueryViewSet, SuperAdminViewSet, OrderItemShipmentProofViewSet
)
from dj_rest_auth.views import UserDetailsView

router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'matching-outfits', MatchingOutfitViewSet)
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'returns', ReturnRequestViewSet, basename='returnrequest')
router.register(r'queries', ContactQueryViewSet, basename='queries')
router.register(r'superadmin/users', SuperAdminViewSet, basename='superadmin-users')
router.register(r'shipment-proofs', OrderItemShipmentProofViewSet, basename='shipment-proofs')

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', CustomAuthToken.as_view(), name='login'),
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('payment/create/', CreateRazorpayOrder.as_view(), name='payment-create'),
    path('payment/verify/', VerifyRazorpayPayment.as_view(), name='payment-verify'),
    path('auth/google/', GoogleLogin.as_view(), name='google_login'),
    path('analytics/', AnalyticsView.as_view(), name='analytics'),
    path('auth/user/', UserDetailsView.as_view(), name='rest_user_details'),
    path('checkout/send-otp/', SendOTPView.as_view(), name='send_otp'),
    path('checkout/verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('auth/send-email-otp/', SendRegistrationEmailOTPView.as_view(), name='send_email_otp'),
    path('auth/verify-email-otp/', VerifyRegistrationEmailOTPView.as_view(), name='verify_email_otp'),
    path('', include(router.urls)),
]
