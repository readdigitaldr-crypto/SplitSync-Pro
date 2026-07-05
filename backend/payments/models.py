from django.conf import settings
from django.db import models
from common.models import TimeStampedUUIDModel


class Payment(TimeStampedUUIDModel):
    trip = models.ForeignKey(
        "trips.Trip", on_delete=models.CASCADE, related_name="payments"
    )
    payer = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="payments_made"
    )
    payee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name="payments_received",
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    notes = models.TextField(blank=True)
    paid_at = models.DateTimeField(auto_now_add=True)
    is_full_settlement = models.BooleanField(default=False)

    class Meta:
        indexes = [models.Index(fields=["trip", "paid_at"])]
