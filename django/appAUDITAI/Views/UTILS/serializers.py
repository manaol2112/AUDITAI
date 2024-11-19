from rest_framework import serializers
from appAUDITAI.models import *
from django.contrib.auth.models import Group, Permission, User
from datetime import datetime


class CounterSerializer(serializers.ModelSerializer):
  class Meta:
        model = RequestIDCounter
        fields = '__all__'

class HRSerializer(serializers.ModelSerializer):
    class Meta:
        model = HR_RECORD
        fields = '__all__'

class AccessRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ACCESSREQUEST
        fields = '__all__'

class AccessRequestApproverSerializer(serializers.ModelSerializer):
    class Meta:
        model = ACCESSREQUESTAPPROVER
        fields = '__all__'


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = COMPANY
        fields = '__all__'

class AppSerializer(serializers.ModelSerializer):
    COMPANY_NAME = serializers.SerializerMethodField()
    APPLICATION_OWNER = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True, required=False)

    class Meta:
        model = APP_LIST
        fields = '__all__'

    def get_COMPANY_NAME(self, obj):
        return obj.COMPANY_ID.COMPANY_NAME if obj.COMPANY_ID else None
    
    def get_APPLICATION_OWNER(self,obj):
        owners = obj.APPLICATION_OWNER.all()
        selected_user = [{'id': owner.id, 'first_name': owner.first_name, 'last_name': owner.last_name} for owner in owners]
        return selected_user
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        owners = instance.APPLICATION_OWNER.all()
        owners_representation = UserSerializer(owners, many=True).data
        representation['owners'] = owners_representation
        return representation
    
class AppPasswordSerializer(serializers.ModelSerializer):

    class Meta:
        model = APP_PASSWORD
        fields = '__all__'

class AppRecordSerializer(serializers.ModelSerializer):

    class Meta:
        model = APP_RECORD
        fields = '__all__'

class AppRecordMappingSerializer(serializers.ModelSerializer):
    FILE = serializers.FileField()  # Serializer field for file upload
    FILE_NAME = serializers.CharField(max_length=255)  # Serializer field for file name
    class Meta:
        model = CSV_MAPPING_TABLE
        fields = '__all__'
         
class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__' 

class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = '__all__' 

class UserSerializer(serializers.ModelSerializer):

    groups = serializers.PrimaryKeyRelatedField(queryset=Group.objects.all(), many=True, required=False)

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'username', 'is_active', 'groups')

    def get_groups(self,obj):
        groups = obj.groups.all()
        group_name = [{'id': group.id, 'name': group.name} for group in groups]
        return group_name
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        groups = instance.groups.all()
        group_representation = GroupSerializer(groups, many=True).data
        representation['groups'] = group_representation
        return representation
    
class USERROLESSerializer(serializers.ModelSerializer):

    COMPANY_NAME = serializers.SerializerMethodField()

    class Meta:
        model = USERROLES
        fields = ('id', 'USERNAME', 'COMPANY_NAME', 'COMPANY_ID', 'CREATED_BY', 'CREATED_ON', 'LAST_MODIFIED', 'MODIFIED_BY')

    def get_COMPANY_NAME(self, obj):
        companies = obj.COMPANY_ID.all()
        company_names = [{'id': company.id, 'COMPANY_ID': company.COMPANY_NAME} for company in companies]
        return company_names
    
    def get_USERNAME(self, obj):
        # Assuming you want to fetch all users associated with all companies of this user role
        users = User.objects.filter(userroles__in=[obj])
        serialized_users = [{'id': user.id, 'first_name': user.first_name, 'last_name': user.last_name} for user in users]
        return serialized_users

class SystemSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PASSWORDCONFIG
        fields = '__all__' 


class HRSFTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = HR_LIST_SFTP
        fields = '__all__' 

class HRJobSerializer(serializers.ModelSerializer):

    class Meta:
        model = HR_JOB_PULL
        fields = '__all__'

class HRDataMappingSerializer(serializers.ModelSerializer):

    file = serializers.FileField()  # Serializer field for file upload
    file_name = serializers.CharField(max_length=255)  # Serializer field for file name

    class Meta:
        model = HR_DATA_MAPPING
        fields = '__all__'


class HRLogSerializer(serializers.ModelSerializer):

    class Meta:
        model = HR_RECORD_IMPORT_LOG
        fields = '__all__'


class Provisioning_ProcessSerializer(serializers.ModelSerializer):

    class Meta:
        model = PROVISIONING_PROCESS
        fields = '__all__'


class Termination_ProcessSerializer(serializers.ModelSerializer):

    class Meta:
        model = TERMINATION_PROCESS
        fields = '__all__'


class UAR_ProcessSerializer(serializers.ModelSerializer):

    class Meta:
        model = UAR_PROCESS
        fields = '__all__'

class Admin_ProcessSerializer(serializers.ModelSerializer):

    class Meta:
        model = PRIVILEGED_PROCESS
        fields = '__all__'

class PasswordPolicy_Serializer(serializers.ModelSerializer):

    class Meta:
        model = POLICY_PASSWORD
        fields = '__all__'

class RiskList_Serializer(serializers.ModelSerializer):

    class Meta:
        model = RISKLIST
        fields = '__all__'
  
class ControlsList_Serializer(serializers.ModelSerializer):

    class Meta:
        model = CONTROLLIST
        fields = '__all__'

class ProcedureList_Serializer(serializers.ModelSerializer):
    CONTROL_TITLE = serializers.SerializerMethodField()
    
    class Meta:
        model = TEST_PROCEDURES
        fields = '__all__'

    def get_CONTROL_TITLE(self, obj):
      return obj.CONTROL_ID.CONTROL_TITLE if obj.CONTROL_ID else None

class ProjectList_Serializer(serializers.ModelSerializer):

    class Meta:
        model = AUDITLIST
        fields = '__all__'

class RiskMapping_Serializer(serializers.ModelSerializer):
    CONTROL_DETAILS = serializers.SerializerMethodField()

    class Meta:
        model = RISKMAPPING
        fields = '__all__'
  
    def get_CONTROL_DETAILS(self, obj):
        # Assuming obj.CONTROL_ID is a ManyToMany field related to CONTROL model
        controls = obj.CONTROL_ID.all()  # Get all related CONTROL instances
        # Serialize the related CONTROL instances using ControlSerializer
        serializer = ControlsList_Serializer(controls, many=True)
        return serializer.data
    
class AuditFile_Serializer(serializers.ModelSerializer):
    CONTROL_DETAILS = serializers.SerializerMethodField()

    class Meta:
        model = AUDITFILE
        fields = '__all__'

    def get_CONTROL_DETAILS(self, obj):
        control_instance = obj.CONTROL_ID  
        serializer = ControlsList_Serializer(control_instance)
        return serializer.data
  
   
class WorkpaperDetails_Serializer(serializers.ModelSerializer):

    class Meta:
        model = WORKPAPER_DETAILS
        fields = '__all__'