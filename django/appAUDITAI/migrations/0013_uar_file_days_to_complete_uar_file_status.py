# Generated by Django 5.1.3 on 2024-12-16 20:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appAUDITAI', '0012_remove_uar_file_initiated_on_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='uar_file',
            name='DAYS_TO_COMPLETE',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='uar_file',
            name='STATUS',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
