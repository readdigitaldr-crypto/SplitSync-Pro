from rest_framework import viewsets, decorators, response
from .models import Trip, TripMember
from .serializers import TripSerializer
from notifications.models import Notification


class TripViewSet(viewsets.ModelViewSet):
    serializer_class = TripSerializer
    search_fields = ["name", "destination", "description"]
    ordering_fields = ["start_date", "created_at", "name"]
    filterset_fields = ["status", "currency"]

    def get_queryset(self):
        return Trip.objects.filter(members=self.request.user).distinct()

    def perform_update(self, serializer):
        serializer.save()

    @decorators.action(detail=True, methods=["post"])
    def archive(self, request, pk=None):
        t = self.get_object()
        t.status = "archived"
        t.save(update_fields=["status"])
        return response.Response(self.get_serializer(t).data)

    @decorators.action(detail=True, methods=["post"])
    def invite(self, request, pk=None):
        t = self.get_object()
        uid = request.data.get("user_id")
        m = TripMember.objects.create(trip=t, user_id=uid)
        Notification.objects.create(
            user_id=uid,
            title="Trip invitation",
            message=f"You were invited to {t.name}.",
            kind="trip_invitation",
        )
        return response.Response({"member_id": str(m.id)})

    @decorators.action(detail=True, methods=["post"])
    def transfer_ownership(self, request, pk=None):
        t = self.get_object()
        t.owner_id = request.data["user_id"]
        t.save(update_fields=["owner"])
        return response.Response(self.get_serializer(t).data)
