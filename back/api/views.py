from rest_framework import generics
from .models import Course, Student, Teacher, Enrollment
from .serializers import CourseSerializer
from django.http import JsonResponse
from django.middleware.csrf import get_token
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
import json
from random import choices
from django.shortcuts import get_object_or_404
from django.db.models import Q

def get_user_type(user_id):

    try:
        # Check if the user_id belongs to a Student
        student = Student.objects.get(user_id=user_id)
        return 'student', student
    except Student.DoesNotExist:
        pass  # Continue to check for Teacher

    try:
        # Check if the user_id belongs to a Teacher
        teacher = Teacher.objects.get(user_id=user_id)
        return 'teacher', teacher
    except Teacher.DoesNotExist:
        pass  # If not found in either model

    # If neither is found
    return 'unknown', None

class CourseView(APIView):

    def get(self, request):

        if request.user:
            # Get user ID
            user_id = request.user.id
            # Check if user is teacher or student
            user_type, user = get_user_type(user_id)

            print(f'We got a user: {user}')

            if user_type == 'student':
                # Retrieve all courses
                courses = Course.objects.all()
                
                # Get enrollments for the current user
                user_enrollments = Enrollment.objects.filter(student__user__id=user_id)
                enrolled_course_ids = user_enrollments.values_list('course_id', flat=True)

                courses_left = []
                for course in courses:
                    # Skip courses the user is already enrolled in
                    if course.id not in enrolled_course_ids:
                        courses_left.append(course)

                serializer = CourseSerializer(courses_left, many=True)

                return JsonResponse(serializer.data, safe=False, status=200)
            
            elif user_type == 'teacher':

                teacher: Teacher = user

                courses = Course.objects.filter(
                            Q(main_instructor_id=teacher.id) | Q(additional_instructors__id=teacher.id)
                          )
                
                courses_with_students = []

                for course in courses:
                    # Retrieve students enrolled in the specific course
                    enrolled_students = Enrollment.objects.filter(course=course).select_related('student')
                    
                    # Create a list of student data (you can customize this to include necessary fields)
                    student_data = [{
                        'id': enrollment.student.id,
                        'name': str(enrollment.student),  # or any other representation
                        'academic_id': enrollment.student.academic_id,
                    } for enrollment in enrolled_students]

                    # Append course info with students
                    courses_with_students.append({
                        'course_id': course.id,
                        'course_name': course.name,
                        'enrolled_students': student_data,
                    })

                # Return the courses with enrolled students as JSON response
                return JsonResponse(courses_with_students, safe=False, status=200)
        
        else:
            courses = Course.objects.all()
            serializer = CourseSerializer(courses)
            return JsonResponse(serializer.data, safe=False, status=200)

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return JsonResponse({"message": "This is a protected view only for authenticated users."})

def get_csrf_token(request):
    token = get_token(request)
    return JsonResponse({'csrfToken': token})

def register(request):
    if request.method == 'POST':

        data = json.loads(request.body)

        first_name = data.get('first_name').lower().capitalize()
        last_name = data.get('last_name').lower().capitalize()
        username = first_name[0].lower() + last_name.lower()
        email = first_name[0].lower() + last_name.lower() + "@fakz.org"
        password = data.get('password')
        academic_id = '420' + ''.join(choices('123456789', k=5))
    
        # Validate the input
        if User.objects.filter(username=username).exists():
            return JsonResponse({'success': False, 'message': "Username is already taken."}, status=400)

        if User.objects.filter(email=email).exists():
            return JsonResponse({'success': False, 'message': "Email is already in use."}, status=400)

        # Create and save the user
        user = User.objects.create_user(
            username=username,
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=password,
        )

        Student.objects.create(user=user, academic_id=academic_id)

        return JsonResponse({'success': True, 
                             'message': "Your account has been created! You can now log in.", 
                             'email': email, 
                             'username': username})

    return JsonResponse({'success': False, 'message': "Invalid request method."}, status=405)

class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        # Get user ID from request (JWT payload)
        user_id = request.user.id

        # Check if teacher with such user ID exists
        teacher_exists = Teacher.objects.filter(user_id=user_id).exists()

        if not request.user.is_authenticated or not teacher_exists:
            return JsonResponse({'error': 'You do not have permission to access this dashboard.'}, status=403)
        
        students = Student.objects.all()
        
        student_data = [
            {
                'username': student.user.username,
                'email': student.user.email,
                'academic_id': student.academic_id,
                'user_id': student.user_id
            }
            for student in students
        ]
        
        return JsonResponse(student_data, safe=False)
    
class UserDataView(APIView):
    
    permission_classes = [IsAuthenticated]

    def get(self, request):

        # Get user ID from request (JWT payload)
        user_id = request.user.id

        # Fetch the user instance
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return JsonResponse({'message': 'User does not exist.'}, status=404)
        
        if Student.objects.filter(user_id=user_id).exists():
            user_type = 'student'
        elif Teacher.objects.filter(user_id=user_id).exists():
            user_type = 'teacher'
        else:
            user_type = 'admin'

        # Prepare user data to return
        user_data = {
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'user_type': user_type
        }

        return JsonResponse(user_data, status=200)
    
class EnrollView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = json.loads(request.body)
        user = request.user
        course_id = data.get('course_id')

        print(f'Data u enrollu:', data)
        print(f'User {user.id} wants to enroll at {course_id}')

        #return JsonResponse({'success': True, 'message': "Proslo."}, status=200)
    
        # Get the current student's record
        student = get_object_or_404(Student, user=user)

        # Get the course object
        course = get_object_or_404(Course, id=course_id)

        # Create the enrollment
        enrollment, created = Enrollment.objects.get_or_create(student=student, course=course)

        if created:
            # Enrollment was created successfully
            return JsonResponse({'success': True, 'message': "Successfully enrolled"}, status=200)
        else:
            # Enrollment already exists
            return JsonResponse({'success': False, 'message': "Enrollment exists"}, status=401)