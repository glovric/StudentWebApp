from django.shortcuts import render
from rest_framework import generics
from .models import Student, Course
from .serializers import StudentSerializer, CourseSerializer

class StudentListCreateView(generics.ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

class CourseListCreateView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer