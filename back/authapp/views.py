from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.http import JsonResponse
import json
        
class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "This is a protected view only for authenticated users."})

def register(request):
    if request.method == 'POST':

        data = json.loads(request.body)

        first_name = data.get('first_name').lower().capitalize()
        last_name = data.get('last_name').lower().capitalize()
        username = first_name[0].lower() + last_name.lower()
        email = first_name[0].lower() + last_name.lower() + "@faks.com"
        password = data.get('password')
    
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
        user.save()

        return JsonResponse({'success': True, 'message': f"Your account has been created! You can now log in.", 'email': email})

    return JsonResponse({'success': False, 'message': "Invalid request method."}, status=405)