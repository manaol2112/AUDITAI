from rest_framework import viewsets
from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from appAUDITAI.models import APP_LIST, APP_PASSWORD
from appAUDITAI.Views.UTILS.serializers import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.db.models import F

class AppViewSet(viewsets.ModelViewSet):
    queryset = APP_LIST.objects.all()
    serializer_class = AppSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class AppViewSetByID(RetrieveAPIView):
    queryset = APP_LIST.objects.all()
    serializer_class = AppSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'appId'

class AppViewSetByOwner(ListAPIView):
    queryset = APP_LIST.objects.all()
    serializer_class = AppSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'APPLICATION_OWNER'

    def get_queryset(self):
        user = self.request.user
        return APP_LIST.objects.filter(APPLICATION_OWNER=user)
    
class AppViewSetByType(ListAPIView):
    queryset = APP_LIST.objects.all()
    serializer_class = AppSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'appType'

    def get_queryset(self):
        app_type = self.kwargs.get('appType')
        return APP_LIST.objects.filter(APP_TYPE=app_type)
    
class AppViewSetByCompany(ListAPIView):
    queryset = APP_LIST.objects.all()
    serializer_class = AppSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'COMPANY_ID'

    def get_queryset(self):
        company = self.kwargs.get('COMPANY_ID')
        apps = APP_LIST.objects.filter(COMPANY_ID = company)
        return apps
    
class AppPasswordViewSet(viewsets.ModelViewSet):
    queryset = APP_PASSWORD.objects.all()
    serializer_class = AppPasswordSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'APP_NAME'

    def retrieve(self, request, *args, **kwargs):
        app_name = self.kwargs.get('APP_NAME')
        auth_compliant = 'Not Set'
        compliance_status = {}
        pw_configured = None
        pw_policy = None

        # Get the configured password
        try:
            pw_configured = APP_PASSWORD.objects.get(APP_NAME=app_name)
        except APP_PASSWORD.DoesNotExist:
            pw_configured = None

        # Get the policy password
        try:
            company_instance = APP_LIST.objects.get(id=app_name)
            if company_instance:
                company_id = company_instance.COMPANY_ID
                if company_id:
                    try:
                        pw_policy = POLICY_PASSWORD.objects.get(COMPANY_ID=company_id)
                    except POLICY_PASSWORD.DoesNotExist:
                        pw_policy = None
        except APP_LIST.DoesNotExist:
            company_instance = None

        # Check compliance
        if pw_configured and pw_policy:
            non_compliant_fields = []
            # Helper function to compare fields safely
            def compare(field_name, policy_value, configured_value, comparison_op):
                if policy_value is not None and configured_value is not None:
                    if comparison_op(policy_value, configured_value):
                        non_compliant_fields.append(field_name)

            # Compare fields with safe checking
            compare('LENGTH', pw_policy.LENGTH, pw_configured.LENGTH, lambda p, c: p > c)
            compare('AGE', pw_policy.AGE, pw_configured.AGE, lambda p, c: p < c)
            compare('HISTORY', pw_policy.HISTORY, pw_configured.HISTORY, lambda p, c: p > c)
            compare('LOCKOUT_ATTEMPT', pw_policy.LOCKOUT_ATTEMPT, pw_configured.LOCKOUT_ATTEMPT, lambda p, c: p < c)
            compare('SPECIAL_CHAR', pw_policy.SPECIAL_CHAR, pw_configured.SPECIAL_CHAR, lambda p, c: p != c)
            compare('UPPER', pw_policy.UPPER, pw_configured.UPPER, lambda p, c: p != c)
            compare('LOWER', pw_policy.LOWER, pw_configured.LOWER, lambda p, c: p != c)
            compare('NUMBER', pw_policy.NUMBER, pw_configured.NUMBER, lambda p, c: p != c)
            compare('MFA_ENABLED', pw_policy.MFA_ENABLED, pw_configured.MFA_ENABLED, lambda p, c: p != c)

            # Determine overall compliance
            if not non_compliant_fields:
                auth_compliant = 'Yes'
            else:
                auth_compliant = 'No'

            # Detailed compliance status
            compliance_status = {
                'id': app_name, 
                'status': 'Compliant' if len(non_compliant_fields) == 0 else 'Needs Review', # Conditional status
                'non_compliant_fields': non_compliant_fields,
            }


        # Serialize the instance and additional context
        serializer = self.get_serializer(pw_configured)
        pw_configured_data = serializer.data if pw_configured else None

        pw_policy_data = None
        if pw_policy:
            pw_policy_serializer = PasswordPolicy_Serializer(pw_policy)
            pw_policy_data = pw_policy_serializer.data
            pw_policy_data['app_name'] = app_name

        context = {
            'data': pw_configured_data,
            'pw_policy': pw_policy_data,
            'auth_compliant': auth_compliant,
            'compliance_status': compliance_status
        }

        print(context)

        return Response(context)

class AppPasswordViewSetbyApp(viewsets.ModelViewSet):
    queryset = APP_PASSWORD.objects.all()
    serializer_class = AppPasswordSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'APP_NAME'

class AppPasswordViewSetbyID(viewsets.ModelViewSet):
    queryset = APP_PASSWORD.objects.all()
    serializer_class = AppPasswordSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'APP_NAME'


class AppRecordViewSet(viewsets.ModelViewSet):
    queryset = APP_RECORD.objects.all()
    serializer_class = AppRecordSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class AppRecordViewSetbyApp(ListAPIView):
    queryset = APP_RECORD.objects.all()
    serializer_class = AppRecordSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'APP_NAME'

    def get_queryset(self):
        app_id = self.kwargs.get('APP_NAME')
        return APP_RECORD.objects.filter(APP_NAME_id=app_id).order_by(F('STATUS').asc(nulls_last=True))
    

class AppRecordLastRefreshDateByApp(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
    
            selected_app = kwargs.get('APP_NAME')
           
            try:
                latest_job = APP_JOB_USER_LOG.objects.filter(JOB_COMPLETE=True, APP_NAME=selected_app).latest('JOB_DATE')
                
                if latest_job:

                    data = {
                        'id': latest_job.id,
                        'APP_NAME': latest_job.APP_NAME.APP_NAME if latest_job.APP_NAME else None,  # Assuming 'name' is a field in APP_LIST
                        'JOB_NAME': latest_job.JOB_NAME,
                        'JOB_FILE_NAME': latest_job.JOB_FILE_NAME,
                        'JOB_FILE_DESTINATION': latest_job.JOB_FILE_DESTINATION,
                        'JOB_DATE': latest_job.JOB_DATE,
                        'JOB_COMPLETE': latest_job.JOB_COMPLETE,
                        'JOB_ERROR': latest_job.JOB_ERROR,
                        'SOURCE_LINE_COUNT': latest_job.SOURCE_LINE_COUNT,
                        'CREATED_COUNT': latest_job.CREATED_COUNT,
                        'UPLOADED_BY': latest_job.UPLOADED_BY,
                    }
                    return Response(data, status=status.HTTP_200_OK)
            
            except APP_JOB_USER_LOG.DoesNotExist:
                latest_job = None
                return Response({'error': 'No jobs found.'}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            

class ProvisioningProcessView(viewsets.ModelViewSet):
    queryset = PROVISIONING_PROCESS.objects.all()
    serializer_class = Provisioning_ProcessSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]


class ProvisioningProcessViewSetByID(viewsets.ModelViewSet):
    queryset = PROVISIONING_PROCESS.objects.all()
    serializer_class = Provisioning_ProcessSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'APP_NAME'

    def get_queryset(self):
        app_name = self.kwargs.get(self.lookup_field)
        return PROVISIONING_PROCESS.objects.filter(**{self.lookup_field: app_name})

    def create(self, request, *args, **kwargs):
        app_name = request.data.get(self.lookup_field)
        if not app_name:
            return Response({"detail": "APP_NAME is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        existing_record = PROVISIONING_PROCESS.objects.filter(**{self.lookup_field: app_name}).first()

        if existing_record:
            # Update the existing record
            serializer = self.get_serializer(existing_record, data=request.data, partial=True)
            if serializer.is_valid():
                self.perform_update(serializer)
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Create a new record if none exists
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        # Save the updated instance
        serializer.save()

    def perform_create(self, serializer):
        # Save the new instance
        serializer.save()

class TerminationProcessViewSetByID(viewsets.ModelViewSet):
    queryset = TERMINATION_PROCESS.objects.all()
    serializer_class = Termination_ProcessSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'APP_NAME'

    def get_queryset(self):
        app_name = self.kwargs.get(self.lookup_field)
        return TERMINATION_PROCESS.objects.filter(**{self.lookup_field: app_name})

    def create(self, request, *args, **kwargs):
        app_name = request.data.get(self.lookup_field)

        if not app_name:
            return Response({"detail": "APP_NAME is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        existing_record = TERMINATION_PROCESS.objects.filter(**{self.lookup_field: app_name}).first()

        if existing_record:
            # Update the existing record
            serializer = self.get_serializer(existing_record, data=request.data, partial=True)
            if serializer.is_valid():
                self.perform_update(serializer)
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Create a new record if none exists
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        # Save the updated instance
        serializer.save()

    def perform_create(self, serializer):
        # Save the new instance
        serializer.save()

class UARProcessViewSetByID(viewsets.ModelViewSet):
    queryset = UAR_PROCESS.objects.all()
    serializer_class = UAR_ProcessSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'APP_NAME'

    def get_queryset(self):
        app_name = self.kwargs.get(self.lookup_field)
        return UAR_PROCESS.objects.filter(**{self.lookup_field: app_name})

    def create(self, request, *args, **kwargs):
        app_name = request.data.get(self.lookup_field)

        if not app_name:
            return Response({"detail": "APP_NAME is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        existing_record = UAR_PROCESS.objects.filter(**{self.lookup_field: app_name}).first()

        if existing_record:
            # Update the existing record
            serializer = self.get_serializer(existing_record, data=request.data, partial=True)
            if serializer.is_valid():
                self.perform_update(serializer)
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Create a new record if none exists
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        # Save the updated instance
        serializer.save()

    def perform_create(self, serializer):
        # Save the new instance
        serializer.save()


class AdminProcessViewSetByID(viewsets.ModelViewSet):
    queryset = PRIVILEGED_PROCESS.objects.all()
    serializer_class = Admin_ProcessSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'APP_NAME'

    def get_queryset(self):
        app_name = self.kwargs.get(self.lookup_field)
        return PRIVILEGED_PROCESS.objects.filter(**{self.lookup_field: app_name})

    def create(self, request, *args, **kwargs):
        app_name = request.data.get(self.lookup_field)

        if not app_name:
            return Response({"detail": "APP_NAME is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        existing_record = PRIVILEGED_PROCESS.objects.filter(**{self.lookup_field: app_name}).first()

        if existing_record:
            # Update the existing record
            serializer = self.get_serializer(existing_record, data=request.data, partial=True)
            if serializer.is_valid():
                self.perform_update(serializer)
                headers = self.get_success_headers(serializer.data)
                return Response(serializer.data, status=status.HTTP_200_OK, headers=headers)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Create a new record if none exists
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        # Save the updated instance
        serializer.save()

    def perform_create(self, serializer):
        # Save the new instance
        serializer.save()