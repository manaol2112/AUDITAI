from django.db import models
from django.contrib.auth.models import User, Group
from django.contrib.auth.hashers import make_password, check_password
import uuid
import os #this is to update the os_updated now
from django.conf import settings
from django.utils import timezone
from datetime import timedelta


class EmailVerification(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=10)  # Or adjust the length as needed
    expires_at = models.DateTimeField()


class UserToken(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, editable=False)

class USER_LOCKOUT(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    failed_attempts = models.IntegerField(default=0)
    locked_out = models.BooleanField(default=False)
    last_attempt_timestamp = models.DateTimeField(null=True, blank=True)
    # You can add other fields as needed, such as lockout duration, etc.

    def __str__(self):
        return self.user.username
    
#AUDITAI PASSWORD CONFIG
class PASSWORDCONFIG(models.Model):
    MIN_LENGTH = models.CharField(max_length=100,blank=True,null=True)
    HISTORY = models.CharField(max_length=100,blank=True,null=True)
    AGE = models.CharField(max_length=100,blank=True,null=True)
    LOCKOUT = models.CharField(max_length=100,blank=True,null=True)
    LOCKOUT_DURATION = models.CharField(max_length=100,blank=True,null=True)
    COMPLEXITY_ENABLED =  models.BooleanField(blank=True,null=True)
    HAS_SPECIALCHAR =  models.BooleanField(blank=True,null=True)
    HAS_NUMERIC =  models.BooleanField(blank=True,null=True)
    HAS_UPPER =  models.BooleanField(blank=True,null=True)
    HAS_LOWER =  models.BooleanField(blank=True,null=True)
    MFA_ENABLED =  models.BooleanField(blank=True,null=True)
    SESSION_LENGTH = models.CharField(max_length=100,blank=True,null=True)

    #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True, null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY = models.CharField(max_length=50,blank=True,null=True)

    # Ensure only one instance is maintained
    def save(self, *args, **kwargs):
        if PASSWORDCONFIG.objects.exists() and not self.pk:
            existing = PASSWORDCONFIG.objects.first()
            self.pk = existing.pk
        super(PASSWORDCONFIG, self).save(*args, **kwargs)
    
    def delete(self, *args, **kwargs):
        pass  # Prevent deletion of the single instance

    def __str__(self):
        return "SYSTEM Password Settings"

    class Meta:
        managed = True
        db_table = 'SYS_PWCONFIG'

#COMPANY
class COMPANY(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    COMPANY_ID = models.CharField(max_length=100,blank=True,null=True)
    COMPANY_NAME = models.CharField(max_length=1000,blank=True,null=True)
    SELECTED = models.BooleanField(blank=True,null=True)

    #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True, null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY = models.CharField(max_length=50,blank=True,null=True)

    def __str__(self):
        return self.COMPANY_NAME
    
    class Meta:
        managed = True
        db_table = 'COMPANY'

    #AUDITPROJECT


    
class HR_DATA_MAPPING(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.CharField(max_length=50, null=True, blank=False)
    email = models.CharField(max_length=50, null=True, blank=False)
    firstname = models.CharField(max_length=50, null=True, blank=False)
    lastname = models.CharField(max_length=50, null=True, blank=False)
    jobtitle = models.CharField(max_length=50, null=True, blank=False)
    department = models.CharField(max_length=50, null=True, blank=False)
    emptype = models.CharField(max_length=50, null=True, blank=False)
    manager = models.CharField(max_length=50, null=True, blank=False)
    status = models.CharField(max_length=50, null=True, blank=False)
    datehired = models.CharField(max_length=50, null=True, blank=False)
    daterehired = models.CharField(max_length=50, null=True, blank=False)
    termdate = models.CharField(max_length=50, null=True, blank=False)
    file_name = models.CharField(max_length=100, null=True, blank=False)
    file = models.FileField(upload_to='uploads/')

    class Meta:
        managed = True
        db_table = 'HR_DATA_UPLOAD'

class AUDITLIST(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    COMPANY_ID = models.ForeignKey(COMPANY,on_delete=models.CASCADE,blank=True,null=True)
    AUDIT_ID = models.CharField(max_length=100,blank=True,null=True)
    AUDIT_NAME = models.CharField(max_length=100,blank=True,null=True)
    AUDIT_DESCRIPTION = models.CharField(max_length=256,blank=True,null=True)
    AUDIT_TYPE = models.CharField(max_length=100,blank=True,null=True)
    PERIOD_END_DATE = models.DateField(blank=True, null=True)
    STATUS = models.CharField(max_length=50,blank=True,null=True)

    #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True, null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY = models.CharField(max_length=50,blank=True,null=True)
    
    class Meta:
        managed = True
        db_table = 'AUDIT_LIST'

class AUDIT_ACCESS(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    COMPANY_ID = models.ForeignKey(COMPANY,on_delete=models.CASCADE,blank=True,null=True)
    FILE_NAME = models.ForeignKey(AUDITLIST, on_delete=models.CASCADE,blank=True,null=True)
    email  = models.ForeignKey(User, on_delete=models.CASCADE, blank=True,null=True)
    ROLE = models.CharField(max_length=50,blank=True,null=True)

    class Meta:
        managed = True
        db_table = 'AUDIT_ACCESS'

class RequestIDCounter(models.Model):
    counter = models.IntegerField(default=1)

    class Meta:
        managed = True
        db_table = 'REQUESTID_COUNTER'
        
    
class AUDITUSERS(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    COMPANY_ID = models.ForeignKey(COMPANY, on_delete=models.DO_NOTHING, null=True)
    ROLE = models.CharField(max_length=100, null=True, blank=False)
    



class MULTIPLE_COMPANY(models.Model):
    MULTIPLE = models.BooleanField(blank=True,null=True)

    def bool(self):
        return self.MULTIPLE
    
    class Meta:
        managed = True
        db_table = 'MULTIPLE_COMPANY'

# Create your models here.
class USERROLES(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    COMPANY_ID = models.ManyToManyField(COMPANY,blank=True)
    USERNAME = models.ForeignKey(User,on_delete=models.CASCADE,blank=True, null=True)

    #LOG
    CREATED_BY =  models.CharField(max_length=150,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True, null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY =  models.CharField(max_length=150,blank=True,null=True)

    def __str__(self):
      return str(self.USERNAME.username) if self.USERNAME else ''
    
    class Meta:
        managed = True
        db_table = 'USERROLES'
    
#HR SYSTEM MODELS ARE IN THIS GROUP

class HR_RECORD(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    COMPANY_ID = models.CharField(max_length=1000,blank=True,null=True)
    USER_ID = models.CharField(max_length=50,blank=True,null=True)
    EMAIL_ADDRESS = models.CharField(max_length=50,blank=True,null=True)
    FIRST_NAME = models.CharField(max_length=50,blank=True,null=True)
    LAST_NAME = models.CharField(max_length=50,blank=True,null=True)
    JOB_TITLE = models.CharField(max_length=50,blank=True,null=True)
    DEPARTMENT = models.CharField(max_length=50,blank=True,null=True)
    MANAGER = models.CharField(max_length=50,blank=True,null=True)
    HIRE_DATE = models.DateField(null=True)
    EMP_TYPE =  models.CharField(max_length=10,blank=True,null=True)
    REHIRE_DATE = models.DateField(null=True)
    STATUS = models.CharField(max_length=50,blank=True,null=True)
    TERMINATION_DATE = models.DateField(null=True)
    
    #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True, null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY = models.CharField(max_length=50,blank=True,null=True)

    def __str__(self):
        return f"{self.FIRST_NAME} {self.LAST_NAME}"
    
    class Meta:
        managed = True
        db_table = 'HR_RECORD'

class APP_LIST(models.Model):
    #APPLICATION LIST
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    COMPANY_ID = models.ForeignKey(COMPANY,on_delete=models.CASCADE,max_length=100,blank=True,null=True)
    APP_NAME = models.CharField(max_length=100,blank=True,null=True)
    APP_DESCRIPTION = models.CharField(max_length=1000,blank=True,null=True)
    APP_TYPE = models.CharField(max_length=100,blank=True,null=True)
    HOSTED = models.CharField(max_length=50,blank=True,null=True)
    DEVTYPE = models.CharField(max_length=50,blank=True,null=True)
    DATABASE = models.CharField(max_length=50,blank=True,null=True)
    DB_VERSION = models.CharField(max_length=50,blank=True,null=True)
    OS = models.CharField(max_length=50,blank=True,null=True)
    OS_VERSION = models.CharField(max_length=50,blank=True,null=True)
    NETWORK = models.CharField(max_length=50,blank=True,null=True)
    NETWORK_VERSION = models.CharField(max_length=50,blank=True,null=True)
    RISKRATING = models.CharField(max_length=50,blank=True,null=True)
    RELEVANT_PROCESS = models.CharField(max_length=100,blank=True,null=True)
    DATE_IMPLEMENTED = models.CharField(max_length=100,blank=True,null=True)
    DATE_TERMINATED = models.DateField(null=True,blank=True)
    AUTHENTICATION_TYPE = models.CharField(max_length=50,blank=True,null=True)
    SETUP_GENINFO = models.BooleanField(blank=True, null=True)
    SETUP_USERDATA = models.BooleanField(blank=True, null=True)
    SETUP_PROCESS = models.BooleanField(blank=True, null=True)
    APPLICATION_OWNER = models.ManyToManyField(User, blank=True)
    PW_CONFIGURABLE = models.CharField(max_length=50,blank=True,null=True)
     #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True,null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY = models.CharField(max_length=50,default=False,null=True)

    def __str__(self):
        return self.APP_NAME
    
    def get_owner_name(self):
        if self.APPLICATION_OWNER:
            return f"{self.APPLICATION_OWNER.first_name} {self.APPLICATION_OWNER.last_name}"
        else:
            return "No Owner"
    
    class Meta:
        managed = True
        db_table = 'APP_LIST'

class ACCESSREQUEST(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    REQUEST_ID = models.CharField(max_length=100, null=True, blank=False)
    COMPANY_ID = models.ForeignKey(COMPANY, on_delete=models.DO_NOTHING, null=True)
    APP_NAME = models.ForeignKey(APP_LIST, on_delete=models.DO_NOTHING, null=True)
    REQUESTOR = models.TextField(null=True, blank=False)  # Changed to TextField
    ROLES = models.TextField(null=True, blank=False)  # Changed to TextField
    DATE_REQUESTED = models.DateTimeField(null=True)
    STATUS = models.CharField(max_length=100, null=True, blank=False)
    ASSIGNED_TO = models.CharField(max_length=100, null=True, blank=False)
    COMMENTS = models.CharField(max_length=1000, null=True, blank=False)
    REQUEST_TYPE = models.CharField(max_length=100, null=True, blank=False)
    PRIORITY = models.CharField(max_length=100, null=True, blank=False)
    CREATOR = models.CharField(max_length=100, null=True, blank=False)
    APPROVAL_TOKEN = models.UUIDField(default=uuid.uuid4, editable=False)
    DATE_GRANTED = models.DateTimeField(null=True)
    GRANTED_BY = models.CharField(max_length=100, null=True, blank=False)
    LAST_MODIFIED = models.DateTimeField(null=True)

    class Meta:
        managed = True
        db_table = 'ACCESS_REQUEST'


class ACCESSREQUESTAPPROVER(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    REQUEST_ID = models.ForeignKey(ACCESSREQUEST, on_delete=models.CASCADE)
    APPROVER = models.UUIDField(editable=False, blank=True, null=True)
    APPROVED_BY = models.ForeignKey(HR_RECORD, on_delete=models.DO_NOTHING, null=True, blank=True)
    DATE_APPROVED = models.DateTimeField(null=True)
    COMMENTS = models.CharField(max_length=1000, null=True, blank=False)
    DATE_REJECTED = models.DateTimeField(null=True)
    REJECTION_REASON = models.CharField(max_length=1000, null=True, blank=False)
    COMMENTS = models.CharField(max_length=1000, null=True, blank=True)

    class Meta:
        managed = True
        db_table = 'ACCESS_APPROVAL'
        
class ApprovalToken(models.Model):
    request = models.ForeignKey(ACCESSREQUEST, on_delete=models.CASCADE)
    approver = models.ForeignKey(HR_RECORD, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    def is_expired(self):
        return timezone.now() > self.expires_at


class ACCESSREQUESTCOMMENTS(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    REQUEST_ID = models.ForeignKey(ACCESSREQUEST, on_delete=models.CASCADE)
    CREATOR = models.CharField(max_length=100, null=True, blank=False)
    COMMENT_DETAILS = models.CharField(max_length=100, null=True, blank=False)
    DATE_ADDED = models.DateTimeField(null=True)

    class Meta:
            managed = True
            db_table = 'ACCESS_REQUEST_COMMENTS'

class APP_USERS(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    USER_ID = models.CharField(max_length=100,blank=True,null=True)
    FIRST_NAME = models.CharField(max_length=100,blank=True,null=True)
    LAST_NAME = models.CharField(max_length=100,blank=True,null=True)
    EMAIL_ADDRESS = models.CharField(max_length=100,blank=True,null=True)
    STATUS = models.CharField(max_length=100,blank=True,null=True)
    LOCKED = models.CharField(max_length=100,blank=True,null=True)



class APP_OWNERS(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    APPLICATION_OWNER = models.ForeignKey(User,on_delete=models.DO_NOTHING,blank=True,null=True)
    APP_NAME = models.ForeignKey(APP_LIST,on_delete=models.CASCADE,blank=True,null=True)
    class Meta:
        managed = True
        db_table = 'APP_OWNERS'

def workpaper_upload_to(instance, filename):
    audit_id = instance.audit_id
    return f'workpapers/{audit_id}/{filename}'

class CONTROLLIST(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    CONTROL_ID =  models.CharField(max_length=256,blank=True,null=True)
    CONTROL_TITLE = models.CharField(max_length=256,blank=True,null=True)
    CONTROL_TYPE = models.CharField(max_length=256,blank=True,null=True)
    CONTROL_DOMAIN = models.CharField(max_length=256,blank=True,null=True)
    CONTROL_CATEGORY = models.CharField(max_length=256,blank=True,null=True)
    CONTROL_DESCRIPTION = models.CharField(max_length=256,blank=True,null=True)

    def __str__(self):
        return self.CONTROL_TITLE
    
    class Meta:
        managed = True
        db_table = 'CONTROLLIST'

class AUDITFILE(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    COMPANY_ID = models.ForeignKey(COMPANY, on_delete=models.CASCADE, null=True)
    APP_NAME = models.ForeignKey(APP_LIST, on_delete=models.CASCADE, null=True)
    CONTROL_ID = models.ForeignKey(CONTROLLIST, on_delete=models.DO_NOTHING, null=True)
    TITLE = models.CharField(max_length=100,blank=True,null=True)
    TYPE = models.CharField(max_length=100,blank=True,null=True)
    FOLDER = models.CharField(max_length=100,blank=True,null=True)
    STATUS = models.CharField(max_length=100,blank=True,null=True)
    CURRENTLY_WITH = models.CharField(max_length=100,blank=True,null=True)
    PREPARER = models.ManyToManyField(User, blank=True, related_name="Preparer")
    REVIEWER = models.ManyToManyField(User, blank=True, related_name="Reviewer")
    #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True, null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY = models.CharField(max_length=50,blank=True,null=True)
    workpaper_upload = models.ForeignKey('WORKPAPER_UPLOAD', on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        managed = True
        db_table = 'AUDITFILE'

class PREPARERSIGNOFF(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    FILE_NAME = models.ForeignKey(AUDITFILE, on_delete=models.CASCADE, null= True, blank = True)
    PREPARER = models.CharField(max_length=100,blank=True,null=True)
    DATE_SIGNEDOFF = models.DateTimeField(null=True)

    #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True, null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY = models.CharField(max_length=50,blank=True,null=True)
    
    class Meta:
        managed = True
        db_table = 'PREPARERSIGNOFF'


class REVIEWSIGNOFF(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    FILE_NAME = models.ForeignKey(AUDITFILE, on_delete=models.CASCADE, null= True, blank = True)
    REVIEWER = models.CharField(max_length=100,blank=True,null=True)
    DATE_SIGNEDOFF = models.DateTimeField(null=True)

    #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True, null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY = models.CharField(max_length=50,blank=True,null=True)
    
    class Meta:
        managed = True
        db_table = 'REVIEWSIGNOFF'


class AUDITNOTES(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    FILE_NAME = models.ForeignKey(AUDITFILE, on_delete=models.CASCADE, null= True, blank = True)
    STATUS = models.CharField(max_length=100,blank=True,null=True)
    TYPE = models.CharField(max_length=100,blank=True,null=True)

    #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True, null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY = models.CharField(max_length=50,blank=True,null=True)
    
    class Meta:
        managed = True
        db_table = 'AUDITNOTES'

class AUDITNOTESREPLY(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    FILE_NAME = models.ForeignKey(AUDITFILE, on_delete=models.CASCADE, null= True, blank = True)
    OG_NOTE = models.ForeignKey(AUDITNOTES, on_delete= models.CASCADE, null=True, blank=True)
    STATUS = models.CharField(max_length=100,blank=True,null=True)
    TYPE = models.CharField(max_length=100,blank=True,null=True)
    CREATED_BY = models.CharField(max_length=100,blank=True,null=True)

    #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True, null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY = models.CharField(max_length=50,blank=True,null=True)
    
    class Meta:
        managed = True
        db_table = 'AUDITNOTESREPLY'

class WORKPAPER_UPLOAD(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file_name = models.FileField(upload_to=workpaper_upload_to)
    upload_date = models.DateTimeField(auto_now_add=True)
    activated = models.BooleanField(default=False)
    audit_id = models.UUIDField(null=True, blank=False)
   
    def __str__(self):
        return f"File id: {self.id}"



class TEST_PROCEDURES(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    CONTROL_ID = models.ForeignKey(CONTROLLIST, on_delete=models.DO_NOTHING, null=True, blank=True)
    PROCEDURE_DETAILS = models.TextField(blank=True,null=True)
    DESIGN_PROCEDURES = models.TextField(blank=True,null=True)
    INTERIM_PROCEDURES = models.TextField(blank=True,null=True)
    ROLLFORWARD_PROCEDURES = models.TextField(blank=True,null=True)
    FINAL_PROCEDURES = models.TextField(blank=True,null=True)
    DEFAULT = models.BooleanField(default=False,null=True)

    class Meta:
        managed = True
        db_table = 'TEST_PROCEDURE'

class WORKPAPER_DETAILS(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    CONTROL_ID =  models.ForeignKey(CONTROLLIST,on_delete=models.CASCADE,null=True,blank=True)
    COMPANY_ID = models.ForeignKey(COMPANY,on_delete=models.CASCADE,null=True,blank=True)
    APP_NAME = models.ForeignKey(APP_LIST,on_delete=models.CASCADE,blank=True,null=True)

    #DESIGN
    DESIGN_PROCEDURES =  models.TextField(null=True,blank=True)
    DESIGN_RESULT =  models.TextField(null=True,blank=True)
    DESIGN_EVIDENCE =  models.TextField(null=True,blank=True)
    DESIGN_CONCLUSION =  models.CharField(max_length=25,blank=True,null=True)
    DESIGN_CONCLUSION_RATIONALE =  models.TextField(null=True,blank=True)

    #INTERIM
    INTERIM_APPLICABLE = models.CharField(max_length=25,blank=True,null=True)
    INTERIM_POPULATION = models.CharField(max_length=25,blank=True,null=True)
    INTERIM_POPULATION_RATIONALE = models.CharField(max_length=1000,blank=True,null=True)
    INTERIM_SAMPLES = models.CharField(max_length=25,blank=True,null=True)
    INTERIM_SAMPLING_RATIONALE = models.CharField(max_length=1000,blank=True,null=True)
    INTERIM_PROCEDURES = models.TextField(null=True,blank=True)
    INTERIM_RESULT = models.TextField(null=True,blank=True)
    INTERIM_EVIDENCE = models.TextField(null=True,blank=True)
    INTERIM_CONCLUSION = models.CharField(max_length=25,blank=True,null=True)
    INTERIM_CONCLUSION_RATIONALE =  models.TextField(null=True,blank=True)

    #ROLLFORWARD
    RF_APPLICABLE= models.CharField(max_length=25,blank=True,null=True)
    RF_POPULATION = models.CharField(max_length=25,blank=True,null=True)
    RF_POPULATION_RATIONALE = models.CharField(max_length=1000,blank=True,null=True)
    RF_SAMPLES = models.CharField(max_length=25,blank=True,null=True)
    RF_SAMPLING_RATIONALE = models.CharField(max_length=1000,blank=True,null=True)
    RF_PROCEDURES = models.TextField(null=True,blank=True)
    RF_RESULT = models.TextField(null=True,blank=True)
    RF_EVIDENCE = models.TextField(null=True,blank=True)
    RF_CONCLUSION = models.CharField(max_length=25,blank=True,null=True)
    RF_CONCLUSION_RATIONALE =  models.TextField(null=True,blank=True)

    #FINAL
    FINAL_APPLICABLE = models.CharField(max_length=25,blank=True,null=True)
    FINAL_POPULATION = models.CharField(max_length=25,blank=True,null=True)
    FINAL_POPULATION_RATIONALE = models.CharField(max_length=1000,blank=True,null=True)
    FINAL_SAMPLES = models.CharField(max_length=25,blank=True,null=True)
    FINAL_SAMPLING_RATIONALE = models.CharField(max_length=1000,blank=True,null=True)
    FINAL_PROCEDURES = models.TextField(null=True,blank=True)
    FINAL_RESULT = models.TextField(null=True,blank=True)
    FINAL_EVIDENCE = models.TextField(null=True,blank=True)
    FINAL_CONCLUSION = models.CharField(max_length=25,blank=True,null=True)
    FINAL_CONCLUSION_RATIONALE =  models.TextField(null=True,blank=True)
    

    class Meta:
        managed = True
        db_table = 'WORKPAPER_DETAILS'


class DESIGN_TESTING(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    CONTROL_ID =  models.ForeignKey(CONTROLLIST,on_delete=models.CASCADE,null=True,blank=True)
    COMPANY_ID = models.ForeignKey(COMPANY,on_delete=models.CASCADE,null=True,blank=True)
    APP_NAME = models.ForeignKey(APP_LIST,on_delete=models.CASCADE,blank=True,null=True)
    CONTROL_TYPE = models.CharField(max_length=25,blank=True,null=True)
    CONTROL_RATING = models.CharField(max_length=10,blank=True,null=True)
    CONTROL_RATING_RATIONALE = models.CharField(max_length=500,blank=True,null=True)
    CONTROL_TEST_PROCEDURE = models.TextField(null=True,blank=True)
    CONTROL_TEST_RESULT = models.TextField(null=True,blank=True)
    CONTROL_CONCLUSION = models.CharField(max_length=25,blank=True,null=True)
    CONTROL_CONCLUSION_RATIONALE = models.TextField(null=True,blank=True)

    #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True,null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY = models.CharField(max_length=50,default=False,null=True)

    class Meta:
        managed = True
        db_table = 'DESIGN_TESTING'

class OE_TESTING(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    CONTROL_ID =  models.ForeignKey(CONTROLLIST,on_delete=models.CASCADE,null=True,blank=True)
    COMPANY_ID = models.ForeignKey(COMPANY,on_delete=models.CASCADE,null=True,blank=True)
    APP_NAME = models.ForeignKey(APP_LIST,on_delete=models.CASCADE,blank=True,null=True)
    CONTROL_TYPE = models.CharField(max_length=25,blank=True,null=True)
    CONTROL_RATING = models.CharField(max_length=10,blank=True,null=True)
    CONTROL_RATING_RATIONALE = models.CharField(max_length=500,blank=True,null=True)
    CONTROL_TEST_PROCEDURE = models.TextField(null=True,blank=True)
    CONTROL_TEST_RESULT = models.TextField(null=True,blank=True)
    CONTROL_CONCLUSION = models.CharField(max_length=25,blank=True,null=True)
    CONTROL_CONCLUSION_RATIONALE = models.TextField(null=True,blank=True)
    PERIOD_START_DATE = models.DateField(null=True, blank=True)
    PERIOD_END_DATE = models.DateField(null=True, blank=True)
    CONTROL_FREQUENCY = models.CharField(max_length=25,blank=True,null=True)
    CONTROL_POPULATION = models.CharField(max_length=25,blank=True,null=True)
    CONTROL_SAMPLES = models.CharField(max_length=25,blank=True,null=True)

    #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True,null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY = models.CharField(max_length=50,default=False,null=True)

    class Meta:
        managed = True
        db_table = 'OE_TESTING'

class ALPHAREGISTRATION(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    FIRST_NAME = models.CharField(max_length=25,blank=True,null=True)
    LAST_NAME = models.CharField(max_length=25,blank=True,null=True)
    COMPANY = models.CharField(max_length=25,blank=True,null=True)
    EMAIL = models.CharField(max_length=25,blank=True,null=True)
    MESSAGE = models.CharField(max_length=25,blank=True,null=True)
    DATE_REGISTERED =models.DateField(null=True,blank=True)

    class Meta:
        managed = True
        db_table = 'ALPHA_REG'


class RF_TESTING(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    CONTROL_ID =  models.ForeignKey(CONTROLLIST,on_delete=models.CASCADE,null=True,blank=True)
    COMPANY_ID = models.ForeignKey(COMPANY,on_delete=models.CASCADE,null=True,blank=True)
    APP_NAME = models.ForeignKey(APP_LIST,on_delete=models.CASCADE,blank=True,null=True)
    CONTROL_TYPE = models.CharField(max_length=25,blank=True,null=True)
    CONTROL_RATING = models.CharField(max_length=10,blank=True,null=True)
    CONTROL_RATING_RATIONALE = models.CharField(max_length=500,blank=True,null=True)
    CONTROL_TEST_PROCEDURE = models.TextField(null=True,blank=True)
    CONTROL_TEST_RESULT = models.TextField(null=True,blank=True)
    CONTROL_CONCLUSION = models.CharField(max_length=25,blank=True,null=True)
    CONTROL_CONCLUSION_RATIONALE = models.TextField(null=True,blank=True)
    PERIOD_START_DATE = models.DateField(null=True, blank=True)
    PERIOD_END_DATE = models.DateField(null=True, blank=True)
    CONTROL_FREQUENCY = models.CharField(max_length=25,blank=True,null=True)
    CONTROL_POPULATION = models.CharField(max_length=25,blank=True,null=True)
    CONTROL_SAMPLES = models.CharField(max_length=25,blank=True,null=True)

    #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True,null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY = models.CharField(max_length=50,default=False,null=True)

    class Meta:
        managed = True
        db_table = 'RF_TESTING'

def design_evidence_folder(instance, filename):
    control_id = instance.CONTROL_ID_id
    app_id = instance.APP_NAME_id
    return f'workpapers/{app_id}/{control_id}/design/{filename}'


class DESIGN_EVIDENCE(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    CONTROL_ID =  models.ForeignKey(CONTROLLIST,on_delete=models.CASCADE,null=True,blank=True)
    COMPANY_ID = models.ForeignKey(COMPANY,on_delete=models.CASCADE,null=True,blank=True)
    APP_NAME = models.ForeignKey(APP_LIST,on_delete=models.CASCADE,blank=True,null=True)
    file_name = models.FileField(upload_to=design_evidence_folder, max_length=256)

    class Meta:
        managed = True
        db_table = 'DESIGN_EVIDENCE'


def oe_evidence_folder(instance, filename):
    control_id = instance.CONTROL_ID_id
    app_id = instance.APP_NAME_id
    return f'workpapers/{app_id}/{control_id}/oe/{filename}'

class OE_EVIDENCE(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    CONTROL_ID =  models.ForeignKey(CONTROLLIST,on_delete=models.CASCADE,null=True,blank=True)
    COMPANY_ID = models.ForeignKey(COMPANY,on_delete=models.CASCADE,null=True,blank=True)
    APP_NAME = models.ForeignKey(APP_LIST,on_delete=models.CASCADE,blank=True,null=True)
    file_name = models.FileField(upload_to=oe_evidence_folder, max_length=256)

    class Meta:
        managed = True
        db_table = 'OE_EVIDENCE'

def rf_evidence_folder(instance, filename):
    control_id = instance.CONTROL_ID_id
    app_id = instance.APP_NAME_id
    return f'workpapers/{app_id}/{control_id}/rf/{filename}'

class RF_EVIDENCE(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    CONTROL_ID =  models.ForeignKey(CONTROLLIST,on_delete=models.CASCADE,null=True,blank=True)
    COMPANY_ID = models.ForeignKey(COMPANY,on_delete=models.CASCADE,null=True,blank=True)
    APP_NAME = models.ForeignKey(APP_LIST,on_delete=models.CASCADE,blank=True,null=True)
    file_name = models.FileField(upload_to=oe_evidence_folder, max_length=256)

    class Meta:
        managed = True
        db_table = 'RF_EVIDENCE'

class RISKLIST(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    COMPANY_ID = models.ForeignKey(COMPANY,on_delete=models.CASCADE,null=True,blank=True)
    RISK_ID =  models.CharField(max_length=100,blank=True,null=True)
    RISK_NAME =  models.CharField(max_length=100,blank=True,null=True)
    RISK_TYPE = models.CharField(max_length=100,blank=True,null=True)
    RISK_DESCRIPTION = models.CharField(max_length=1000,blank=True,null=True)
    REQUIRED =  models.CharField(max_length=10,blank=True,null=True)

    def __str__(self):
        return f"{self.RISK_NAME}"  
    
    class Meta:
        managed = True
        db_table = 'RISKLIST'

class RISKGENERAL(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    APP_NAME = models.ForeignKey(APP_LIST,on_delete=models.CASCADE,blank=True,null=True)
    RISK_NAME = models.CharField(max_length=256,blank=True,null=True)
    RISK_RATIONALE = models.CharField(max_length=1000,blank=True,null=True)
    RISK_TYPE = models.CharField(max_length=256,blank=True,null=True)

    class Meta:
        managed = True
        db_table = 'RISKGENERAL'

class RISKMAPPING(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    COMPANY_ID = models.ForeignKey(COMPANY,on_delete=models.CASCADE,null=True,blank=True)
    CONTROL_ID = models.ManyToManyField(CONTROLLIST, blank = True)
    RISK_ID = models.ForeignKey(RISKLIST,on_delete=models.CASCADE,null=True,blank=True)
    APP_NAME = models.ForeignKey(APP_LIST,on_delete=models.CASCADE,null=True,blank=True)
    RATING = models.CharField(max_length=50,null=True,blank=True)
    RATING_RATIONALE = models.CharField(max_length=1000,null=True,blank=True)

    def __str__(self):
        return f"{self.RISK_ID}"  

    class Meta:
        managed = True
        db_table = 'RISKCONTROLMATRIX'

class RISKDETAILS(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    APP_NAME = models.ForeignKey(APP_LIST,on_delete=models.CASCADE,blank=True,null=True)
    RISK_NAME = models.ForeignKey(RISKGENERAL,on_delete=models.CASCADE,blank=True,null=True)
    RISK_DESCRIPTION = models.CharField(max_length=1000,null=True,blank=True)
    RISK_STATUS = models.CharField(max_length=256,null=True,blank=True)
    RISK_AREA = models.CharField(max_length=256,null=True,blank=True)
    RISK_RATING = models.CharField(max_length=256,null=True,blank=True)
    RISK_RATIONALE = models.CharField(max_length=256,null=True,blank=True)

    class Meta:
        managed = True
        db_table = 'RISKDETAILS'
        
class CONTROLS(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    APP_NAME = models.ForeignKey(APP_LIST,on_delete=models.CASCADE,blank=True,null=True)
    RISK_NAME = models.ForeignKey(RISKDETAILS,on_delete=models.CASCADE,blank=True,null=True)
    CONTROL_NAME = models.CharField(max_length=256,blank=True,null=True)
    CONTROL_DESCRIPTION = models.CharField(max_length=1000,blank=True,null=True)
    CONTROL_TYPE = models.CharField(max_length=256,null=True,blank=True)

    #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True,null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY = models.CharField(max_length=50,blank=True,null=True)

    def __str__(self):
            return self.CONTROL_NAME
    
    class Meta:
        managed = True
        db_table = 'CONTROLS'

class APP_USER_SFTP(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    APP_NAME = models.ForeignKey(APP_LIST, on_delete=models.CASCADE,max_length=100,null=True,blank=True)
    HOST_NAME = models.CharField(max_length=1000,blank=True,null=True)
    SFTP_USERNAME = models.CharField(max_length=128,blank=True)
    SFTP_PW_HASHED = models.CharField(max_length=128,blank=True,null=True)
    def set_password(self,raw_password):
            self.SFTP_PW_HASHED = make_password(raw_password)
    def check_password(self,raw_password):
            return check_password(raw_password,self.SFTP_PW_HASHED)
    SFTP_DIRECTORY = models.CharField(max_length=1000,blank=True,null=True)
    SFTP_DESTINATION = models.CharField(max_length=1000,blank=True,null=True)
    SETUP_COMPLETE = models.BooleanField(default=False)

    #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True,null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY = models.CharField(max_length=50,blank=True,null=True)

    class Meta:
        managed = True
        db_table = 'SFTP_USER'

class APP_JOB_PULL(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    APP_NAME = models.ForeignKey(APP_LIST, on_delete=models.CASCADE,max_length=100,blank=True)
    JOB_NAME = models.CharField(max_length=1000,blank=True,null=True)
    MONDAY = models.BooleanField(default=False,null=True)
    TUESDAY = models.BooleanField(default=False,null=True)
    WEDNESDAY = models.BooleanField(default=False,null=True)
    THURSDAY = models.BooleanField(default=False,null=True)
    FRIDAY = models.BooleanField(default=False,null=True)
    SATURDAY = models.BooleanField(default=False,null=True)
    SUNDAY = models.BooleanField(default=False,null=True)
    SCHEDULE_TIME = models.TimeField(null=True,blank=True)
    #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True,null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY = models.CharField(max_length=50,blank=True,null=True)

    class Meta:
        managed = True
        db_table = 'USER_JOB_SCHEDULE'

class APP_JOB_USER_LOG(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    APP_NAME = models.ForeignKey(APP_LIST, on_delete=models.CASCADE,max_length=100,blank=True,null=True)
    JOB_NAME = models.CharField(max_length=1000,null=True,blank=True)
    JOB_FILE_NAME = models.CharField(max_length=1000,null=True,blank=True)
    JOB_FILE_DESTINATION = models.CharField(max_length=1000,null=True,blank=True)
    JOB_DATE = models.DateField(null=True,blank=False)
    JOB_COMPLETE = models.BooleanField(default=False,null=True)
    JOB_ERROR = models.CharField(max_length=1000,null=True,blank=True)
    SOURCE_LINE_COUNT =  models.CharField(max_length=100,null=True,blank=True)
    CREATED_COUNT = models.CharField(max_length=100,null=True,blank=True)
    UPLOADED_BY = models.CharField(max_length=100,null=True,blank=True)

    class Meta:
        managed = True
        db_table = 'APP_JOB_USER_LOG'

class APP_JOB_USER_LOG_PROCESS(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    APP_NAME = models.ForeignKey(APP_LIST, on_delete=models.CASCADE,max_length=100,blank=True,null=True)
    USER_ID = models.CharField(max_length=128, null=True, blank=True)
    JOB_DATE = models.DateTimeField(null=True,blank=False)
    JOB_FILE_DESTINATION = models.CharField(max_length=1000,null=True,blank=True)
    JOB_ERROR = models.CharField(max_length=1000,null=True,blank=True)
    JOB_COMPLETE = models.BooleanField(default=False,null=True)

    class Meta:
        managed = True
        db_table = 'APP_JOB_USER_LOG_PROCESS'


class HR_LIST_SFTP(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    COMPANY_ID = models.ForeignKey(COMPANY,on_delete=models.CASCADE,blank=True,null=True)
    HOST_NAME = models.CharField(max_length=1000,blank=True,null=True)
    SFTP_USERNAME = models.CharField(max_length=128,blank=True)
    SFTP_PW_HASHED = models.CharField(max_length=128,blank=True,null=True)
    def set_password(self,raw_password):
            self.SFTP_PW_HASHED = make_password(raw_password)
    def check_password(self,raw_password):
            return check_password(raw_password,self.SFTP_PW_HASHED)
    SFTP_DIRECTORY = models.CharField(max_length=1000,blank=True,null=True)
    SFTP_DESTINATION = models.CharField(max_length=1000,blank=True,null=True)
    SETUP_COMPLETE = models.BooleanField(default=False)
    AUTH_KEY = models.CharField(max_length=1000,blank=True,null=True)

    #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True,null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY = models.CharField(max_length=50,blank=True,null=True)

    class Meta:
        managed = True
        db_table = 'SFTP_HR'

class HR_JOB_PULL(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    COMPANY_ID = models.ForeignKey(COMPANY,on_delete=models.CASCADE,blank=True,null=True)
    JOB_NAME = models.CharField(max_length=1000,blank=True,null=True)
    MONDAY = models.BooleanField(default=False)
    TUESDAY = models.BooleanField(default=False)
    WEDNESDAY = models.BooleanField(default=False)
    THURSDAY = models.BooleanField(default=False)
    FRIDAY = models.BooleanField(default=False)
    SATURDAY = models.BooleanField(default=False)
    SUNDAY = models.BooleanField(default=False)
    SCHEDULE_TIME = models.DateTimeField(null=True, blank=True)  # Changed to DateTimeField

     #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True,null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY = models.CharField(max_length=50,blank=True,null=True)

    class Meta:
        managed = True
        db_table = 'HR_JOB_SCHEDULE'

class HR_JOB_USER_LOG(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    JOB_NAME = models.ForeignKey(APP_JOB_PULL,on_delete=models.DO_NOTHING,blank=True)
    JOB_DATE = models.DateTimeField
    JOB_COMPLETE = models.BooleanField(default=False)

    class Meta:
        managed = True
        db_table = 'HR_JOB_USER_LOG'
        

class HR_RECORD_IMPORT_LOG(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    JOB_NAME = models.CharField(max_length=50,blank=True,null=True)
    IMPORT_DATE = models.DateTimeField()
    FILE_NAME = models.CharField(max_length=50,blank=True,null=True)
    SOURCE_LINE_COUNT = models.CharField(max_length=50,blank=True,null=True)
    DESTI_LINE_COUNT = models.CharField(max_length=50,blank=True,null=True)
    JOB_COMPLETE = models.BooleanField(default=False)
    UPLOADED_BY = models.CharField(max_length=50,blank=True,null=True)
    JOB_ERROR = models.CharField(max_length=1000,null=True,blank=True)

    class Meta:
        managed = True
        db_table = 'HR_IMPORT_LOG'


class APP_RECORD(models.Model):
    #GENERAL USER INFORMATION
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    APP_NAME = models.ForeignKey(APP_LIST,on_delete=models.CASCADE,max_length=100,blank=True,null=True)
    APP_TYPE = models.CharField(max_length=50,blank=True,null=True)
    USER_ID =  models.CharField(max_length=50,blank=True,null=True)
    EMAIL_ADDRESS = models.CharField(max_length=50,blank=True,null=True)
    FIRST_NAME = models.CharField(max_length=50,blank=True,null=True)
    LAST_NAME = models.CharField(max_length=50,blank=True,null=True)
    ROLE_NAME = models.CharField(max_length=100,blank=True,null=True)
    STATUS = models.CharField(max_length=50,blank=True,null=True)
    TYPE = models.CharField(max_length=50,blank=True,null=True) #USER_ACCOUNT, SYSTEM_ACCOUNT, OTHER
    OWNER_IF_SYSTEM = models.CharField(max_length=50,blank=True,null=True) 
    OWNER_IF_REGULAR = models.CharField(max_length=50,blank=True,null=True) 
    IS_ADMIN = models.CharField(max_length=50,blank=True,null=True)

    #PROVISIONING
    DATE_GRANTED = models.DateField(null=True)
    DATE_APPROVED = models.DateField(null=True)
    ACCESS_APPROVER_NAME1 = models.ForeignKey(HR_RECORD,on_delete=models.DO_NOTHING,max_length=100,blank=True,null=True, related_name='access_approver_name1')
    ACCESS_APPROVER_TITLE1 = models.ForeignKey(HR_RECORD,on_delete=models.DO_NOTHING,max_length=100,blank=True,null=True, related_name='access_approver_title1')
    ACCESS_APPROVER_NAME2 = models.ForeignKey(HR_RECORD,on_delete=models.DO_NOTHING,max_length=100,blank=True,null=True, related_name='access_approver_name2')
    ACCESS_APPROVER_TITLE2 = models.ForeignKey(HR_RECORD,on_delete=models.DO_NOTHING,max_length=100,blank=True,null=True,related_name='access_approver_title2')
    APPROVAL_TYPE = models.CharField(max_length=100,blank=True,null=True) #TICKET, EMAIL, OR OTHER
    APPROVAL_REFERENCE = models.CharField(max_length=100,blank=True,null=True)
    APPROVAL_SUPPORT = models.CharField(max_length=1000,blank=True,null=True)

    #TERMINATION
    DATE_REVOKED = models.DateField(null=True)
    LAST_LOGIN = models.DateField(null=True)
    HR_NOTIFICATION_DATE = models.DateTimeField(null=True)
    NOTIFICATION_TYPE = models.CharField(max_length=100,blank=True,null=True) #TICKET, EMAIL, OR OTHER
    NOTIFICATION_SUPPORT = models.CharField(max_length=100,blank=True,null=True) #LINK

    #USER ACCESS REVIEW
    DATE_LAST_CERTIFIED = models.DateTimeField(null=True)
    CERTIFIED_BY = models.CharField(max_length=50,blank=True,null=True)
    TAGGED_INAPPROPRITE = models.CharField(max_length=50,blank=True,null=True)
    DATE_TAGGED_INAPPROPRIATE = models.DateTimeField(null=True)

    #MAPPING TO HR
    MAPPED_TO_HR = models.CharField(max_length=50,blank=True,null=True)
    MAPPED_HR_FNAME = models.CharField(max_length=50,blank=True,null=True)
    MAPPED_HR_LNAME = models.CharField(max_length=50,blank=True,null=True)
    MAPPED_HR_EMAIL = models.CharField(max_length=50,blank=True,null=True)
    MAPPED_USING = models.CharField(max_length=100,blank=True,null=True)

    #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True,null=True,blank=True)
    LAST_MODIFIED = models.DateField(auto_now_add=True) 
    MODIFIED_BY = models.CharField(max_length=50,blank=True,null=True)

    def __str__(self):
        return f"{self.APP_NAME} - {self.USER_ID}" 
    
    def approval_duration(self):
        if self.DATE_APPROVED and self.DATE_GRANTED:
            duration = self.DATE_APPROVED - self.DATE_GRANTED
            return duration.days
        return None
    
    class Meta:
        managed = True
        db_table = 'APP_RECORD'

class CSV_UPLOAD_FIELDS(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    APP_NAME = models.ForeignKey(APP_LIST,on_delete=models.CASCADE,max_length=100,blank=True,null=True)
    FIELD_NAME = models.CharField(max_length=128,blank=True,null=True)
    DATE = models.DateTimeField(null=True, blank=True)

     #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True,null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY = models.CharField(max_length=50,blank=True,null=True)

    class Meta:
        managed = True
        db_table = 'CSV_UPLOAD_FIELDS'

class CSV_MAPPING_TABLE(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    APP_NAME = models.ForeignKey(APP_LIST,on_delete=models.CASCADE,max_length=100,blank=True,null=True)
    USER_ID = models.CharField(max_length=128,blank=True,null=True)
    EMAIL = models.CharField(max_length=128,blank=True,null=True)
    FIRST_NAME = models.CharField(max_length=128,blank=True,null=True)
    LAST_NAME = models.CharField(max_length=128,blank=True,null=True)
    ROLE = models.CharField(max_length=128,blank=True,null=True)
    STATUS = models.CharField(max_length=128,blank=True,null=True)
    DATE_GRANTED = models.CharField(max_length=128,blank=True,null=True)
    DATE_REVOKED = models.CharField(max_length=128,blank=True,null=True)
    LAST_LOGIN = models.CharField(max_length=128,blank=True,null=True)
    FILE_NAME = models.CharField(max_length=100, null=True, blank=False)
    FILE = models.FileField(upload_to='uploads/')
     #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True,null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY = models.CharField(max_length=50,blank=True,null=True)

    class Meta:
        managed = True
        db_table = 'CSV_MAPPING_TABLE'


class ADMIN_ROLES_FILTER(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    APP_NAME = models.ForeignKey(APP_LIST,on_delete=models.CASCADE,max_length=100,blank=True,null=True)
    ROLE_NAME = models.CharField(max_length=50,blank=True,null=True)
    SETUP_COMPLETE = models.BooleanField(default=False,null=True)

    #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True,null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY = models.CharField(max_length=50,blank=True,null=True)

    class Meta:
        managed = True
        db_table = 'ADMIN_ROLE_FILTER'


class SYSTEM_ACCOUNTS(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    APP_NAME = models.ForeignKey(APP_LIST,on_delete=models.CASCADE,max_length=100,blank=True,null=True)
    USER_ID = models.ForeignKey(APP_RECORD,on_delete=models.CASCADE,max_length=100, blank=True,null=True)
    IS_SYSTEM_ACCOUNT = models.BooleanField(blank=True, null=True)

    #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True,null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY = models.CharField(max_length=50,blank=True,null=True)

class INTEGRATION_ACCOUNTS(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    APP_NAME = models.ForeignKey(APP_LIST,on_delete=models.CASCADE,max_length=100,blank=True,null=True)
    USER_ID = models.ForeignKey(APP_RECORD,on_delete=models.CASCADE,max_length=100, blank=True,null=True)
    IS_INTEGRATION_ACCOUNT = models.BooleanField(blank=True, null=True)

    #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True,null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY = models.CharField(max_length=50,blank=True,null=True)

class APP_USER_UPLOAD(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file_name = models.FileField(upload_to='app_users/')
    APP_NAME = models.ForeignKey(APP_RECORD,on_delete=models.CASCADE,max_length=100,blank=True,null=True)
    activated = models.BooleanField(default=False)
    #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True,null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY = models.CharField(max_length=50,blank=True,null=True)

    def __str__(self):
        return f"{self.file_name}"  
    
    class Meta:
        managed = True
        db_table = 'USER_UPLOAD_ATTACHMENTS'

class APP_NEW_USER_APPROVAL(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file_name = models.FileField(upload_to='new_users_approval/')
    USER_ID = models.ForeignKey(APP_RECORD,on_delete=models.CASCADE,max_length=100,blank=True,null=True)
    activated = models.BooleanField(default=False)
    #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True,null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY = models.CharField(max_length=50,blank=True,null=True)

    def __str__(self):
        return f"{self.file_name}"  
    
    class Meta:
        managed = True
        db_table = 'NEW_USER_APPROVAL'

class HR_MANUAL_UPLOAD(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file_name = models.FileField(upload_to='manualhrcvs')
    upload_date = models.DateTimeField(auto_now_add=True)

        
class CSV(models.Model):
    file_name = models.FileField(upload_to='csvs')
    upload_date = models.DateTimeField(auto_now_add=True)
    activated = models.BooleanField(default=False)

    def __str__(self):
        return f"File id: {self.id}"

    
class PWCONFIGATTACHMENTS(models.Model):
    APP_NAME = models.ForeignKey(APP_LIST,on_delete=models.CASCADE,null=True)
    file_name = models.FileField(upload_to='pwconfigs/',null=True)
    upload_date = models.DateTimeField(auto_now_add=True)
    activated = models.BooleanField(default=False)

    def __str__(self):
        return f"File id: {self.id}"
    
    
class POLICIES(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    POLICY_NAME = models.CharField(max_length=50,blank=True,null=True)
    POLICY_DESCRIPTION = models.CharField(max_length=1000,blank=True,null=True)
    CONTROL_ID = models.ManyToManyField(CONTROLS)
    LAST_UPDATED = models.DateField(null=True)
  
    #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True,null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY = models.CharField(max_length=50,blank=True,null=True)

    def __str__(self):
            return self.POLICY_NAME
    
    class Meta:
        managed = True
        db_table = 'POLICIES'


#THIS IS THE CORPORATE POLICY
class PASSWORDPOLICY(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    COMPANY_ID = models.ManyToManyField(COMPANY,blank=True)
    COMPLEXITY_ENABLED = models.BooleanField(default=False) 
    LENGTH = models.IntegerField(blank=True, null=True)
    UPPER = models.BooleanField(default=False) 
    LOWER = models.BooleanField(default=False) 
    NUMBER = models.BooleanField(default=False) 
    SPECIAL_CHAR = models.BooleanField(default=False)  
    AGE = models.IntegerField(blank=True, null=True)
    HISTORY = models.IntegerField(blank=True, null=True)
    LOCKOUT_ATTEMPT = models.IntegerField(blank=True, null=True)
    LOCKOUT_DURATION = models.CharField(max_length=50, blank=True, null=True)
    MFA_ENABLED = models.BooleanField(default=False) 
    #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True,null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY = models.CharField(max_length=50,blank=True,null=True) 

def __str__(self):
    return str(self.id)

class Meta:
        managed = True
        db_table = 'PASSWORDPOLICY'

class PROVISIONING_PROCESS(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    APP_NAME = models.ForeignKey(APP_LIST, on_delete=models.CASCADE, null=True, blank=True)
    FORM = models.CharField(max_length=100,blank=True,null=True)
    APPROVERS = models.CharField(max_length=100,blank=True,null=True)
    APPROVERS_OTHER = models.CharField(max_length=500,blank=True,null=True)
    GRANTOR = models.CharField(max_length=100,blank=True,null=True)
    GRANTOR_OTHER = models.CharField(max_length=500,blank=True,null=True)
    PROCESS_DIFFERENCE = models.CharField(max_length=100,blank=True,null=True)
    PROCESS_DIFFERENCE_OTHER = models.CharField(max_length=500,blank=True,null=True)
    LAST_CERTIFIED = models.DateField(null=True)
    CERTIFIED_BY = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'PROVISIONING_PROCESS'

class TERMINATION_PROCESS(models.Model):

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    APP_NAME = models.ForeignKey(APP_LIST, on_delete=models.CASCADE, null=True, blank=True)
    NETWORK_RELIANCE = models.CharField(max_length=100,blank=True,null=True)
    TIMELINESS = models.CharField(max_length=100,blank=True,null=True)
    TERM_DOCUMENTATION = models.CharField(max_length=100,blank=True,null=True)
    TERM_DOCUMENTATION_OTHER = models.CharField(max_length=500,blank=True,null=True)
    TERM_NOTIFYER = models.CharField(max_length=50,blank=True,null=True)
    TERM_PROCESS = models.CharField(max_length=100,blank=True,null=True)
    TERM_AUTOMATED_DESC = models.CharField(max_length=500,blank=True,null=True)
    DISABLE_TYPE =  models.CharField(max_length=500,blank=True,null=True)
    DISABLE_TYPE_OTHER =  models.CharField(max_length=500,blank=True,null=True)
    PROCESS_DIFFERENCE = models.CharField(max_length=100,blank=True,null=True)
    PROCESS_DIFFERENCE_OTHER = models.CharField(max_length=500,blank=True,null=True)
    LAST_CERTIFIED = models.DateField(null=True)
    CERTIFIED_BY = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'TERMINATION_PROCESS'


class UAR_PROCESS(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    APP_NAME = models.ForeignKey(APP_LIST, on_delete=models.CASCADE, null=True, blank=True)
    FREQUENCY = models.CharField(max_length=100,blank=True,null=True)
    DAYS_TO_COMPLETE = models.CharField(max_length=100,blank=True,null=True)
    SCOPE_USERS = models.CharField(max_length=100,blank=True,null=True)
    SCOPE_ROLES = models.CharField(max_length=100,blank=True,null=True)
    SCOPE_EXEMPTED = models.CharField(max_length=100,blank=True,null=True)
    EXTRACTOR = models.CharField(max_length=100,blank=True,null=True)
    IS_TOOL = models.CharField(max_length=10,blank=True,null=True)
    TOOL_NAME = models.CharField(max_length=10,blank=True,null=True)
    EXTRACTION_SEND = models.CharField(max_length=100,blank=True,null=True)
    EXTRACTION_SEND_OTHER = models.CharField(max_length=100,blank=True,null=True)
    REVIEWER = models.CharField(max_length=100,blank=True,null=True)
    REVIEWER_OTHER = models.CharField(max_length=100,blank=True,null=True)
    CNA_REVIEWER = models.CharField(max_length=100,blank=True,null=True)
    CNA_PROCESS = models.CharField(max_length=1000,blank=True,null=True)
    CHANGE_DOCUMENTATION =models.CharField(max_length=100,blank=True,null=True)
    CHANGE_DOCUMENTATION_SEND=models.CharField(max_length=100,blank=True,null=True)
    CHANGE_DOCUMENTATION_SEND_OTHER=models.CharField(max_length=100,blank=True,null=True)
    CHANGE_TIMELINE =models.CharField(max_length=100,blank=True,null=True)
    CHANGE_DOCUMENTATION_REVIEWED =models.CharField(max_length=100,blank=True,null=True) 
    SOD_CHECK =models.CharField(max_length=100,blank=True,null=True) 
    SOD_MITIGATION =models.CharField(max_length=1000,blank=True,null=True) 

    class Meta:
        managed = True
        db_table = 'UAR_PROCESS'

class PRIVILEGED_PROCESS(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    APP_NAME = models.ForeignKey(APP_LIST, on_delete=models.CASCADE, null=True, blank=True)
    ADMIN_ROLES = models.CharField(max_length=100,blank=True,null=True)
    CAPABILITIES = models.CharField(max_length=100,blank=True,null=True)
    CAPABILITIES_OTHER =  models.CharField(max_length=100,blank=True,null=True)
    ADMIN_REVIEW_PERFORMED = models.CharField(max_length=50,blank=True,null=True)
    ADMIN_REVIEW_FREQUENCY = models.CharField(max_length=100,blank=True,null=True)
    ADMIN_REVIEW_DOCUMENT = models.CharField(max_length=100,blank=True,null=True)
    ADMIN_REVIEW_DOCUMENT_OTHER = models.CharField(max_length=100,blank=True,null=True)

#APPLICATION PASSWORD
class APP_PASSWORD(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    APP_NAME = models.ForeignKey(APP_LIST, on_delete=models.CASCADE, blank=True, null=True)
    CONTROL_ID = models.ForeignKey(CONTROLS, on_delete=models.CASCADE, blank=True, null=True)
    COMPLEXITY_ENABLED = models.BooleanField(default=False) 
    LENGTH = models.IntegerField(blank=True, null=True)
    UPPER = models.BooleanField(default=False) 
    LOWER = models.BooleanField(default=False) 
    NUMBER = models.BooleanField(default=False) 
    SPECIAL_CHAR = models.BooleanField(default=False)  
    AGE = models.IntegerField(blank=True, null=True)
    HISTORY = models.IntegerField(blank=True, null=True)
    LOCKOUT_ATTEMPT = models.IntegerField(blank=True, null=True)
    LOCKOUT_DURATION = models.CharField(max_length=50, blank=True, null=True)
    MFA_ENABLED = models.BooleanField(default=False)
    AUTH_METHOD = models.CharField(max_length=50,blank=True,null=True)
    SETUP_COMPLETE = models.BooleanField(default=False,null=True)  
    #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True,null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY = models.CharField(max_length=50,blank=True,null=True)

def __str__(self):
    return str(self.CONTROL_ID)

class Meta:
        managed = True
        db_table = 'PASSWORD'

#APPLICATION PASSWORD
class POLICY_PASSWORD(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    COMPANY_ID = models.ForeignKey(COMPANY, on_delete=models.CASCADE, blank=True, null=True)
    LENGTH = models.IntegerField(blank=True, null=True)
    UPPER = models.BooleanField(default=False) 
    LOWER = models.BooleanField(default=False) 
    NUMBER = models.BooleanField(default=False) 
    SPECIAL_CHAR = models.BooleanField(default=False)  
    AGE = models.IntegerField(blank=True, null=True)
    HISTORY = models.IntegerField(blank=True, null=True)
    LOCKOUT_ATTEMPT = models.IntegerField(blank=True, null=True)
    LOCKOUT_DURATION = models.CharField(max_length=50, blank=True, null=True)
    MFA_ENABLED = models.BooleanField(default=False)
    #LOG
    CREATED_BY = models.CharField(max_length=50,blank=True,null=True)
    CREATED_ON = models.DateField(auto_now_add=True,null=True,blank=True)
    LAST_MODIFIED = models.DateTimeField(null=True)
    MODIFIED_BY = models.CharField(max_length=50,blank=True,null=True)

def __str__(self):
    return str(self.APP_NAME)

class Meta:
        managed = True
        db_table = 'POLICY_PASSWORD'

class COMPLIANCE_POPULATION (models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    APP_NAME = models.ForeignKey(APP_LIST, on_delete=models.CASCADE, blank=True, null=True)
    CHECK_AUTH = models.BooleanField(default=True,blank=True, null=True)
    CHECK_PROV = models.BooleanField(default=True,blank=True, null=True)
    CHECK_TERMED = models.BooleanField(default=True,blank=True, null=True)
    CHECK_UAR = models.BooleanField(default=True,blank=True, null=True)
    CHECK_ADMIN = models.BooleanField(default=True,blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'COMPLIANCE_POPULATION'


    
