# Generated by Django 5.0.6 on 2024-05-24 00:01

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appAUDITAI', '0084_remove_controls_company_id_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='RISKLIST',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('RISK_ID', models.CharField(blank=True, max_length=256, null=True)),
                ('RISK_TYPE', models.CharField(blank=True, max_length=256, null=True)),
                ('RISK_DESCRIPTION', models.CharField(blank=True, max_length=256, null=True)),
                ('COMPANY_ID', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='appAUDITAI.company')),
            ],
            options={
                'db_table': 'RISKLIST',
                'managed': True,
            },
        ),
    ]
