from rest_framework import viewsets
from .models import Payment
from .serializers import PaymentSerializer
from notifications.models import Notification
class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class=PaymentSerializer; filterset_fields=['trip','payer','payee']; ordering_fields=['paid_at','amount']
    def get_queryset(self): return Payment.objects.filter(trip__members=self.request.user).distinct()
    def perform_create(self, serializer):
        p=serializer.save(); Notification.objects.create(user=p.payee,title='Settlement completed',message=f'{p.payer.display_name()} paid {p.amount}.',kind='settlement_completed')
