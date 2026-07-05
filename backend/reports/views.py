import csv
from django.db.models import Sum
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from expenses.models import Expense
class ReportView(APIView):
    def get(self, request):
        qs=Expense.objects.filter(trip__members=request.user)
        trip=request.query_params.get('trip')
        if trip: qs=qs.filter(trip_id=trip)
        data={'by_category':list(qs.values('category').annotate(total=Sum('amount')).order_by('category')),'by_month':list(qs.extra(select={'month':"date_trunc('month', expense_date)"}).values('month').annotate(total=Sum('amount')).order_by('month')),'by_member':list(qs.values('paid_by__username').annotate(total=Sum('amount')))}
        return Response(data)
class CSVExportView(APIView):
    def get(self, request):
        resp=HttpResponse(content_type='text/csv'); resp['Content-Disposition']='attachment; filename="expenses.csv"'; w=csv.writer(resp); w.writerow(['Trip','Title','Category','Amount','Paid By','Date'])
        for e in Expense.objects.filter(trip__members=request.user): w.writerow([e.trip.name,e.title,e.category,e.amount,e.paid_by.username,e.expense_date])
        return resp
