from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import (OpenApiParameter, extend_schema,
                                   extend_schema_view)
from expenses.api.pagination import ExpensePagination
from expenses.api.permissions import IsOwner
from expenses.api.serializers import (ExpenseCategorySerializer,
                                      ExpenseCreateSerializer,
                                      ExpenseSerializer,
                                      ExpenseUpdateSerializer)
from expenses.models import Expense
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
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
        if self.action in ['create', ]:
            return ExpenseCreateSerializer
        if self.action in ['update', 'partial_update', ]:
            return ExpenseUpdateSerializer
        if self.action in ['add_category', 'remove_category', ]:
            return ExpenseCategorySerializer
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

    @extend_schema(
        summary="Add categories to expense",
        description="Adds categories to an existing expense",
        tags=['Expenses']
    )
    @action(detail=True, methods=['post'])
    def add_category(self, request, pk=None):
        """
        Adds categories to an existing expense.

        Args:
            request: HTTP request object
            pk: Primary key of the expense

        Returns:
            Response: Updated expense data
        """
        expense = self.get_object()
        serializer = ExpenseCategorySerializer(
            instance=expense, data=request.data,
            context={'add_category': True})
        serializer.is_valid(raise_exception=True)
        expense = serializer.save()
        serializer = ExpenseSerializer(instance=expense)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @extend_schema(
        summary="Remove categories from expense",
        description="Removes categories from an existing expense",
        tags=['Expenses']
    )
    @action(detail=True, methods=['post'])
    def remove_category(self, request, pk=None):
        """
        Removes categories from an existing expense.

        Args:
            request: HTTP request object
            pk: Primary key of the expense

        Returns:
            Response: No content response
        """
        expense = self.get_object()
        serializer = ExpenseCategorySerializer(
            instance=expense, data=request.data,
            context={'remove_category': True})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
