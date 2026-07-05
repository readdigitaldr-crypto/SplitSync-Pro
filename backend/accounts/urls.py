from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, ProfileView, ChangePasswordView, LogoutView, EmailLoginView

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", EmailLoginView.as_view()),
    path("refresh/", TokenRefreshView.as_view()),
    path("logout/", LogoutView.as_view()),
    path("profile/", ProfileView.as_view()),
    path("change-password/", ChangePasswordView.as_view()),
]
