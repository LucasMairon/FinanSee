from django_filters.rest_framework import DjangoFilterBackend
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


class ExpenseViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated, IsOwner]
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['categories', 'date', 'status']
    search_fields = ['name', ]
    pagination_class = ExpensePagination

    def get_serializer_class(self):
        if self.action in ['create', ]:
            return ExpenseCreateSerializer
        if self.action in ['update', 'partial_update', ]:
            return ExpenseUpdateSerializer
        if self.action in ['add_category', 'remove_category', ]:
            return ExpenseCategorySerializer
        return ExpenseSerializer

    def get_queryset(self):
        return Expense.objects.filter(user=self.request.user).order_by('-date')

    def perform_create(self, serializer):
        serializer.context['user'] = self.request.user
        serializer.save()

    @action(detail=True, methods=['post'])
    def add_category(self, request, pk=None):
        expense = self.get_object()
        serializer = ExpenseCategorySerializer(
            instance=expense, data=request.data,
            context={'add_category': True})
        serializer.is_valid(raise_exception=True)
        expense = serializer.save()
        serializer = ExpenseSerializer(instance=expense)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def remove_category(self, request, pk=None):
        expense = self.get_object()
        serializer = ExpenseCategorySerializer(
            instance=expense, data=request.data,
            context={'remove_category': True})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
