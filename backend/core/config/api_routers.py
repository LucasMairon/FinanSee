from categories.api.views import CategoryViewSet
from django.urls import include, path
from expenses.api.views import ExpenseViewSet
from periods.api.views import PeriodViewSet
from rest_framework import routers
from users.api.views import LogoutView

router = routers.SimpleRouter()
router.register('categories', CategoryViewSet, 'category')
router.register('periods', PeriodViewSet, 'period')
router.register('expenses', ExpenseViewSet, 'expense')


urlpatterns = [
    path('auth/', include('djoser.urls.jwt')),
    path('auth/', include('djoser.urls')),
    path('auth/logout/', LogoutView.as_view(), name='logout')
]

urlpatterns += router.urls
