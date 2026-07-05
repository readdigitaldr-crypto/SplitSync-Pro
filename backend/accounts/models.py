from django.contrib.auth.models import AbstractUser
from django.db import models
class User(AbstractUser):
    full_name=models.CharField(max_length=160, blank=True)
    profile_picture_url=models.URLField(blank=True)
    phone=models.CharField(max_length=32, blank=True)
    preferred_currency=models.CharField(max_length=8, default='INR')
    def display_name(self): return self.full_name or self.username
