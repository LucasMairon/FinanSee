from rest_framework.viewsets import ModelViewSet

from rest_framework.permissions import IsAuthenticated

from categories.models import Category

from categories.api.permissions import IsOwner

from categories.api.serializers import CategorySerializer


class CategoryViewSet(ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.context['user'] = self.request.user
        serializer.save()
