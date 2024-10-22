from rest_framework import serializers
from .models import Course

class CourseSerializer(serializers.ModelSerializer):
    
    main_instructor = serializers.SerializerMethodField()
    additional_instructors = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'name', 'points', 'image_url', 'main_instructor', 'additional_instructors']  # Adjust fields as needed

    def get_main_instructor(self, obj):
        if obj.main_instructor and obj.main_instructor.user:
            return f"{obj.main_instructor.academic_title} {obj.main_instructor.user.first_name} {obj.main_instructor.user.last_name}"
        return None
    
    def get_additional_instructors(self, obj):
        lista = [
            f"{instructor.academic_title} {instructor.user.first_name} {instructor.user.last_name}"
            for instructor in obj.additional_instructors.all() if instructor.user
        ]
        return ", ".join(lista)
        