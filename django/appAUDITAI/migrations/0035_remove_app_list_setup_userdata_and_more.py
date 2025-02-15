# Generated by Django 5.1.3 on 2025-01-24 23:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appAUDITAI', '0034_app_record_request_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='app_list',
            name='SETUP_USERDATA',
        ),
        migrations.AddField(
            model_name='app_list',
            name='SETUP_ROLLOWNER',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
        migrations.AlterField(
            model_name='app_list',
            name='SETUP_GENINFO',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
        migrations.AlterField(
            model_name='app_list',
            name='SETUP_PROCESS',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
    ]
