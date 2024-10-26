from rest_framework import serializers
from .models import Course

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
        