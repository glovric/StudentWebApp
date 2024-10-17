from rest_framework import generics
from .models import Course, Student, Teacher
from .serializers import CourseSerializer
from django.http import JsonResponse
from django.middleware.csrf import get_token
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
import json
from random import choices

class CourseListCreateView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

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