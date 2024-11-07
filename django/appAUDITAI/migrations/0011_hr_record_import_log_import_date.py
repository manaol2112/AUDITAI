from django.db import migrations, models
import datetime

class Migration(migrations.Migration):

    dependencies = [
        ('appAUDITAI', '0010_hr_record_import_log'),
    ]

    operations = [
        migrations.AddField(
            model_name='hr_record_import_log',
            name='IMPORT_DATE',
            field=models.DateField(default=datetime.date(1900, 1, 1)),
            preserve_default=False,
        ),
    ]
