import uuid

from django.http import HttpResponse
from django.template.loader import render_to_string
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import (OpenApiParameter, extend_schema,
                                   extend_schema_view)
from periods.api.filters import PeriodFilter
from periods.api.serializers import (PeriodDateSerializer,
                                     PeriodExpenseSerializer,
                                     PeriodFinancialEvolutionSerializer,
                                     PeriodSerializer)
from periods.models import Period
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from weasyprint import HTML


@extend_schema_view(
    list=extend_schema(
        summary="List periods",
        description="Returns the list of periods for the authenticated user",
        parameters=[
            OpenApiParameter(
                name='month',
                type=str,
                location=OpenApiParameter.QUERY,
                description='Filter by month (YYYY-MM format)'
            ),
            OpenApiParameter(
                name='year',
                type=int,
                location=OpenApiParameter.QUERY,
                description='Filter by year'
            )
        ],
        tags=['Periods']
    ),
    retrieve=extend_schema(
        summary="Get period",
        description="Returns the details of a specific period",
        parameters=[
            OpenApiParameter(
                name='id',
                type=str,
                location=OpenApiParameter.PATH,
                description='Period UUID'
            )
        ],
        tags=['Periods']
    )
)
class PeriodViewSet(ModelViewSet):
    """
    ViewSet for managing periods.

    Provides read-only access to period data with filtering capabilities.
    Includes custom actions for current period, daily evolution, and 
    financial evolution analysis.
    """

    permission_classes = [IsAuthenticated]
    http_method_names = ['get',]
    filter_backends = [DjangoFilterBackend]
    filterset_class = PeriodFilter

    def get_serializer_class(self):
        """
        Returns the appropriate serializer class based on the action.

        Returns:
            Serializer: Appropriate serializer for the current action
        """
        if self.action == 'daily_evolution':
            return PeriodExpenseSerializer
        if self.action == 'financial_evolution':
            return PeriodFinancialEvolutionSerializer
        return PeriodSerializer

    def get_queryset(self):
        """
        Returns the queryset filtered by user.

        Returns:
            QuerySet: Periods of the authenticated user
        """
        if getattr(self, 'swagger_fake_view', False):
            return Period.objects.none()
        return Period.objects.filter(user=self.request.user)

    @extend_schema(
        summary="Get current period",
        description="Retrieve the current period for the authenticated user. "
        "If no period exists for the current month, it will create one.",
        tags=['Periods']
    )
    @action(detail=False, methods=['get'])
    def current_period(self, request):
        """
        Retrieve the current period for the authenticated user.
        If no period exists for the current month, it will create one.

        Args:
            request: HTTP request object

        Returns:
            Response: Current period data
        """
        period, _ = Period.objects.get_or_create(
            user=request.user,
        )
        serializer = self.get_serializer(instance=period)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        summary="Get daily evolution",
        description="Retrieve the daily evolution of expenses for the "
        "authenticated user",
        tags=['Periods']
    )
    @action(detail=False, methods=['get'])
    def daily_evolution(self, request):
        """
        Retrieve the daily_evolution of the expenses for the authenticated
        user.

        Args:
            request: HTTP request object

        Returns:
            Response: Daily evolution data
        """
        period, _ = Period.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(instance=period)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        summary="Get financial evolution",
        description="Retrieve the financial evolution of expenses for the "
        "authenticated user",
        tags=['Periods']
    )
    @action(detail=False, methods=['get'])
    def financial_evolution(self, request):
        """
        Retrieve the financial evolution of the expenses for the authenticated
        user.

        Args:
            request: HTTP request object

        Returns:
            Response: Financial evolution data
        """
        period, _ = Period.objects.get_or_create(user=request.user)
        serializer = PeriodFinancialEvolutionSerializer(instance=period)
        return Response(serializer.data, status=status.HTTP_200_OK)


@extend_schema_view(
    post=extend_schema(
        summary="Export period to PDF",
        description="Generate a PDF report for a specific period",
        tags=['Periods']
    )
)
class PeriodExportViewSet(APIView):
    """
    API view for exporting period data to PDF format.

    Generates detailed PDF reports with period information and expenses.
    """

    permission_classes = [IsAuthenticated]
    serializer_class = PeriodDateSerializer

    @extend_schema(
        summary="Export period to PDF",
        description="Generate a PDF report for the specified period date",
        tags=['Periods']
    )
    def post(self, request):
        """
        Generate a PDF from the provided HTML content.

        Args:
            request: HTTP request object with period_date

        Returns:
            Response: PDF file or error message
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
        response['Content-Disposition'] = (
            f'attachment; filename="{filename}.pdf"'
        )
        return response
