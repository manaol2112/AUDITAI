from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab
import django

from celery.signals import after_task_publish, task_postrun
import logging

logger = logging.getLogger('celery')

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'auditai.settings')

# Initialize Celery app
app = Celery('auditai')

# Using Django settings to configure Celery
app.config_from_object('django.conf:settings', namespace='CELERY')

# Initialize Django
django.setup()

# Import your tasks after Django setup
from appAUDITAI.Views.ADMIN.jobs import fetch_user_data

app.conf.broker_url = 'redis://localhost:6379/0'  # Use Redis as the broker

# Set up periodic task scheduling
app.conf.beat_schedule = {
    # 'fetch-user-list': {
    #     'task': 'appAUDITAI.Views.ADMIN.jobs.fetch_user_data',  
    #     'schedule': 600.0,  # Every 10 minutes
    # },
    'fetch-hr-list': {
        'task': 'appAUDITAI.Views.ADMIN.jobs.fetch_hr_data',   
        'schedule': 30.0,  # Every 10 minutes
    },
    'deactivate_termed_users_ad': {
        'task': 'appAUDITAI.Views.ADMIN.jobs.deactivate_ad_account', 
        'schedule': 60.0,  # Every 10 minutes
    },
    
}

# Celery task
@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))

@task_postrun.connect
def task_postrun_handler(sender=None, **kwargs):
    task_name = sender.name
    logger.info(f"Task {task_name} finished running.")

# Automatically discover tasks from all registered Django app configs
app.autodiscover_tasks()
