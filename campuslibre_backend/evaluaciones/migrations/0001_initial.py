# Generated by Django 5.2.4 on 2025-07-05 03:01

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('code', models.CharField(max_length=20, unique=True)),
                ('name', models.CharField(max_length=100)),
                ('career', models.CharField(max_length=100)),
                ('semester', models.CharField(choices=[('1', 'Primer Semestre'), ('2', 'Segundo Semestre')], max_length=1)),
                ('year', models.IntegerField(default=2025)),
            ],
        ),
        migrations.CreateModel(
            name='Teacher',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=40)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('department', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='Student',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('name', models.CharField(max_length=40)),
                ('career', models.CharField(max_length=100)),
                ('enrolled_courses', models.ManyToManyField(blank=True, related_name='enrolled_students', to='evaluaciones.course')),
            ],
        ),
        migrations.AddField(
            model_name='course',
            name='teacher',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='courses', to='evaluaciones.teacher'),
        ),
        migrations.CreateModel(
            name='Evaluation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rating', models.FloatField()),
                ('comment', models.TextField()),
                ('date', models.DateField(auto_now_add=True)),
                ('semester', models.CharField(choices=[('1', 'Primer Semestre'), ('2', 'Segundo Semestre')], max_length=1)),
                ('year', models.IntegerField()),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='evaluations', to='evaluaciones.course')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='evaluations', to='evaluaciones.student')),
            ],
            options={
                'unique_together': {('student', 'course', 'semester', 'year')},
            },
        ),
    ]
