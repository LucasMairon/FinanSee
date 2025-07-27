from drf_spectacular.utils import OpenApiExample, extend_schema_serializer
from rest_framework import serializers


@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Logout Request',
            value={
                'refresh': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...'
            },
            description='Example of logout request with refresh token'
        )
    ]
)
class LogoutSerializer(serializers.Serializer):
    """
    Serializer for user logout functionality.

    Requires a valid refresh token to blacklist it and complete the logout.
    """

    refresh = serializers.CharField(
        help_text='Refresh token to be blacklisted for logout'
    )
