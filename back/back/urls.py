"""

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from api.views import (CourseView, UserDataView, EnrollView, 
                       RegisterView, TeacherDashboardView, StudentDashboardView)
from api.helpers import get_csrf_token
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('courses/', CourseView.as_view(), name='course-list-create'),
    path('csrf-token/', get_csrf_token, name='get-csrf-token'),
    path('login/', TokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('register/', RegisterView.as_view(), name='register'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('user-data/', UserDataView.as_view(), name='user-data-view'),
    path('enroll/', EnrollView.as_view(), name='enroll'),
    path('delete-enroll/<int:enrollment_id>/', EnrollView.as_view(), name='delete-enroll'),  # For DELETE requests
    path('teacher-dashboard/', TeacherDashboardView.as_view(), name='teacher-dashboard'),
    path('student-dashboard/available-courses/', StudentDashboardView.as_view(), name='student-dashboard'),
    path('student-dashboard/my-courses/', StudentDashboardView.as_view(), name='student-dashboard')
]
