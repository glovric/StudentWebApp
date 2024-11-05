from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
import json
from random import choices
from .models import Course, Student, Teacher, Enrollment
from .serializers import CourseSerializer, TeacherSerializer
from .helpers import get_user_type, get_available_student_courses, get_student_courses, get_teacher_courses
from rest_framework import generics

class CourseView(generics.ListAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class TeacherView(generics.ListAPIView):

    permission_classes = [IsAuthenticated]
    
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer

class RegisterView(APIView):

    def post(self, request):
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
   
class UserDataView(APIView):

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
            courses = get_teacher_courses(teacher)
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
        
    def post(self, request):
        user_id = request.user.id
        data = json.loads(request.body)
        course_name = data['courseName']
        course_points = int(data['coursePoints'])
        image_url = data['courseImage']
        associate_idx = data['selectedAssociates']

        coordinator = Teacher.objects.get(user_id=user_id)
        associates = Teacher.objects.filter(id__in=associate_idx)

        new_course = Course.objects.create(
            name=course_name,
            points=course_points,
            image_url=image_url,
            coordinator=coordinator
        )

        new_course.associates.add(*associates)
        return JsonResponse({'message': 'success'}, status=200)
    
    def delete(self, request, course_id):
        try:
            course = Course.objects.get(id=course_id)
            course.delete()
            print(f'izbrisao sam course {course_id}')
            return JsonResponse({}, status=204)  # Empty response body  # No content returned on successful deletion
        except Course.DoesNotExist:
            return JsonResponse({"detail": "Course not found."}, status=404)

        
class StudentDashboardView(APIView):
    
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.path.endswith('/available-courses/'):
            return self.get_available_courses(request)
        elif request.path.endswith('/my-courses/'):
            return self.get_my_courses(request)
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

                # Fetch courses in which the student has not enrolled
                courses = get_available_student_courses(student)

                serializer = CourseSerializer(courses, many=True)

                return JsonResponse(serializer.data, safe=False, status=200)
            
            else:
                return JsonResponse({'message': 'Failed in StudentDashboardView.'}, status=400)
            
    def get_my_courses(self, request):

         # Get user ID
            user_id = request.user.id
            # Check if user is teacher or student
            user_type, user = get_user_type(user_id)

            print(f'We got a user: {user}')

            if user_type == 'student':

                student: Student = user

                # Fetch courses in which the student has enrolled, together with enrollment IDs
                student_courses = get_student_courses(student)

                return JsonResponse(student_courses, safe=False, status=200)
            
            else:
                return JsonResponse({'message': 'Failed in StudentDashboardView.'}, status=400)

                