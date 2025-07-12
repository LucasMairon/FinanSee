from rest_framework.pagination import PageNumberPagination


class CategoryPagination(PageNumberPagination):
    page_size = 9
    page_size_query_param = 'page_size'
    max_page_size = 90
