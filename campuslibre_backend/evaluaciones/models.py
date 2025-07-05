# evaluaciones/models.py

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone 

class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    name = models.CharField(max_length=40)
    career = models.CharField(max_length=100)
    # <-- ¡NUEVO CAMPO! Relación Many-to-Many con Course
    enrolled_courses = models.ManyToManyField('Course', related_name='enrolled_students', blank=True)

    def __str__(self):
        return self.name

class Teacher(models.Model):
    name = models.CharField(max_length=40)
    email = models.EmailField(unique=True)
    department = models.CharField(max_length=30)

    def __str__(self):
        return self.name

class Course(models.Model):
    # Opciones para el campo semestre
    SEMESTER_CHOICES = [
        ('1', 'Primer Semestre'),
        ('2', 'Segundo Semestre'),
    ]

    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=100)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='courses')
    career = models.CharField(max_length=100)
    
    # ✅ CAMBIO: Semestre ahora es un campo con opciones predefinidas
    semester = models.CharField(max_length=1, choices=SEMESTER_CHOICES)
    
    # ✅ CAMBIO: Se reemplaza 'credits' por 'year'
    year = models.IntegerField(default=timezone.now().year) # Año actual por defecto

    def __str__(self):
        return f"{self.code} - {self.name} ({self.year}-{self.semester})"

class Evaluation(models.Model):
    # Opciones para el campo semestre (consistente con Course)
    SEMESTER_CHOICES = [
        ('1', 'Primer Semestre'),
        ('2', 'Segundo Semestre'),
    ]

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='evaluations')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='evaluations')
    rating = models.FloatField()
    comment = models.TextField()
    date = models.DateField(auto_now_add=True)
    
    # ✅ CAMBIO: Semestre ahora es un campo con opciones predefinidas
    semester = models.CharField(max_length=1, choices=SEMESTER_CHOICES)
    
    year = models.IntegerField()

    class Meta:
        unique_together = ('student', 'course', 'semester', 'year')

    def __str__(self):
        return f"Evaluación de {self.course.name} por {self.student.name} ({self.rating})"
