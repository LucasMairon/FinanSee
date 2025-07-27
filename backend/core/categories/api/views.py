from categories.api.pagination import CategoryPagination
from categories.api.permissions import IsOwner
from categories.api.serializers import CategorySerializer
from categories.models import Category
from drf_spectacular.utils import (OpenApiParameter, extend_schema,
                                   extend_schema_view)
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet


@extend_schema_view(
    list=extend_schema(
        summary="List categories",
        description=("Returns the list of categories for the authenticated "
                     "user ordered by name"),
        parameters=[
            OpenApiParameter(
                name='search',
                type=str,
                location=OpenApiParameter.QUERY,
                description='Search categories by name'
            ),
            OpenApiParameter(
                name='page',
                type=int,
                location=OpenApiParameter.QUERY,
                description='Page number for pagination'
            )
        ],
        tags=['Categories']
    ),
    create=extend_schema(
        summary="Create category",
        description="Creates a new category for the authenticated user",
        tags=['Categories']
    ),
    retrieve=extend_schema(
        summary="Get category",
        description="Returns the details of a specific category",
        parameters=[
            OpenApiParameter(
                name='id',
                type=str,
                location=OpenApiParameter.PATH,
                description='Category UUID'
            )
        ],
        tags=['Categories']
    ),
    update=extend_schema(
        summary="Update category",
        description="Completely updates an existing category",
        parameters=[
            OpenApiParameter(
                name='id',
                type=str,
                location=OpenApiParameter.PATH,
                description='Category UUID'
            )
        ],
        tags=['Categories']
    ),
    partial_update=extend_schema(
        summary="Partially update category",
        description="Partially updates an existing category",
        parameters=[
            OpenApiParameter(
                name='id',
                type=str,
                location=OpenApiParameter.PATH,
                description='Category UUID'
            )
        ],
        tags=['Categories']
    ),
    destroy=extend_schema(
        summary="Delete category",
        description="Removes an existing category",
        parameters=[
            OpenApiParameter(
                name='id',
                type=str,
                location=OpenApiParameter.PATH,
                description='Category UUID'
            )
        ],
        tags=['Categories']
    )
)
class CategoryViewSet(ModelViewSet):
    """
    ViewSet for managing expense categories.

    Allows complete CRUD operations for categories associated with the
    authenticated user. Includes search by name and pagination features.
    """

    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated, IsOwner]
    filter_backends = [SearchFilter]
    search_fields = ['name', ]
    pagination_class = CategoryPagination

    def get_queryset(self):
        """
        Returns the queryset filtered by user and ordered by name.

        Returns:
            QuerySet: Categories of the authenticated user ordered by name
        """
        if getattr(self, 'swagger_fake_view', False):
            return Category.objects.none()
        return Category.objects.filter(user=self.request.user).order_by('name')

    def perform_create(self, serializer):
        """
        Executes the category creation associating it with the current user.

        Args:
            serializer: Serializer of the category to be created
        """
        serializer.context['user'] = self.request.user
        serializer.save()
