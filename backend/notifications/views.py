from django.utils import timezone
from rest_framework import viewsets, decorators, response
from .models import Notification
from .serializers import NotificationSerializer


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @decorators.action(detail=True, methods=["post"])
    def mark_read(self, request, pk=None):
        n = self.get_object()
        n.read_at = timezone.now()
        n.save(update_fields=["read_at"])
        return response.Response(self.get_serializer(n).data)
