# serializers.py

from rest_framework import serializers
from .models import Student, Course

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'name', 'surname', 'dob', 'mail', 'password']

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'name', 'points']
