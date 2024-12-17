from rest_framework import serializers
from .models import Course, Teacher

"""
Serializers for converting Django models to Python objects
"""

class CourseSerializer(serializers.ModelSerializer):
    
    coordinator = serializers.SerializerMethodField()
    associates = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'name', 'points', 'image_url', 'coordinator', 'associates']  # Adjust fields as needed

    def get_coordinator(self, obj):
        if obj.coordinator and obj.coordinator.user:
            return f"{obj.coordinator.academic_title} {obj.coordinator.user.first_name} {obj.coordinator.user.last_name}"
        return None
    
    def get_associates(self, obj):
        lista = [
            f"{associate.academic_title} {associate.user.first_name} {associate.user.last_name}"
            for associate in obj.associates.all() if associate.user
        ]
        return ", ".join(lista)
    
class TeacherSerializer(serializers.ModelSerializer):

    name = serializers.SerializerMethodField()

    class Meta:
        model = Teacher
        fields = ['id', 'academic_id', 'academic_title', 'name']
        
    def get_name(self, obj):
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}"
        return None