from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import viewsets, decorators, response, status, filters
from accounts.serializers import UserSerializer
from .models import FriendRequest, Friendship
from .serializers import FriendRequestSerializer, FriendshipSerializer
from notifications.models import Notification
User=get_user_model()
class UserSearchViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class=UserSerializer; filter_backends=[filters.SearchFilter]; search_fields=['username','full_name','email']
    def get_queryset(self): return User.objects.exclude(id=self.request.user.id)
class FriendRequestViewSet(viewsets.ModelViewSet):
    serializer_class=FriendRequestSerializer
    def get_queryset(self): return FriendRequest.objects.filter(sender=self.request.user) | FriendRequest.objects.filter(receiver=self.request.user)
    def perform_create(self, serializer):
        req=serializer.save(); Notification.objects.create(user=req.receiver,title='New friend request',message=f'{req.sender.display_name()} sent a friend request.',kind='friend_request')
    @decorators.action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        fr=self.get_object()
        if fr.receiver != request.user: return response.Response(status=403)
        with transaction.atomic():
            fr.status='accepted'; fr.save(update_fields=['status']); Friendship.objects.get_or_create(user=fr.sender,friend=fr.receiver); Friendship.objects.get_or_create(user=fr.receiver,friend=fr.sender)
        return response.Response(self.get_serializer(fr).data)
    @decorators.action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        fr=self.get_object(); fr.status='rejected'; fr.save(update_fields=['status']); return response.Response(self.get_serializer(fr).data)
    @decorators.action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        fr=self.get_object(); fr.status='cancelled'; fr.save(update_fields=['status']); return response.Response(self.get_serializer(fr).data)
class FriendshipViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class=FriendshipSerializer
    def get_queryset(self): return Friendship.objects.filter(user=self.request.user)
    @decorators.action(detail=True, methods=['delete'])
    def remove(self, request, pk=None):
        f=self.get_object(); Friendship.objects.filter(user=f.friend,friend=request.user).delete(); f.delete(); return response.Response(status=204)
