from rest_framework import generics
from .models import Course
from .serializers import CourseSerializer
from django.http import JsonResponse
from django.middleware.csrf import get_token

class CourseListCreateView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

def get_csrf_token(request):
    token = get_token(request)
    return JsonResponse({'csrfToken': token})