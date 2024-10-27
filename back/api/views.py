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

def get_user_type(user_id: int):

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

    try:
        user = User.objects.get(id=user_id)
        return 'admin', user
    except User.DoesNotExist:
        return 'unknown', None

def get_courses_for_teacher(teacher: Teacher):
    # Fetch courses where the teacher is a coordinator or an associate
    courses = Course.objects.filter(
        Q(coordinator=teacher) | Q(associates=teacher)
    ).distinct()  # Use distinct to avoid duplicates
    return courses

def get_courses_for_student(student: Student):
    # Get all courses the student is enrolled in
    enrolled_courses = student.courses.all()

    # Retrieve all courses and exclude those the student is already enrolled in
    courses_left = Course.objects.exclude(id__in=enrolled_courses.values_list('id', flat=True))

    return courses_left

class CourseView(APIView):

    def get(self, request):
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
        
        user_type, _ = get_user_type(user_id)

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
        try:
            student_id = data.get('student_id')
        except:
            print("No student id!")

        print(f'Data u enrollu:', data)
        print(f'User {user.id} wants to enroll at {course_id}')

        #return JsonResponse({'success': True, 'message': "Proslo."}, status=200)
    
        # Get the current student's record
        if student_id:
            student = get_object_or_404(Student, id=student_id)
        else:
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
        
    def delete(self, request, enrollment_id):
        try:
            enrollment = Enrollment.objects.get(id=enrollment_id)
            enrollment.delete()
            return JsonResponse({}, status=204)  # Empty response body  # No content returned on successful deletion
        except Enrollment.DoesNotExist:
            return JsonResponse({"detail": "Enrollment not found."}, status=404)
        
class TeacherDashboardView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        user_id = request.user.id
        # Check if user is teacher or student
        user_type, user = get_user_type(user_id)

        print(f'We got a user: {user}')
        
        if user_type == 'teacher':

            teacher: Teacher = user

            # Fetch courses for the teacher
            courses = get_courses_for_teacher(teacher)
            # Prefetch related students
            courses_with_students = courses.prefetch_related('students')

            all_students = Student.objects.all()
            # Build the response data
            courses_with_students_json = [{
                'id': course.id,
                'name': course.name,

                'enrolled_students': [{
                    'id': student.id,
                    'name': str(student),  # or any other representation
                    'academic_id': student.academic_id,
                    'enrollment_id': enrollment.id,  # Assuming you can get this from a related enrollment
                } for student in course.students.all()
                for enrollment in Enrollment.objects.filter(student=student, course=course)],  # Get enrollment for each student

                'not_enrolled_students': [
                    {
                        'id': student.id,
                        'name': str(student),  # or any other representation
                        'academic_id': student.academic_id,
                    } for student in all_students
                    if student.id not in course.students.values_list('id', flat=True)
                ],
            } for course in courses_with_students]

            return JsonResponse(courses_with_students_json, safe=False, status=200)
        
        else:
            return JsonResponse({'message': 'Failed in TeacherDashboardView.'}, status=400)
        
class StudentDashboardView(APIView):
    
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.path.endswith('/available-courses/'):
            return self.get_available_courses(request)
        elif request.path.endswith('/my-courses/'):
            return self.get_student_courses(request)
        else:
            return JsonResponse({'error': 'Invalid endpoint.'}, status=404)
        
    def get_available_courses(self, request):

        if request.method == "GET":

            # Get user ID
            user_id = request.user.id
            # Check if user is teacher or student
            user_type, user = get_user_type(user_id)

            print(f'We got a user: {user}')

            if user_type == 'student':

                student: Student = user

                courses = get_courses_for_student(student)

                serializer = CourseSerializer(courses, many=True)

                return JsonResponse(serializer.data, safe=False, status=200)
            
            else:
                return JsonResponse({'message': 'Failed in StudentDashboardView.'}, status=400)
            
    def get_student_courses(self, request):

         # Get user ID
            user_id = request.user.id
            # Check if user is teacher or student
            user_type, user = get_user_type(user_id)

            print(f'We got a user: {user}')

            if user_type == 'student':

                student: Student = user
                
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

                return JsonResponse(student_courses, safe=False, status=200)
            
            else:
                return JsonResponse({'message': 'Failed in StudentDashboardView.'}, status=400)

                