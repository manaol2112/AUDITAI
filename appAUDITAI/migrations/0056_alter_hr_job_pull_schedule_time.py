# Generated by Django 5.0.4 on 2024-05-04 01:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appAUDITAI', '0055_csv_mapping_table_csv_upload_fields'),
    ]

    operations = [
        migrations.AlterField(
            model_name='hr_job_pull',
            name='SCHEDULE_TIME',
            field=models.TimeField(blank=True, null=True),
        ),
    ]
