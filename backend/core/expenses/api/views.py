from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import (OpenApiParameter, extend_schema,
                                   extend_schema_view)
from expenses.api.pagination import ExpensePagination
from expenses.api.permissions import IsOwner
from expenses.api.serializers import (ExpenseCreateUpdateSerializer,
                                      ExpenseSerializer)
from expenses.models import Expense
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet


@extend_schema_view(
    list=extend_schema(
        summary="List expenses",
        description=("Returns the list of expenses for the authenticated user "
                     "ordered by date"),
        parameters=[
            OpenApiParameter(
                name='search',
                type=str,
                location=OpenApiParameter.QUERY,
                description='Search expenses by name'
            ),
            OpenApiParameter(
                name='categories',
                type=str,
                location=OpenApiParameter.QUERY,
                description='Filter by category IDs (comma-separated)'
            ),
            OpenApiParameter(
                name='date',
                type=str,
                location=OpenApiParameter.QUERY,
                description='Filter by date (YYYY-MM-DD)'
            ),
            OpenApiParameter(
                name='status',
                type=str,
                location=OpenApiParameter.QUERY,
                description='Filter by status (AP, P)'
            ),
            OpenApiParameter(
                name='page',
                type=int,
                location=OpenApiParameter.QUERY,
                description='Page number for pagination'
            )
        ],
        tags=['Expenses']
    ),
    create=extend_schema(
        summary="Create expense",
        description="Creates a new expense for the authenticated user",
        tags=['Expenses']
    ),
    retrieve=extend_schema(
        summary="Get expense",
        description="Returns the details of a specific expense",
        parameters=[
            OpenApiParameter(
                name='id',
                type=str,
                location=OpenApiParameter.PATH,
                description='Expense UUID'
            )
        ],
        tags=['Expenses']
    ),
    update=extend_schema(
        summary="Update expense",
        description="Completely updates an existing expense",
        parameters=[
            OpenApiParameter(
                name='id',
                type=str,
                location=OpenApiParameter.PATH,
                description='Expense UUID'
            )
        ],
        tags=['Expenses']
    ),
    partial_update=extend_schema(
        summary="Partially update expense",
        description="Partially updates an existing expense",
        parameters=[
            OpenApiParameter(
                name='id',
                type=str,
                location=OpenApiParameter.PATH,
                description='Expense UUID'
            )
        ],
        tags=['Expenses']
    ),
    destroy=extend_schema(
        summary="Delete expense",
        description="Removes an existing expense",
        parameters=[
            OpenApiParameter(
                name='id',
                type=str,
                location=OpenApiParameter.PATH,
                description='Expense UUID'
            )
        ],
        tags=['Expenses']
    )
)
class ExpenseViewSet(ModelViewSet):
    """
    ViewSet for managing expenses.

    Allows complete CRUD operations for expenses associated with the 
    authenticated user. Includes filtering, search, and pagination features.
    Supports custom actions for category management.
    """

    permission_classes = [IsAuthenticated, IsOwner]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['categories', 'date', 'status']
    search_fields = ['name', ]
    pagination_class = ExpensePagination

    def get_serializer_class(self):
        """
        Returns the appropriate serializer class based on the action.

        Returns:
            Serializer: Appropriate serializer for the current action
        """
        if self.action in ['create', 'update', 'partial_update', ]:
            return ExpenseCreateUpdateSerializer
        return ExpenseSerializer

    def get_queryset(self):
        """
        Returns the queryset filtered by user and ordered by date.

        Returns:
            QuerySet: Expenses of the authenticated user ordered by date
        """
        if getattr(self, 'swagger_fake_view', False):
            return Expense.objects.none()
        return Expense.objects.filter(user=self.request.user).order_by('-date')

    def perform_create(self, serializer):
        """
        Executes the expense creation associating it with the current user.

        Args:
            serializer: Serializer of the expense to be created
        """
        serializer.context['user'] = self.request.user
        serializer.save()
