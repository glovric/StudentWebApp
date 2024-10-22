from django.contrib import admin
from .models import Course, Student, Teacher, Enrollment
from django import forms

class CourseForm(forms.ModelForm):
    class Meta:
        model = Course
        fields = '__all__'

class CourseAdmin(admin.ModelAdmin):
    form = CourseForm
    list_display = ('id', 'name', 'points', 'main_instructor_id')
    search_fields = ('name',)

class StudentAdmin(admin.ModelAdmin):
    list_display = ('academic_id', 'get_email', 'get_first_name', 'get_last_name')  # Fields to display in the list view
    search_fields = ('academic_id',)  # Add a search bar for the title field

    def get_email(self, obj):
        return obj.user.email

    def get_first_name(self, obj):
        return obj.user.first_name

    def get_last_name(self, obj):
        return obj.user.last_name
    
    get_first_name.short_description = 'First Name'
    get_last_name.short_description = 'Last Name'
    get_email.short_description = 'Email Address'

class TeacherAdmin(admin.ModelAdmin):
    list_display = ('academic_id', 'get_email', 'get_first_name', 'get_last_name', 'department')  # Fields to display in the list view
    search_fields = ('academic_id',)  # Add a search bar for the title field

    def get_first_name(self, obj):
        return obj.user.first_name

    def get_last_name(self, obj):
        return obj.user.last_name
    
    def get_email(self, obj):
        return obj.user.email
    
    def save_model(self, request, obj, form, change):

        # Save the Teacher
        super().save_model(request, obj, form, change)

        # If this is a new Teacher, delete the associated Student if it exists
        if not change:  # New instance creation
            try:
                # Attempt to retrieve the associated Student for the User
                student = Student.objects.get(user=obj.user)
                student.delete()  # Delete the Student instance
                print(f'Deleted associated Student: {student}')  # Optional: Logging
            except Student.DoesNotExist:
                print(f'No associated Student found for User: {obj.user.username}')  # Optional: Logging
    
    get_first_name.short_description = 'First Name'
    get_last_name.short_description = 'Last Name'
    get_email.short_description = 'Email Address'

class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student_id', 'student', 'course_id', 'course')  # Add the method here

    def student_id(self, obj):
        return obj.student.academic_id

    def course_id(self, obj):
        return obj.course.id  # Return the ID of the related course
    
    #course_id.short_description = 'Course ID'  # Set a human-readable name for the column

# Register your models here.
admin.site.register(Course, CourseAdmin)
admin.site.register(Student, StudentAdmin)
admin.site.register(Teacher, TeacherAdmin)
admin.site.register(Enrollment, EnrollmentAdmin)