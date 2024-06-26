# Generated by Django 5.0.4 on 2024-04-26 16:44

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appAUDITAI', '0047_app_job_pull_friday_app_job_pull_monday_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='terminationpolicy',
            name='COMPANY_ID',
        ),
        migrations.AddField(
            model_name='terminationpolicy',
            name='APP_NAME',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='appAUDITAI.app_list'),
        ),
        migrations.AddField(
            model_name='terminationpolicy',
            name='HOW_NOTIFY_AUTOMATED',
            field=models.BooleanField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='terminationpolicy',
            name='HOW_NOTIFY_EMAIL',
            field=models.BooleanField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='terminationpolicy',
            name='HOW_NOTIFY_VERBAL',
            field=models.BooleanField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='terminationpolicy',
            name='WHO_NOTIFY_AUTOMATED',
            field=models.BooleanField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='terminationpolicy',
            name='WHO_NOTIFY_HR',
            field=models.BooleanField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='terminationpolicy',
            name='WHO_NOTIFY_MANAGER',
            field=models.BooleanField(blank=True, null=True),
        ),
    ]
