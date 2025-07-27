from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from users.api.serializers import LogoutSerializer


@extend_schema(
    summary="User logout",
    description=("Logs out the authenticated user by blacklisting the refresh "
                 "token"),
    tags=['auth']
)
class LogoutView(APIView):
    """
    API view for user logout functionality.

    Blacklists the provided refresh token to complete the logout process.
    """

    permission_classes = [IsAuthenticated]
    serializer_class = LogoutSerializer

    @extend_schema(
        summary="Logout user",
        description="Invalidates the refresh token and logs out the user",
        tags=['auth']
    )
    def post(self, request):
        """
        Logs out the user by blacklisting the refresh token.

        Args:
            request: HTTP request object with refresh token

        Returns:
            Response: Success status or error message
        """
        try:
            serializer = self.serializer_class(data=request.data)
            serializer.is_valid(raise_exception=True)
            token = RefreshToken(serializer.validated_data.get('refresh'))
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except TokenError:
            return Response({'error': 'Token invalid or expired.'},
                            status=status.HTTP_400_BAD_REQUEST)
