from django.contrib import admin
from .models import Course

class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'points')  # Fields to display in the list view
    search_fields = ('name',)  # Add a search bar for the title field

# Register your models here.
admin.site.register(Course, CourseAdmin)