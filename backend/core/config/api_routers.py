from django.urls import include, path

from rest_framework import routers
from users.api.views import LogoutView

from categories.api.views import CategoryViewSet

router = routers.SimpleRouter()
router.register('categories', CategoryViewSet, 'category')

urlpatterns = [
    path('auth/', include('djoser.urls.jwt')),
    path('auth/', include('djoser.urls')),
    path('auth/logout/', LogoutView.as_view(), name='logout')
]

urlpatterns += router.urls
