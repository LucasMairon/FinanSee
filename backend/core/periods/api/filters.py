import django_filters
from periods.models import Period


class PeriodFilter(django_filters.FilterSet):
    year = django_filters.NumberFilter(
        field_name='month__year', lookup_expr='exact')

    class Meta:
        model = Period
        fields = ('year',)
