
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from evaluaciones.views import StudentViewSet, TeacherViewSet, CourseViewSet, EvaluationViewSet

router = DefaultRouter()
router.register(r'students', StudentViewSet, basename='student')
router.register(r'teachers', TeacherViewSet, basename='teacher')
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'evaluations', EvaluationViewSet, basename='evaluation')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.authtoken')),

    # --- RUTAS EXPLÍCITAS PARA ACCIONES ---

    # Rutas para StudentViewSet
    path('api/students/enrolled_courses/', StudentViewSet.as_view({'get': 'enrolled_courses'}), name='student-enrolled-courses'),
    path('api/students/unevaluated_courses/', StudentViewSet.as_view({'get': 'unevaluated_courses'}), name='student-unevaluated-courses'),
    path('api/students/me/', StudentViewSet.as_view({'get': 'get_my_profile'}), name='student-me'),

    # Ruta para TeacherViewSet
    path('api/teachers/general_evaluations/', TeacherViewSet.as_view({'get': 'general_evaluations'}), name='teacher-general-evaluations'),
    
    # Rutas para EvaluationViewSet
    path('api/evaluations/historical_evaluations/', EvaluationViewSet.as_view({'get': 'historical_evaluations'}), name='evaluation-historical'),
    
    # ✅ CORRECCIÓN: Se añade la ruta que faltaba para el reporte de gráficos.
    path('api/evaluations/report_by_career_semester/', EvaluationViewSet.as_view({'get': 'report_by_career_semester'}), name='evaluation-report'),
]