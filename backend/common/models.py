import uuid
from django.conf import settings
from django.db import models
class TimeStampedUUIDModel(models.Model):
    id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at=models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at=models.DateTimeField(auto_now=True)
    class Meta: abstract=True
class AuditLog(TimeStampedUUIDModel):
    user=models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    method=models.CharField(max_length=12); path=models.CharField(max_length=512); status_code=models.PositiveIntegerField(default=0); ip_address=models.GenericIPAddressField(null=True, blank=True)
    class Meta: indexes=[models.Index(fields=['user','created_at'])]
