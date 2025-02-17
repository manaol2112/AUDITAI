from rest_framework import viewsets
from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from appAUDITAI.models import *
from appAUDITAI.Views.UTILS.serializers import *
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.db.models import F
import datetime
from datetime import date
from rest_framework.decorators import action

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
    
class AppRecordViewSetbyAppAndRemovalDate(APIView):
    queryset = APP_RECORD.objects.all()
    serializer_class = AppRecordSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        app_id = self.kwargs.get('APP_NAME')
        current_year = date.today().year  # Get the current year
        start_date = date(current_year, 1, 1)  # Start of the current year
        end_date = date(current_year, 12, 31)  # End of the current year

        try:
            removal_per_app = APP_RECORD.objects.filter(
                APP_NAME_id=app_id,
                DATE_REVOKED__gte=start_date,
                DATE_REVOKED__lte=end_date,
                STATUS='Inactive'
            ).order_by(F('STATUS').asc(nulls_last=True))

            # Serialize the new users per app
            removal_per_app_serializer = AppRecordSerializer(removal_per_app, many=True)

            late_removal = []

            if removal_per_app:
                for user in removal_per_app:
                    try: 
                        hr_record = HR_RECORD.objects.get(EMAIL_ADDRESS=user.EMAIL_ADDRESS)

                        if hr_record:
                            
                            if user.DATE_REVOKED and hr_record.TERMINATION_DATE:

                                hr_removal_date = hr_record.TERMINATION_DATE.date() if isinstance(hr_record.TERMINATION_DATE, datetime.datetime) else hr_record.TERMINATION_DATE
                                system_removal_date = user.DATE_REVOKED.date() if isinstance(user.DATE_REVOKED, datetime.datetime) else user.DATE_REVOKED

                                if system_removal_date > hr_removal_date:
                                                late_removal.append({
                                                    'FIRST_NAME': user.FIRST_NAME,
                                                    'LAST_NAME': user.LAST_NAME,
                                                          'EMAIL_ADDRESS': user.EMAIL_ADDRESS,
                                                    'ROLE_NAME': user.ROLE_NAME,
                                                    'STATUS': user.STATUS,
                                                    'HR_TERMED_DATE': hr_removal_date,
                                                    'SYSTEM_TERMED_DATE': system_removal_date,
                                                })

                    except HR_RECORD.DoesNotExist:
                            hr_record = None


        except APP_RECORD.DoesNotExist:
            removal_per_app = None

        context = {
            'removal_per_app': removal_per_app_serializer.data,
            'late_removal': late_removal
        }

        return Response(context)
        

    
class AppRecordViewSetbyAppAndGrantDate(APIView):
    queryset = APP_RECORD.objects.all()
    serializer_class = AppRecordSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        app_id = self.kwargs.get('APP_NAME')
        current_year = datetime.datetime.today().year

        # Get the list of requests from the database for each app
        try:
            new_users_per_app = APP_RECORD.objects.filter(
                APP_NAME_id=app_id,
                DATE_GRANTED__year=current_year
            ).order_by(F('STATUS').asc(nulls_last=True))

            # Serialize the new users per app
            new_users_per_app_serializer = AppRecordSerializer(new_users_per_app, many=True)

            with_approval = []
            without_approval = []
            late_approval = []

            if new_users_per_app:
                for user in new_users_per_app:
                    # Try fetching the HR record for the user
                    try: 
                        hr_record = HR_RECORD.objects.get(EMAIL_ADDRESS=user.EMAIL_ADDRESS)


                        if hr_record:# Fetch the ACCESSREQUEST objects related to the user and app
                            requests = ACCESSREQUEST.objects.filter(REQUESTOR=hr_record.id, APP_NAME=app_id)

                            for request in requests:
                                # Try to get an approval record
                                approval_support = ACCESSREQUESTAPPROVER.objects.filter(REQUEST_ID=request).exclude(DATE_APPROVED__isnull=True).order_by('DATE_APPROVED').first()

                                if approval_support:
                                    roles_list = [role.strip() for role in request.ROLES.split(',')]
                                    
                                    # Check if user’s role matches the requested roles
                                    if user.ROLE_NAME in roles_list:
                                        with_approval.append({
                                            'FIRST_NAME': user.FIRST_NAME,
                                            'LAST_NAME': user.LAST_NAME,
                                            'EMAIL_ADDRESS': user.EMAIL_ADDRESS,
                                            'ROLE_NAME': user.ROLE_NAME,
                                            'STATUS': user.STATUS,
                                            'DATE_GRANTED': user.DATE_GRANTED,
                                            'APPROVAL_TOKEN': request.APPROVAL_TOKEN,
                                            'COMMENTS': request.COMMENTS
                                        })

                                        if user.DATE_GRANTED and approval_support.DATE_APPROVED:
                                            # Ensure both dates are compared correctly, stripping time if necessary
                                            approval_date = approval_support.DATE_APPROVED.date() if isinstance(approval_support.DATE_APPROVED, datetime.datetime) else approval_support.DATE_APPROVED
                                            granted_date = user.DATE_GRANTED.date() if isinstance(user.DATE_GRANTED, datetime.datetime) else user.DATE_GRANTED

                                            if granted_date < approval_date:
                                                late_approval.append({
                                                    'FIRST_NAME': user.FIRST_NAME,
                                                    'LAST_NAME': user.LAST_NAME,
                                                    'EMAIL_ADDRESS': user.EMAIL_ADDRESS,
                                                    'ROLE_NAME': user.ROLE_NAME,
                                                    'STATUS': user.STATUS,
                                                    'DATE_GRANTED': granted_date,
                                                    'DATE_APPROVED': approval_date,
                                                })
                                else:

                                    without_approval.append({
                                        'email': user.EMAIL_ADDRESS,
                                        'role': user.ROLE_NAME,
                                        'status': user.STATUS,
                                        'date_granted': user.DATE_GRANTED,
                                        'approval_token': request.APPROVAL_TOKEN,
                                        'comments': request.COMMENTS
                                    })

                    except HR_RECORD.DoesNotExist:

                        without_approval.append({
                                'FIRST_NAME': user.FIRST_NAME,
                                            'LAST_NAME': user.LAST_NAME,
                                            'EMAIL_ADDRESS': user.EMAIL_ADDRESS,
                                            'ROLE_NAME': user.ROLE_NAME,
                                            'STATUS': user.STATUS,
                                            'DATE_GRANTED': user.DATE_GRANTED,
                            })

        except APP_RECORD.DoesNotExist:
            new_users_per_app = None

        # Build response context
        context = {
            'new_users_per_app': new_users_per_app_serializer.data,
            'with_approval': with_approval,
            'without_approval': without_approval,
            'late_approval': late_approval,
        }

        return Response(context)
    

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

class UARSODViewSet(viewsets.ModelViewSet):
    queryset = UAR_SOD_CHECK.objects.all()
    serializer_class = UARSODSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

class UARSODViewSetByUARFile(viewsets.ModelViewSet):
    serializer_class = UARSODSerializer

    def get_queryset(self):
        # Get path parameters
        uar_file = self.kwargs.get('UAR_FILE')  
        role_owner = self.kwargs.get('ROLE_OWNER')  

        # Start with the base queryset
        queryset = UAR_SOD_CHECK.objects.all()

        # Filter the queryset based on the path parameters
        if uar_file :
            queryset = queryset.filter(UAR_FILE=uar_file)

        if role_owner:
            queryset = queryset.filter(ROLE_OWNER = role_owner)

        return queryset

    def list(self, request, *args, **kwargs):
        # Get the filtered queryset
        queryset = self.get_queryset()
        # Serialize the queryset
        serializer = self.get_serializer(queryset, many=True)

        # Return the serialized data
        return Response(serializer.data)


class UARSODViewSetByAPPNameCycle(viewsets.ModelViewSet):
    serializer_class = UARSODSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get path parameters
        app_name = self.kwargs.get('APP_NAME')  
        review_cycle = self.kwargs.get('REVIEW_CYCLE') 

        # Start with the base queryset
        queryset = UAR_SOD_CHECK.objects.all()

        # Filter the queryset based on the path parameters
        if app_name:
            queryset = queryset.filter(APP_NAME=app_name)

        if review_cycle:
            queryset = queryset.filter(REVIEW_CYCLE=review_cycle)

        return queryset

    def list(self, request, *args, **kwargs):
        # Get the filtered queryset
        queryset = self.get_queryset()

        # Serialize the queryset
        serializer = self.get_serializer(queryset, many=True)

        # Return the serialized data
        return Response(serializer.data)
    
    def update(self, request, *args, **kwargs):
        # Retrieve the instance based on the filtered parameters
        app_name = self.kwargs.get('APP_NAME')
        review_cycle = self.kwargs.get('REVIEW_CYCLE')
        email_address = self.kwargs.get('EMAIL_ADDRESS')

        # Get the object to be updated
        try:
            instance = UAR_SOD_CHECK.objects.get(
                APP_NAME=app_name,
                REVIEW_CYCLE=review_cycle,
                EMAIL_ADDRESS=email_address
            )
        except UAR_SOD_CHECK.DoesNotExist:
            return Response({"detail": "Object not found."}, status=status.HTTP_404_NOT_FOUND)

        # Use the serializer to update the instance
        serializer = self.get_serializer(instance, data=request.data, partial=True)

        # Validate and save
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class UARTokenView(viewsets.ModelViewSet):
    queryset = UAR_REVIEW_TOKEN.objects.all()
    serializer_class = UARTokenSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'TOKEN'

class UARScopeRolesViewDeleteByID(viewsets.ModelViewSet):
    queryset = UAR_INSCOPE_ROLES.objects.all()
    serializer_class = UARScopeRolesSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

class UARScopeRolesView(viewsets.ModelViewSet):
    queryset = UAR_INSCOPE_ROLES.objects.all()
    serializer_class = UARScopeRolesSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'UAR_FILE'

    def get_queryset(self):
        uar_file = self.kwargs.get(self.lookup_field)
        return UAR_INSCOPE_ROLES.objects.filter(**{self.lookup_field: uar_file})

    def destroy(self, request, *args, **kwargs):
        # Retrieve the object to delete
        instance = self.get_object()
        
        # Perform the deletion
        self.perform_destroy(instance)

        # Return a success response
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
class UARScopeRolesViewByUARFile(ListAPIView):
    queryset = UAR_INSCOPE_ROLES.objects.all()
    serializer_class = UARScopeRolesSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'UAR_FILE'

    def get_queryset(self):
        uar_file = self.kwargs.get(self.lookup_field)
        print('This is the uar file', uar_file)
        query = UAR_INSCOPE_ROLES.objects.filter(**{self.lookup_field: uar_file})
        print(query)
        return query

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


class UARViewSet(viewsets.ModelViewSet):
    queryset = UAR_FILE.objects.all()
    serializer_class = UARSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

class UARViewSetbyApp(viewsets.ModelViewSet):
    queryset = UAR_FILE.objects.all()
    serializer_class = UARSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'APP_NAME'

    def get_queryset(self):
            app_id = self.kwargs.get(self.lookup_field)
            return UAR_FILE.objects.filter(APP_NAME = app_id).order_by('REVIEW_TAG')
    