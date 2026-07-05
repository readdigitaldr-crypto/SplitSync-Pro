from rest_framework import viewsets, decorators, response
from .models import Expense
from .serializers import ExpenseSerializer
from .services import simplify_balances
from payments.models import Payment
class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class=ExpenseSerializer; filterset_fields=['trip','category','paid_by','expense_date']; search_fields=['title','description','category']; ordering_fields=['expense_date','amount','created_at']
    def get_queryset(self): return Expense.objects.filter(trip__members=self.request.user).prefetch_related('splits').distinct()
    @decorators.action(detail=False, methods=['get'])
    def balances(self, request):
        trip=request.query_params.get('trip'); qs=self.get_queryset().filter(trip_id=trip); pays=Payment.objects.filter(trip_id=trip); return response.Response(simplify_balances(qs,pays))
