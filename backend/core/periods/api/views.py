import uuid

from django.http import HttpResponse
from django.template.loader import render_to_string
from django_filters.rest_framework import DjangoFilterBackend
from periods.api.filters import PeriodFilter
from periods.api.serializers import PeriodPDFSerializer, PeriodSerializer
from periods.models import Period
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from weasyprint import HTML


class PeriodViewSet(ModelViewSet):
    serializer_class = PeriodSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get',]
    filter_backends = [DjangoFilterBackend]
    filterset_class = PeriodFilter

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
        serializer = self.get_serializer(period)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PeriodExportViewSet(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PeriodPDFSerializer

    def post(self, request):
        """
        Generate a PDF from the provided HTML content.
        """
        serializer = PeriodPDFSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        date = serializer.validated_data['date']

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
