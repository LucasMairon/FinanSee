from categories.api.pagination import CategoryPagination
from categories.api.permissions import IsOwner
from categories.api.serializers import CategorySerializer
from categories.models import Category
from rest_framework.filters import SearchFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet


class CategoryViewSet(ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated, IsOwner]
    filter_backends = [SearchFilter]
    search_fields = ['name', ]
    pagination_class = CategoryPagination

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user).order_by('name')

    def perform_create(self, serializer):
        serializer.context['user'] = self.request.user
        serializer.save()
