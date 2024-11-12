from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.contrib import admin

class Course(models.Model):

    name = models.CharField(max_length=100)
    points = models.IntegerField()
    image_url = models.CharField(max_length=2048, default=None)
    students = models.ManyToManyField('Student', through='Enrollment', related_name='courses')
    coordinator = models.ForeignKey('Teacher', on_delete=models.SET_NULL, null=True, blank=True, related_name='main_courses')
    associates = models.ManyToManyField('Teacher', through="Associate", blank=True, related_name='additional_courses')

    def __str__(self):
        return f'{self.name}'
    
    class Meta:
        db_table = 'courses'

class Student(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    academic_id = models.CharField(max_length=8, unique=True)

    def __str__(self):
        return f'{self.user.first_name} {self.user.last_name}'

    class Meta:
        db_table = 'students'

class Teacher(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    department = models.CharField(max_length=255)
    academic_title = models.CharField(max_length=50)
    academic_id = models.CharField(max_length=15)

    def __str__(self):
        return f'{self.academic_title} {self.user.first_name} {self.user.last_name}'

    class Meta:
        db_table = 'teachers'

class Enrollment(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    enrollment_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'course')  # Ensure a student can't enroll in the same course twice
        db_table = 'enrollments'

    def __str__(self):
        return f'{self.student} enrolled in {self.course}'

class Associate(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    class Meta:
        db_table = 'associates'

    def __str__(self):
        return f'Associate {self.teacher} in course {self.course}'

@receiver(post_delete, sender=Student)
def delete_user_on_student_delete(sender, instance, **kwargs):
    # Check if a Teacher exists for the same User
    if not Teacher.objects.filter(user=instance.user).exists():
        instance.user.delete()  # Delete the associated User instance if no Teacher exists
    else:
        print(f'Skipping deletion of User: {instance.user.username} because a Teacher exists.')

@receiver(post_delete, sender=Teacher)
def delete_user_on_teacher_delete(sender, instance, **kwargs):
    instance.user.delete()  # Delete the associated User instance