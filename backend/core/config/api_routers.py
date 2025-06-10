from django.urls import include, path

from users.api.views import LogoutView

urlpatterns = [
    path('auth/', include('djoser.urls.jwt')),
    path('auth/', include('djoser.urls')),
    path('auth/logout/', LogoutView.as_view(), name='logout')
]
