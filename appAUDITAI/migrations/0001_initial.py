# Generated by Django 4.1.6 on 2023-11-27 01:20

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='APP_LIST',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('COMPANY_ID', models.CharField(blank=True, max_length=1000, null=True)),
                ('APP_NAME', models.CharField(blank=True, max_length=100, null=True)),
                ('APP_TYPE', models.CharField(blank=True, max_length=100, null=True)),
                ('HOSTED', models.CharField(blank=True, max_length=50, null=True)),
                ('RISKRATING', models.CharField(blank=True, max_length=50, null=True)),
                ('RELEVANT_PROCESS', models.CharField(blank=True, max_length=100, null=True)),
                ('DATE_IMPLEMENTED', models.CharField(blank=True, max_length=100, null=True)),
                ('DATE_TERMINATED', models.DateField(blank=True, null=True)),
                ('AUTHENTICATION_TYPE', models.CharField(blank=True, max_length=50, null=True)),
                ('CREATED_BY', models.CharField(blank=True, max_length=50, null=True)),
                ('CREATED_ON', models.DateField(auto_now_add=True, null=True)),
                ('LAST_MODIFIED', models.DateTimeField(null=True)),
                ('MODIFIED_BY', models.CharField(blank=True, max_length=50, null=True)),
                ('APPLICATION_OWNER', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'APP_LIST',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='APP_RECORD',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('APP_TYPE', models.CharField(blank=True, max_length=50, null=True)),
                ('USER_ID', models.CharField(blank=True, max_length=50, null=True)),
                ('EMAIL_ADDRESS', models.CharField(blank=True, max_length=50, null=True)),
                ('FIRST_NAME', models.CharField(blank=True, max_length=50, null=True)),
                ('LAST_NAME', models.CharField(blank=True, max_length=50, null=True)),
                ('ROLE_NAME', models.CharField(blank=True, max_length=100, null=True)),
                ('STATUS', models.CharField(blank=True, max_length=50, null=True)),
                ('TYPE', models.CharField(blank=True, max_length=50, null=True)),
                ('OWNER_IF_SYSTEM', models.CharField(blank=True, max_length=50, null=True)),
                ('OWNER_IF_REGULAR', models.CharField(blank=True, max_length=50, null=True)),
                ('IS_ADMIN', models.CharField(blank=True, max_length=50, null=True)),
                ('DATE_GRANTED', models.DateTimeField(null=True)),
                ('DATE_APPROVED', models.DateTimeField(null=True)),
                ('ACCESS_APPROVER_NAME1', models.CharField(blank=True, max_length=50, null=True)),
                ('ACCESS_APPROVER_TITLE1', models.CharField(blank=True, max_length=50, null=True)),
                ('ACCESS_APPROVER_NAME2', models.CharField(blank=True, max_length=50, null=True)),
                ('ACCESS_APPROVER_TITLE2', models.CharField(blank=True, max_length=50, null=True)),
                ('APPROVAL_TYPE', models.CharField(blank=True, max_length=100, null=True)),
                ('APPROVAL_REFERENCE', models.CharField(blank=True, max_length=100, null=True)),
                ('APPROVAL_SUPPORT', models.CharField(blank=True, max_length=1000, null=True)),
                ('DATE_REVOKED', models.DateTimeField(null=True)),
                ('LAST_LOGIN', models.DateTimeField(null=True)),
                ('HR_NOTIFICATION_DATE', models.DateTimeField(null=True)),
                ('NOTIFICATION_TYPE', models.CharField(blank=True, max_length=100, null=True)),
                ('NOTIFICATION_SUPPORT', models.CharField(blank=True, max_length=100, null=True)),
                ('DATE_LAST_CERTIFIED', models.DateTimeField(null=True)),
                ('CERTIFIED_BY', models.CharField(blank=True, max_length=50, null=True)),
                ('TAGGED_INAPPROPRITE', models.CharField(blank=True, max_length=50, null=True)),
                ('DATE_TAGGED_INAPPROPRIATE', models.DateTimeField(null=True)),
                ('MAPPED_TO_HR', models.CharField(blank=True, max_length=50, null=True)),
                ('MAPPED_HR_FNAME', models.CharField(blank=True, max_length=50, null=True)),
                ('MAPPED_HR_LNAME', models.CharField(blank=True, max_length=50, null=True)),
                ('MAPPED_HR_EMAIL', models.CharField(blank=True, max_length=50, null=True)),
                ('MAPPED_USING', models.CharField(blank=True, max_length=100, null=True)),
                ('CREATED_BY', models.CharField(blank=True, max_length=50, null=True)),
                ('CREATED_ON', models.DateField(auto_now_add=True, null=True)),
                ('LAST_MODIFIED', models.DateTimeField(null=True)),
                ('MODIFIED_BY', models.CharField(blank=True, max_length=50, null=True)),
                ('APP_NAME', models.ForeignKey(blank=True, max_length=100, null=True, on_delete=django.db.models.deletion.CASCADE, to='appAUDITAI.app_list')),
            ],
            options={
                'db_table': 'APP_RECORD',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='APP_USERS',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('USER_ID', models.CharField(blank=True, max_length=100, null=True)),
                ('FIRST_NAME', models.CharField(blank=True, max_length=100, null=True)),
                ('LAST_NAME', models.CharField(blank=True, max_length=100, null=True)),
                ('EMAIL_ADDRESS', models.CharField(blank=True, max_length=100, null=True)),
                ('STATUS', models.CharField(blank=True, max_length=100, null=True)),
                ('LOCKED', models.CharField(blank=True, max_length=100, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='COMPANY',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('COMPANY_ID', models.CharField(blank=True, max_length=50, null=True)),
                ('COMPANY_NAME', models.CharField(blank=True, max_length=100, null=True)),
                ('CREATED_BY', models.CharField(blank=True, max_length=50, null=True)),
                ('CREATED_ON', models.DateField(auto_now_add=True, null=True)),
                ('LAST_MODIFIED', models.DateTimeField(null=True)),
                ('MODIFIED_BY', models.CharField(blank=True, max_length=50, null=True)),
            ],
            options={
                'db_table': 'COMPANY',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='CONTROLS',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('CONTROL_ID', models.CharField(blank=True, max_length=50, null=True)),
                ('CONTROL_NAME', models.CharField(blank=True, max_length=50, null=True)),
                ('CONTROL_DESCRIPTION', models.CharField(blank=True, max_length=50, null=True)),
                ('CREATED_BY', models.CharField(blank=True, max_length=50, null=True)),
                ('CREATED_ON', models.DateField(auto_now_add=True, null=True)),
                ('LAST_MODIFIED', models.DateTimeField(null=True)),
                ('MODIFIED_BY', models.CharField(blank=True, max_length=50, null=True)),
                ('APP_NAME', models.ManyToManyField(to='appAUDITAI.app_record')),
                ('COMPANY_ID', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='appAUDITAI.company')),
            ],
            options={
                'db_table': 'CONTROLS',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='CSV',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file_name', models.FileField(upload_to='csvs')),
                ('upload_date', models.DateTimeField(auto_now_add=True)),
                ('activated', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='HR_RECORD',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('COMPANY_ID', models.CharField(blank=True, max_length=1000, null=True)),
                ('USER_ID', models.CharField(blank=True, max_length=50, null=True)),
                ('EMAIL_ADDRESS', models.CharField(blank=True, max_length=50, null=True)),
                ('FIRST_NAME', models.CharField(blank=True, max_length=50, null=True)),
                ('LAST_NAME', models.CharField(blank=True, max_length=50, null=True)),
                ('JOB_TITLE', models.CharField(blank=True, max_length=50, null=True)),
                ('DEPARTMENT', models.CharField(blank=True, max_length=50, null=True)),
                ('MANAGER', models.CharField(blank=True, max_length=50, null=True)),
                ('HIRE_DATE', models.DateField(null=True)),
                ('EMP_TYPE', models.CharField(blank=True, max_length=10, null=True)),
                ('REHIRE_DATE', models.DateField(null=True)),
                ('STATUS', models.CharField(blank=True, max_length=50, null=True)),
                ('TERMINATION_DATE', models.DateField(null=True)),
                ('CREATED_BY', models.CharField(blank=True, max_length=50, null=True)),
                ('CREATED_ON', models.DateField(auto_now_add=True, null=True)),
                ('LAST_MODIFIED', models.DateTimeField(null=True)),
                ('MODIFIED_BY', models.CharField(blank=True, max_length=50, null=True)),
            ],
            options={
                'db_table': 'HR_RECORD',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='SAP_AGR_USERS',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('UNAME', models.CharField(blank=True, max_length=50, null=True)),
                ('MANDT', models.CharField(blank=True, max_length=50, null=True)),
                ('AGR_NAME', models.CharField(blank=True, max_length=50, null=True)),
                ('FROM_DAT', models.DateTimeField()),
                ('TO_DAT', models.DateTimeField()),
                ('CREATED_BY', models.CharField(blank=True, max_length=50, null=True)),
                ('CREATED_ON', models.DateField(auto_now_add=True, null=True)),
                ('LAST_MODIFIED', models.DateTimeField(null=True)),
                ('MODIFIED_BY', models.CharField(blank=True, max_length=50, null=True)),
            ],
            options={
                'db_table': 'SAP_AGR_USERS',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='SAP_USR02',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('BNAME', models.CharField(blank=True, max_length=50, null=True)),
                ('MANDT', models.CharField(blank=True, max_length=50, null=True)),
                ('USTYP', models.CharField(blank=True, max_length=2, null=True)),
                ('GLTGB', models.DateTimeField()),
                ('GLTGV', models.DateField()),
                ('TRDAT', models.DateTimeField()),
                ('LTIME', models.DateTimeField()),
                ('UFLAG', models.CharField(blank=True, max_length=10)),
                ('CREATED_BY', models.CharField(blank=True, max_length=50, null=True)),
                ('CREATED_ON', models.DateField(auto_now_add=True, null=True)),
                ('LAST_MODIFIED', models.DateTimeField(null=True)),
                ('MODIFIED_BY', models.CharField(blank=True, max_length=50, null=True)),
            ],
            options={
                'db_table': 'SAP_USR02',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='UserRoles',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('FIRST_NAME', models.CharField(blank=True, max_length=150, null=True)),
                ('LAST_NAME', models.CharField(blank=True, max_length=150, null=True)),
                ('EMAIL_ADDRESS', models.CharField(blank=True, max_length=150, null=True)),
                ('ROLE', models.CharField(blank=True, max_length=150, null=True)),
                ('CREATED_BY', models.CharField(blank=True, max_length=150, null=True)),
                ('CREATED_ON', models.DateField(auto_now_add=True, null=True)),
                ('LAST_MODIFIED', models.DateTimeField(null=True)),
                ('MODIFIED_BY', models.CharField(blank=True, max_length=150, null=True)),
                ('USERNAME', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'USERROLES',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='TERMINATION',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('REQUIRED_DAYS', models.IntegerField(null=True)),
                ('CREATED_BY', models.CharField(blank=True, max_length=50, null=True)),
                ('CREATED_ON', models.DateField(auto_now_add=True, null=True)),
                ('LAST_MODIFIED', models.DateTimeField(null=True)),
                ('MODIFIED_BY', models.CharField(blank=True, max_length=50, null=True)),
                ('CONTROL_ID', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='appAUDITAI.controls')),
            ],
            options={
                'db_table': 'TERMINATION',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='PROVISIONING',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('REQUIRED_APPROVERS', models.CharField(blank=True, max_length=50, null=True)),
                ('CREATED_BY', models.CharField(blank=True, max_length=50, null=True)),
                ('CREATED_ON', models.DateField(auto_now_add=True, null=True)),
                ('LAST_MODIFIED', models.DateTimeField(null=True)),
                ('MODIFIED_BY', models.CharField(blank=True, max_length=50, null=True)),
                ('CONTROL_ID', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='appAUDITAI.controls')),
            ],
            options={
                'db_table': 'PROVISIONING',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='POLICIES',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('POLICY_NAME', models.CharField(blank=True, max_length=50, null=True)),
                ('POLICY_DESCRIPTION', models.CharField(blank=True, max_length=1000, null=True)),
                ('LAST_UPDATED', models.DateField(null=True)),
                ('CREATED_BY', models.CharField(blank=True, max_length=50, null=True)),
                ('CREATED_ON', models.DateField(auto_now_add=True, null=True)),
                ('LAST_MODIFIED', models.DateTimeField(null=True)),
                ('MODIFIED_BY', models.CharField(blank=True, max_length=50, null=True)),
                ('CONTROL_ID', models.ManyToManyField(to='appAUDITAI.controls')),
            ],
            options={
                'db_table': 'POLICIES',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='PASSWORD',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('COMPLEXITY_ENABLED', models.BooleanField(blank=True, null=True)),
                ('LENGTH', models.IntegerField(blank=True, null=True)),
                ('UPPER', models.BooleanField(blank=True, null=True)),
                ('LOWER', models.BooleanField(blank=True, null=True)),
                ('NUMBER', models.BooleanField(blank=True, null=True)),
                ('SPECIAL_CHAR', models.BooleanField(blank=True, null=True)),
                ('AGE', models.IntegerField(blank=True, null=True)),
                ('HISTORY', models.IntegerField(blank=True, null=True)),
                ('LOCKOUT_ATTEMPT', models.IntegerField(blank=True, null=True)),
                ('LOCKOUT_DURATION', models.CharField(blank=True, max_length=50, null=True)),
                ('MFA_ENABLED', models.BooleanField(blank=True, null=True)),
                ('CONTROL_ID', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='appAUDITAI.controls')),
            ],
            options={
                'db_table': 'PASSWORD',
                'managed': True,
            },
        ),
    ]
