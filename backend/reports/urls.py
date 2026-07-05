from django.urls import path
from .views import ReportView, CSVExportView
urlpatterns=[path('',ReportView.as_view()),path('export/csv/',CSVExportView.as_view())]
