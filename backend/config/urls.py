from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
urlpatterns=[path('admin/', admin.site.urls), path('api/auth/', include('accounts.urls')), path('api/friends/', include('friends.urls')), path('api/trips/', include('trips.urls')), path('api/expenses/', include('expenses.urls')), path('api/payments/', include('payments.urls')), path('api/reports/', include('reports.urls')), path('api/notifications/', include('notifications.urls'))]
