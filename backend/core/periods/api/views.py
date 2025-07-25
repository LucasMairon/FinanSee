import uuid

from django.http import HttpResponse
from django.template.loader import render_to_string
from django_filters.rest_framework import DjangoFilterBackend
from periods.api.filters import PeriodFilter
from periods.api.serializers import (PeriodDateSerializer,
                                     PeriodExpenseSerializer, PeriodSerializer)
from periods.models import Period
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from weasyprint import HTML


class PeriodViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    http_method_names = ['get',]
    filter_backends = [DjangoFilterBackend]
    filterset_class = PeriodFilter

    def get_serializer_class(self):
        if self.action == 'evolution':
            return PeriodExpenseSerializer
        return PeriodSerializer

    def get_queryset(self):
        return Period.objects.filter(user=self.request.user)

    @action(detail=False, methods=['get'], url_path='current')
    def current_period(self, request):
        """
        Retrieve the current period for the authenticated user.
        If no period exists for the current month, it will create one.
        """
        period, _ = Period.objects.get_or_create(
            user=request.user,
        )
        serializer = self.get_serializer(instance=period)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='evolution')
    def evolution(self, request):
        """
        Retrieve the evolution of the expenses for the authenticated user.
        """
        if request.query_params.get('year') is None:
            return Response(
                {'year':
                    ['Year is required.']},
                status=status.HTTP_400_BAD_REQUEST)
        period = self.filter_queryset(self.get_queryset())
        if not period.exists():
            return Response(
                {'year':
                    ['There are no period for the specified year.']},
                status=status.HTTP_404_NOT_FOUND)
        period = period.first()
        serializer = self.get_serializer(instance=period)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PeriodExportViewSet(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PeriodDateSerializer

    def post(self, request):
        """
        Generate a PDF from the provided HTML content.
        """
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        date = serializer.validated_data['period_date']

        period = Period.objects.filter(user=request.user,
                                       month__month=date.month,
                                       month__year=date.year).first()
        if period is None:
            return Response(
                {'expenses':
                    ['There are no expenses for the specified date.']},
                status=status.HTTP_404_NOT_FOUND)
        serializer = PeriodSerializer(period)
        context = {
            'period': period,
            'period_serializer_data': serializer.data
        }
        html_string = render_to_string('periods/period_report.html', context)
        filename = f"period_report_{uuid.uuid4().hex}"
        base_url = request.build_absolute_uri('/')
        html = HTML(string=html_string, base_url=base_url)
        pdf_file = html.write_pdf()
        if pdf_file is None:
            return Response({'error': 'Failed to generate PDF'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        response = HttpResponse(pdf_file, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{filename}.pdf"'
        return response
