from django.conf import settings
from django.db import models
from common.models import TimeStampedUUIDModel
class Trip(TimeStampedUUIDModel):
    class Status(models.TextChoices): ACTIVE='active'; ARCHIVED='archived'
    name=models.CharField(max_length=160); destination=models.CharField(max_length=160); description=models.TextField(blank=True); currency=models.CharField(max_length=8,default='INR')
    start_date=models.DateField(); end_date=models.DateField(); trip_image_url=models.URLField(blank=True); owner=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='owned_trips'); members=models.ManyToManyField(settings.AUTH_USER_MODEL,through='TripMember',related_name='trips'); status=models.CharField(max_length=16,choices=Status.choices,default=Status.ACTIVE)
    class Meta: indexes=[models.Index(fields=['owner','status']),models.Index(fields=['start_date','end_date'])]
class TripMember(TimeStampedUUIDModel):
    trip=models.ForeignKey(Trip,on_delete=models.CASCADE); user=models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE); is_active=models.BooleanField(default=True)
    class Meta: constraints=[models.UniqueConstraint(fields=['trip','user'],name='unique_trip_member')]
