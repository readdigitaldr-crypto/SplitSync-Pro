from decimal import Decimal
from django.conf import settings
from django.db import models
from common.models import TimeStampedUUIDModel


class Expense(TimeStampedUUIDModel):
    class SplitMethod(models.TextChoices):
        EQUAL = "equal"
        EXACT = "exact"
        PERCENTAGE = "percentage"
        SHARES = "shares"
        CUSTOM = "custom"

    title = models.CharField(max_length=180)
    description = models.TextField(blank=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    category = models.CharField(max_length=80)
    paid_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="paid_expenses"
    )
    trip = models.ForeignKey(
        "trips.Trip", on_delete=models.CASCADE, related_name="expenses"
    )
    expense_date = models.DateField()
    split_method = models.CharField(max_length=16, choices=SplitMethod.choices)
    receipt_image_url = models.URLField(blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["trip", "category"]),
            models.Index(fields=["paid_by", "expense_date"]),
        ]


class ExpenseSplit(TimeStampedUUIDModel):
    expense = models.ForeignKey(
        Expense, on_delete=models.CASCADE, related_name="splits"
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    percentage = models.DecimalField(
        max_digits=5, decimal_places=2, null=True, blank=True
    )
    shares = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["expense", "user"], name="unique_expense_split"
            )
        ]
