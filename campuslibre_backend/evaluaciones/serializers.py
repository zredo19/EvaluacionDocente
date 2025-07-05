# evaluaciones/serializers.py

from rest_framework import serializers
from django.db.models import Avg
from .models import Student, Teacher, Course, Evaluation
from rest_framework.authtoken.models import Token # Importa el modelo Token
from djoser.serializers import TokenSerializer as DjoserTokenSerializer # Importa el serializador base de Djoser

class StudentSerializer(serializers.ModelSerializer):
    # 'user' es ahora la primary_key, Django REST Framework lo manejará por defecto.
    # Si quieres mostrar el email del usuario vinculado, puedes añadir:
    # user_email = serializers.CharField(source='user.email', read_only=True)
    class Meta:
        model = Student
        fields = '__all__' # Incluirá 'user' que es la PK

class TeacherSerializer(serializers.ModelSerializer):
    overall_rating = serializers.SerializerMethodField()

    class Meta:
        model = Teacher
        fields = '__all__'

    def get_overall_rating(self, obj):
        average = Evaluation.objects.filter(course__teacher=obj).aggregate(Avg('rating'))['rating__avg']
        return round(average, 2) if average is not None else 0.0

class CourseSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='teacher.name', read_only=True)
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = '__all__'

    def get_average_rating(self, obj):
        average = obj.evaluations.aggregate(Avg('rating'))['rating__avg']
        return round(average, 2) if average is not None else 0.0

class EvaluationSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.name', read_only=True)
    student_name = serializers.CharField(source='student.name', read_only=True)

    class Meta:
        model = Evaluation
        fields = '__all__'

# Serializer personalizado para el login (para devolver student_id)
# Usado por Djoser para el endpoint token/login/
class CustomTokenSerializer(DjoserTokenSerializer):
    student_id = serializers.SerializerMethodField() # Añadir student_id a la respuesta del token

    class Meta(DjoserTokenSerializer.Meta):
        fields = DjoserTokenSerializer.Meta.fields + ('student_id',)

    def get_student_id(self, obj):
        # obj es el objeto Token. obj.user es el User asociado al token.
        # Intentamos obtener el Student asociado a este User.
        try:
            return obj.user.student.pk # Ahora student.pk es el id del User
        except Student.DoesNotExist:
            return None # Si no hay un Student asociado a este User, devuelve None