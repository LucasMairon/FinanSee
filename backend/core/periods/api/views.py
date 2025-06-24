from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from periods.models import Period
from periods.api.serializers import PeriodSerializer


class PeriodViewSet(ModelViewSet):
    serializer_class = PeriodSerializer
    queryset = Period.objects.all()
    permission_classes = [IsAuthenticated]
    http_method_names = ['get',]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

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
