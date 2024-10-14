from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_delete
from django.dispatch import receiver

class Course(models.Model):

    name = models.CharField(max_length=100)
    points = models.IntegerField()

    def __str__(self):
        return f'{self.name}'
    
    class Meta:
        db_table = 'courses'

class Student(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    academic_id = models.CharField(max_length=8, unique=True)

    def __str__(self):
        return f'Student {self.user.username}'

    class Meta:
        db_table = 'students'

class Teacher(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    department = models.CharField(max_length=255)
    academic_title = models.CharField(max_length=50)
    academic_id = models.CharField(max_length=15)

    def __str__(self):
        return f'Teacher {self.user.username}'

    class Meta:
        db_table = 'teachers'

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