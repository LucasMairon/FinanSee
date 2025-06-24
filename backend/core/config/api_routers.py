from django.urls import include, path

from rest_framework import routers

from categories.api.views import CategoryViewSet
from periods.api.views import PeriodViewSet

from users.api.views import LogoutView


router = routers.SimpleRouter()
router.register('categories', CategoryViewSet, 'category')
router.register('periods', PeriodViewSet, 'period')

urlpatterns = [
    path('auth/', include('djoser.urls.jwt')),
    path('auth/', include('djoser.urls')),
    path('auth/logout/', LogoutView.as_view(), name='logout')
]

urlpatterns += router.urls
