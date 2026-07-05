from django.conf import settings
from django.db import models
from common.models import TimeStampedUUIDModel
class Notification(TimeStampedUUIDModel):
    class Kind(models.TextChoices): FRIEND_REQUEST='friend_request'; TRIP_INVITATION='trip_invitation'; EXPENSE_ADDED='expense_added'; SETTLEMENT_COMPLETED='settlement_completed'
    user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='notifications')
    title=models.CharField(max_length=160); message=models.TextField(); kind=models.CharField(max_length=40,choices=Kind.choices); read_at=models.DateTimeField(null=True,blank=True)
    class Meta: ordering=['-created_at']; indexes=[models.Index(fields=['user','read_at'])]
