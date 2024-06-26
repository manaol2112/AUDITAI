# Generated by Django 5.0.6 on 2024-06-09 21:36

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appAUDITAI', '0114_rf_evidence_rf_testing_delete_sap_agr_users_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='ALPHAREGISTRATION',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('FIRST_NAME', models.CharField(blank=True, max_length=25, null=True)),
                ('LAST_NAME', models.CharField(blank=True, max_length=25, null=True)),
                ('COMPANY', models.CharField(blank=True, max_length=25, null=True)),
                ('EMAIL', models.CharField(blank=True, max_length=25, null=True)),
                ('MESSAGE', models.CharField(blank=True, max_length=25, null=True)),
            ],
            options={
                'db_table': 'ALPHA_REG',
                'managed': True,
            },
        ),
    ]
