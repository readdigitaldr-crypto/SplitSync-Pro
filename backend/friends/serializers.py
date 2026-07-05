from django.contrib.auth import get_user_model
from rest_framework import serializers
from accounts.serializers import UserSerializer
from .models import FriendRequest, Friendship

User = get_user_model()


class FriendRequestSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    receiver_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source="receiver", write_only=True
    )

    class Meta:
        model = FriendRequest
        fields = ("id", "sender", "receiver", "receiver_id", "status", "created_at")

    def validate_receiver(self, v):
        if v == self.context["request"].user:
            raise serializers.ValidationError("Cannot friend yourself.")
        return v

    def create(self, data):
        return FriendRequest.objects.create(sender=self.context["request"].user, **data)


class FriendshipSerializer(serializers.ModelSerializer):
    friend = UserSerializer(read_only=True)

    class Meta:
        model = Friendship
        fields = ("id", "friend", "created_at")
