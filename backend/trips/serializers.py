from django.contrib.auth import get_user_model
from rest_framework import serializers
from accounts.serializers import UserSerializer
from .models import Trip, TripMember

User = get_user_model()


class TripSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    members = UserSerializer(many=True, read_only=True)
    member_ids = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), many=True, write_only=True, required=False
    )

    class Meta:
        model = Trip
        fields = (
            "id",
            "name",
            "destination",
            "description",
            "currency",
            "start_date",
            "end_date",
            "trip_image_url",
            "owner",
            "members",
            "member_ids",
            "status",
            "created_at",
        )

    def validate(self, data):
        if (
            data.get("end_date")
            and data.get("start_date")
            and data["end_date"] < data["start_date"]
        ):
            raise serializers.ValidationError("End date cannot be before start date.")
        return data

    def create(self, data):
        ids = data.pop("member_ids", [])
        trip = Trip.objects.create(owner=self.context["request"].user, **data)
        TripMember.objects.create(trip=trip, user=trip.owner)
        for u in ids:
            TripMember.objects.get_or_create(trip=trip, user=u)
        return trip


class TripMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = TripMember
        fields = "__all__"
