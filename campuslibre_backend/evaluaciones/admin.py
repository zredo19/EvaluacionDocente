from django.contrib import admin
from django.contrib.auth.models import Group
from .models import Student, Teacher, Course, Evaluation

# Elimina "Groups" del admin
admin.site.unregister(Group)

# Registra los modelos que quieres ver en el admin
admin.site.register(Student)
admin.site.register(Teacher)

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'teacher', 'career', 'year', 'semester')
    list_filter = ('career', 'year', 'semester', 'teacher')
    search_fields = ('name', 'code', 'teacher__name')