from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('store.urls')),
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('accounts/', include('allauth.urls')),

    # This is required to prevent a NoReverseMatch error when dj-rest-auth sends the password reset email, 
    # even though the actual URL sent to the user is governed by PASSWORD_RESET_CONFIRM_URL in settings.
    path('password-reset/<uidb64>/<token>/', TemplateView.as_view(template_name="password_reset_confirm.html"), name='password_reset_confirm'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
