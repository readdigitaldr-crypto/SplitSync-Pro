from django.conf import settings
from django.db import models
from common.models import TimeStampedUUIDModel


class FriendRequest(TimeStampedUUIDModel):
    class Status(models.TextChoices):
        PENDING = "pending"
        ACCEPTED = "accepted"
        REJECTED = "rejected"
        CANCELLED = "cancelled"

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sent_friend_requests",
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="received_friend_requests",
    )
    status = models.CharField(
        max_length=16, choices=Status.choices, default=Status.PENDING
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["sender", "receiver"], name="unique_friend_request"
            )
        ]


class Friendship(TimeStampedUUIDModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="friendships"
    )
    friend = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="friend_of"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["user", "friend"], name="unique_friendship")
        ]
