# Generated by Django 5.1.3 on 2025-01-06 21:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appAUDITAI', '0016_uar_data_review_cycle'),
    ]

    operations = [
        migrations.AddField(
            model_name='alpharegistration',
            name='REFERRER',
            field=models.CharField(blank=True, max_length=25, null=True),
        ),
        migrations.AlterField(
            model_name='alpharegistration',
            name='DATE_REGISTERED',
            field=models.DateField(auto_now_add=True, null=True),
        ),
    ]