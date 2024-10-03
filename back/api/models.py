from django.db import models

class Student(models.Model):

    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    dob = models.CharField(max_length=100)
    mail = models.CharField(max_length=100)
    password = models.CharField(max_length=256)

    def __str__(self):
        return f'{self.name}{self.surname} | {self.mail}'
    
    class Meta:
        db_table = 'students'

class Course(models.Model):

    name = models.CharField(max_length=100)
    points = models.IntegerField()

    def __str__(self):
        return f'{self.name}'
    
    class Meta:
        db_table = 'courses'
