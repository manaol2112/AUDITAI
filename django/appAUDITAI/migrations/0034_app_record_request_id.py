# Generated by Django 5.1.3 on 2025-01-24 22:40

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appAUDITAI', '0033_alter_hr_record_import_log_file_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='app_record',
            name='REQUEST_ID',
            field=models.ForeignKey(blank=True, max_length=100, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='access_request_id', to='appAUDITAI.accessrequest'),
        ),
    ]
