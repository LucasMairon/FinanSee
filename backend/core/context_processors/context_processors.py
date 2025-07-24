from django.conf import settings


def backend_url_context(request):
    """
    Adding the public URL of the backend to the template context.
    """
    return {'BACKEND_URL': settings.BACKEND_URL}
