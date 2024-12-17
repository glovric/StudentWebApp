from django.middleware.csrf import get_token
from django.http import JsonResponse
from .models import Student, Teacher, Course
from django.contrib.auth.models import User
from django.db.models import Q
from .serializers import CourseSerializer

"""
Custom helper methods.
"""

def get_csrf_token(request):
    """
    Method for fetching CSRF token.
    """
    token = get_token(request)
    return JsonResponse({'csrfToken': token})

def get_user_type(user_id: int):
    """
    Method for determining user type based on ID.
    User types are student, teacher and admin.
    """

    try:
        # Check if the user_id belongs to a Student
        student = Student.objects.get(user_id=user_id)
        return 'student', student
    except Student.DoesNotExist:
        pass

    try:
        # Check if the user_id belongs to a Teacher
        teacher = Teacher.objects.get(user_id=user_id)
        return 'teacher', teacher
    except Teacher.DoesNotExist:
        pass

    try:
        user = User.objects.get(id=user_id)
        return 'admin', user
    except User.DoesNotExist:
        return 'unknown', None
    
def get_teacher_courses(teacher: Teacher):
    """
    Method for fetching courses where the teacher is a coordinator or an associate.
    """
    courses = Course.objects.filter(
        Q(coordinator=teacher) | Q(associates=teacher)
    ).distinct()  # Use distinct to avoid duplicates
    return courses

def get_available_student_courses(student: Student):
    """
    Method for fetching courses in which student has not enrolled.
    """
    # Get all courses the student is enrolled in
    enrolled_courses = student.courses.all()

    # Retrieve all courses and exclude those the student is already enrolled in
    courses_left = Course.objects.exclude(id__in=enrolled_courses.values_list('id', flat=True))

    return courses_left

def get_student_courses(student: Student):
    """
    Method for fetching courses in which student has enrolled.
    """
    # Prefetch courses and their enrollments
    student_with_courses = Student.objects.prefetch_related('courses', 'courses__enrollment_set').get(id=student.id)

    # Prepare the response data
    student_courses = []

    for course in student_with_courses.courses.all():
        # Get the enrollment for the specific student and course
        enrollment = course.enrollment_set.filter(student=student).first()
        enrollment_id = enrollment.id if enrollment else None
        
        # Serialize the course data
        course_data = CourseSerializer(course).data
        
        # Add enrollment_id to the course data
        course_data['enrollment_id'] = enrollment_id
        
        student_courses.append(course_data)
    
    return student_courses