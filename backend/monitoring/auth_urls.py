from django.urls import path

from . import views

# Mounted directly under "api/" (not "api/v1/") in config/urls.py,
# to match what the frontend (register.jsx, Login.jsx, VerifyOTP.jsx) calls:
#   POST /api/register/
#   POST /api/verify-otp/
#   POST /api/login/
urlpatterns = [
    path("register/", views.register_user),
    path("verify-otp/", views.verify_otp),
    path("login/", views.login_user),
]