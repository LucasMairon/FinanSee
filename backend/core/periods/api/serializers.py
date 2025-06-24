from rest_framework import serializers
from periods.models import Period


class PeriodSerializer(serializers.ModelSerializer):

    class Meta:
        model = Period
        fields = [
            'id',
        ]
