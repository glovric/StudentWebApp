from django.db import models

class Course(models.Model):

    name = models.CharField(max_length=100)
    points = models.IntegerField()

    def __str__(self):
        return f'{self.name}'
    
    class Meta:
        db_table = 'courses'
