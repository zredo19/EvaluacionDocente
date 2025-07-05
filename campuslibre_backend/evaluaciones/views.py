
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Avg
from .models import Student, Teacher, Course, Evaluation
from .serializers import StudentSerializer, TeacherSerializer, CourseSerializer, EvaluationSerializer
from django.db import IntegrityError

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and hasattr(user, 'student') and not user.is_staff:
            return Student.objects.filter(user=user)
        elif user.is_staff:
            return Student.objects.all()
        return Student.objects.none()

    @action(detail=False, methods=['get'], url_path='me', permission_classes=[IsAuthenticated])
    def get_my_profile(self, request):
        try:
            student = Student.objects.get(user=request.user)
            serializer = self.get_serializer(student)
            return Response(serializer.data)
        except Student.DoesNotExist:
            return Response({"detail": "Perfil de estudiante no encontrado."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='enrolled_courses', permission_classes=[IsAuthenticated])
    def enrolled_courses(self, request):
        try:
            student = Student.objects.get(user=request.user)
            enrolled = student.enrolled_courses.all()
            serializer = CourseSerializer(enrolled, many=True)
            return Response(serializer.data)
        except Student.DoesNotExist:
            return Response({"detail": "Perfil de estudiante no encontrado."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'], url_path='unevaluated_courses', permission_classes=[IsAuthenticated])
    def unevaluated_courses(self, request):
        try:
            student = Student.objects.get(user=request.user)
            enrolled_courses = student.enrolled_courses.all()
            evaluated_course_ids = Evaluation.objects.filter(student=student).values_list('course_id', flat=True)
            unevaluated = enrolled_courses.exclude(id__in=evaluated_course_ids)
            serializer = CourseSerializer(unevaluated, many=True)
            return Response(serializer.data)
        except Student.DoesNotExist:
            return Response({"detail": "Perfil de estudiante no encontrado."}, status=status.HTTP_404_NOT_FOUND)

class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'general_evaluations']:
            return [IsAuthenticated()]
        return [IsAdminUser()]

    # ✅ CORRECCIÓN: url_path ahora usa guion bajo
    @action(detail=False, methods=['get'], url_path='general_evaluations', permission_classes=[IsAuthenticated])
    def general_evaluations(self, request):
        teachers = self.get_queryset()
        serializer = self.get_serializer(teachers, many=True)
        return Response(serializer.data)

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'search', 'filter']:
            return [IsAuthenticated()]
        return [IsAdminUser()]

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def search(self, request):
        # ... (la lógica de búsqueda no necesita cambios)
        pass

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def filter(self, request):
        # ... (la lógica de filtro no necesita cambios)
        pass

class EvaluationViewSet(viewsets.ModelViewSet):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and hasattr(user, 'student'):
            return Evaluation.objects.filter(student=user.student)
        return Evaluation.objects.none()

    # ✅ MÉTODO CREATE CORREGIDO
    def create(self, request, *args, **kwargs):
        user = request.user
        try:
            student = Student.objects.get(user=user)
        except Student.DoesNotExist:
            return Response({"detail": "No se encontró un perfil de estudiante para el usuario autenticado."}, status=status.HTTP_400_BAD_REQUEST)

        # Copiamos los datos para poder modificarlos
        data = request.data.copy()
        data['student'] = student.pk

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        # Validaciones personalizadas
        rating = serializer.validated_data.get('rating')
        comment = serializer.validated_data.get('comment')

        if not (1.0 <= rating <= 7.0):
            return Response({"rating": ["La calificación debe ser entre 1.0 y 7.0."]}, status=status.HTTP_400_BAD_REQUEST)
        if not comment or not comment.strip():
            return Response({"comment": ["El comentario es obligatorio."]}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ BLOQUE TRY...EXCEPT PARA MANEJAR DUPLICADOS
        try:
            self.perform_create(serializer)
        except IntegrityError:
            # Esto se activa si la regla 'unique_together' de la BD falla
            return Response({"detail": "Ya has evaluado este curso en este semestre y año."}, status=status.HTTP_409_CONFLICT)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    # ✅ CORRECCIÓN: url_path ahora usa guion bajo
    @action(detail=False, methods=['get'], url_path='historical_evaluations', permission_classes=[IsAuthenticated])
    def historical_evaluations(self, request):
        try:
            student = Student.objects.get(user=request.user)
            evaluations = Evaluation.objects.filter(student=student)
            year = request.query_params.get('year')
            semester = request.query_params.get('semester')
            if year:
                evaluations = evaluations.filter(year=int(year))
            if semester:
                evaluations = evaluations.filter(semester__iexact=semester)
            serializer = self.get_serializer(evaluations, many=True)
            return Response(serializer.data)
        except Student.DoesNotExist:
            return Response({"detail": "Perfil de estudiante no encontrado."}, status=status.HTTP_404_NOT_FOUND)

    # ✅ CORRECCIÓN: url_path ahora usa guion bajo
    @action(detail=False, methods=['get'], url_path='report_by_career_semester', permission_classes=[IsAuthenticated])
    def report_by_career_semester(self, request):
        career = request.query_params.get('career')
        semester = request.query_params.get('semester')
        year = request.query_params.get('year')

        queryset = Evaluation.objects.all()
        if career:
            queryset = queryset.filter(course__career__iexact=career)
        if semester:
            queryset = queryset.filter(semester__iexact=semester)
        if year:
            queryset = queryset.filter(year=int(year))
        
        report_data = queryset.values('course__career', 'semester').annotate(average_rating=Avg('rating')).order_by('course__career', 'semester')
        
        formatted_report = { f"{item['course__career']} - {item['semester']}": round(item['average_rating'], 2) if item['average_rating'] is not None else 0.0 for item in report_data}
        return Response(formatted_report)