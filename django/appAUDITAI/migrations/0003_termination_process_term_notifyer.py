# Generated by Django 5.1.3 on 2024-11-10 20:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appAUDITAI', '0002_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='termination_process',
            name='TERM_NOTIFYER',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]