from rest_framework import viewsets
from appAUDITAI.Views.UTILS.serializers import *
from rest_framework.generics import RetrieveAPIView
from django.contrib.auth.models import *
from rest_framework.decorators import action
from rest_framework import viewsets, status
from rest_framework.response import Response
from appAUDITAI.Views.UTILS.serializers import CompanySerializer
import paramiko
from django.http import JsonResponse
from paramiko import AuthenticationException, SSHException
import logging
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from django.contrib.auth.decorators import login_required
from rest_framework.views import APIView
import base64
from django.core.files.base import ContentFile
import csv
import io
from appAUDITAI.models import *
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from appAUDITAI.Views.LOGIN.permission import isAdministrator
from django.utils.timezone import make_aware, get_current_timezone


logger = logging.getLogger(__name__)


class HRSFTPViewSet(viewsets.ModelViewSet):
    queryset = HR_LIST_SFTP.objects.all()
    serializer_class = HRSFTPSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, isAdministrator]


class HRSFTPViewSetbyID(viewsets.ModelViewSet):
    queryset = HR_LIST_SFTP.objects.all()
    serializer_class = HRSFTPSerializer
    lookup_field = "id"
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, isAdministrator]


class HRSFTPViewSetbyID(viewsets.ModelViewSet):
    queryset = HR_LIST_SFTP.objects.all()
    serializer_class = HRSFTPSerializer
    lookup_field = "id"
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, isAdministrator]

class HRJobViewSet(viewsets.ModelViewSet):
    queryset = HR_JOB_PULL.objects.all()
    serializer_class = HRJobSerializer
    lookup_field = "id"
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, isAdministrator]

class HRJobViewSetbyID(viewsets.ModelViewSet):
    queryset = HR_JOB_PULL.objects.all()
    serializer_class = HRJobSerializer
    lookup_field = "id"
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, isAdministrator]

class HR_Data_MappingViewSet(viewsets.ModelViewSet):
    queryset = HR_DATA_MAPPING.objects.all()
    serializer_class = HRDataMappingSerializer
    lookup_field = "id"
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, isAdministrator]


class HR_Data_MappingViewSetbyID(viewsets.ModelViewSet):
    queryset = HR_DATA_MAPPING.objects.all()
    serializer_class = HRDataMappingSerializer
    lookup_field = "id"
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, isAdministrator]

@require_http_methods(["POST", "OPTIONS"])
@permission_classes([IsAuthenticated, isAdministrator])
def hr_sftp_connection(request):
    if request.method == 'POST':
        try:
            user = request.user
            print(user)
            data = json.loads(request.body.decode('utf-8'))
            host_name = data.get('HOST_NAME')
            sftp_directory = data.get('DIRECTORY')
            sftp_destination = data.get('DESTINATION')
            sftp_username = data.get('USERNAME')
            sftp_password = data.get('PASSWORD')
            sftp_auth_key = data.get('SECRETKEY')

                # Establish SFTP connection
            transport = paramiko.Transport((host_name, 22))
            transport.connect(username=sftp_username, password=sftp_password)
            sftp = paramiko.SFTPClient.from_transport(transport)
            sftp.close()
            transport.close()
            return JsonResponse({'success Authenticated to the server successfully': True})
        except AuthenticationException:
            return JsonResponse({'error': False, 'error': 'Authentication failed'})
        except SSHException as e:
            return JsonResponse({'error': False, 'error': str(e)})
        except Exception as e:
            return JsonResponse({'error': False, 'error': str(e)})
        finally:
            # Ensure connections are closed
            try:
                if sftp:
                    sftp.close()
            except:
                pass
            try:
                if transport:
                    transport.close()
            except:
                pass
            
        return JsonResponse({'success': False, 'error': 'Method not allowed'}, status=405)

class AppUserDataMappingView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def parse_date(self, date_str, date_formats):
        for date_format in date_formats:
            try:
                return datetime.strptime(date_str, date_format)
            except ValueError:
                pass
        return None
    
    def post(self, request, *args, **kwargs):
        try:
            user = request.user
            received_data = request.data
            data = json.loads(request.data['data'])
            files = request.FILES.get('FILE')
            file_name = request.data.get('FILE_NAME')
            APP_NAME = request.data.get('APP_NAME')

            # Extract single values from arrays if necessary
            data = {key: value[0] if isinstance(value, list) else value for key, value in data.items()}

            data['FILE_NAME'] = file_name
            data['FILE'] = files
            data['CREATED_BY'] = user.username

            serializer = AppRecordMappingSerializer(data=data)
            date_formats = ["%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%Y%m%d", "%m/%d/%y"]
            try:
                selected_app = APP_LIST.objects.get(id=APP_NAME)
            except APP_LIST.DoesNotExist:
                selected_app = None

            if serializer.is_valid():
              
                instance = serializer.save()
                saved_file = instance.FILE  # Access the saved file

                csv_data = io.TextIOWrapper(saved_file.file, encoding='utf-8')
                csv_reader = csv.reader(csv_data)
                header = next(csv_reader)
                header = [field.strip('\ufeff').lower() for field in header]
                row_count = sum(1 for _ in csv_reader)  # Count the number of rows
               # Convert the expected fields to lowercase
                expected_fields = ['USER_ID', 'EMAIL', 'FIRST_NAME', 'LAST_NAME', 'ROLE', 'STATUS', 'DATE_GRANTED', 'DATE_REVOKED', 'LAST_LOGIN']
                expected_fields_lower = [field.lower() for field in expected_fields]
                
                # Check for missing fields (case-insensitive comparison)
                missing_fields = [field for field in expected_fields_lower if field not in header]

                if missing_fields:
                    return JsonResponse({'error': 'Missing field(s) in the attached template: {}'.format(', '.join(missing_fields))}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    created_count = 0
                    updated_count = 0
                    csv_data.seek(0)
                    header = next(csv_reader)
                    for row in csv_reader:
                    
                        DATE_GRANTED = row[6]
                        DATE_REVOKED = row[7]
                        LAST_LOGIN = row[8]

                        DATE_GRANTED = self.parse_date(DATE_GRANTED, date_formats) if DATE_GRANTED else datetime(1900, 1, 1)
                        DATE_REVOKED = self.parse_date(DATE_REVOKED, date_formats) if DATE_REVOKED else datetime(1900, 1, 1)
                        LAST_LOGIN = self.parse_date(LAST_LOGIN, date_formats) if LAST_LOGIN else datetime(1900, 1, 1)

                        # Ensure dates are timezone-aware
                        tz = get_current_timezone()
                        DATE_GRANTED = make_aware(DATE_GRANTED, timezone=tz)
                        DATE_REVOKED = make_aware(DATE_REVOKED, timezone=tz)
                        LAST_LOGIN = make_aware(LAST_LOGIN, timezone=tz)

                        user_record_data = {
                            'APP_NAME': selected_app,
                            'USER_ID': row[0],
                            'EMAIL_ADDRESS': row[1],
                            'FIRST_NAME': row[2],
                            'LAST_NAME': row[3],
                            'ROLE_NAME': row[4],
                            'STATUS': row[5],
                            'DATE_GRANTED': DATE_GRANTED,
                            'DATE_REVOKED': DATE_REVOKED,
                            'LAST_LOGIN': LAST_LOGIN,
                        }

                        user_record_data, created = APP_RECORD.objects.update_or_create(
                            APP_NAME=selected_app,
                            USER_ID=row[0],
                            EMAIL_ADDRESS=row[1],
                            ROLE_NAME=row[4],
                            defaults=user_record_data  # Data to update or create
                        )

                        if created:
                            created_count += 1
                        else:
                            updated_count += 1

                    # # Save import log after processing all records
                    app_import_log = APP_JOB_USER_LOG.objects.create(
                        APP_NAME=selected_app,
                        JOB_NAME='Manual Import',
                        JOB_DATE=datetime.now(),
                        JOB_FILE_NAME=saved_file.name,
                        SOURCE_LINE_COUNT=row_count,
                        CREATED_COUNT = (created_count + updated_count),
                        JOB_COMPLETE=True,
                        UPLOADED_BY=user.username
                    )

                    csv_data.close()  # Close the file after processing

                return JsonResponse({'message': 'Import successful'}, status=status.HTTP_201_CREATED)

            else:

                return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # Handle exceptions appropriately, logging or returning error response
            return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
       

class HRDataMappingView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, isAdministrator]

    
    def get(self, request):
        try:
            user = request.user
            if user.is_authenticated:
                hr_data_log = HR_RECORD_IMPORT_LOG.objects.all()
                serializer = HRLogSerializer(hr_data_log, many=True)
                response_data = {
                    'data': serializer.data
                }
                return Response(response_data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def parse_date(self, date_str, date_formats):
        for date_format in date_formats:
            try:
                return datetime.strptime(date_str, date_format)
            except ValueError:
                pass
        # If none of the formats match, return None or handle accordingly
        return None

    def post(self, request, *args, **kwargs):
        try:
            received_data = request.data
            data = json.loads(request.data['data'])
            files = request.FILES.get('file')
            file_name = request.data.get('file_name')

            # Extract single values from arrays if necessary
            data = {key: value[0] if isinstance(value, list) else value for key, value in data.items()}

            data['file_name'] = file_name
            data['file'] = files

            serializer = HRDataMappingSerializer(data=data)
            date_formats = ["%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%Y%m%d", "%m/%d/%y"]

            if serializer.is_valid():
                instance = serializer.save()
                saved_file = instance.file  # Access the saved file

                # Check if file is CSV
                if not saved_file.name.endswith('.csv'):
                    return Response({'error': 'Uploaded file is not a CSV'}, status=status.HTTP_400_BAD_REQUEST)

                # Read the CSV file and get headers
                csv_data = io.StringIO(saved_file.read().decode('utf-8'))
                csv_reader = csv.reader(csv_data)
                row_count = sum(1 for _ in csv_reader)  # Count the number of rows
                csv_data.seek(0)  # Reset StringIO to the beginning
                header = next(csv_reader)
                header = [field.strip('\ufeff') for field in header]
                expected_fields = ['COMPANY_ID', 'USER_ID', 'EMAIL_ADDRESS', 'FIRST_NAME', 'LAST_NAME', 'JOB_TITLE', 'DEPARTMENT', 'MANAGER', 'HIRE_DATE', 'EMP_TYPE', 'REHIRE_DATE', 'STATUS', 'TERMINATION_DATE']
                missing_fields = [field for field in expected_fields if field not in header]

                if missing_fields:
                    return JsonResponse({'error': 'Missing field(s) in the attached template: {}'.format(', '.join(missing_fields))}, status=status.HTTP_400_BAD_REQUEST)
                else:    

                    # Create HR_RECORD_IMPORT_LOG instance
                    user = request.user
                    
                    # Process each row in the CSV
                    for row in csv_reader:
                        HIRE_DATE = row[8]
                        REHIRE_DATE = row[10]
                        TERMINATION_DATE = row[11]

                        # Parse dates or assign default values
                        HIRE_DATE = self.parse_date(HIRE_DATE, date_formats) if HIRE_DATE else datetime(1900, 1, 1)
                        REHIRE_DATE = self.parse_date(REHIRE_DATE, date_formats) if REHIRE_DATE else datetime(1900, 1, 1)
                        TERMINATION_DATE = self.parse_date(TERMINATION_DATE, date_formats) if TERMINATION_DATE else datetime(1900, 1, 1)

                        hr_record_data = {
                            'COMPANY_ID': row[0],
                            'USER_ID': row[1],
                            'EMAIL_ADDRESS': row[2],
                            'FIRST_NAME': row[3],
                            'LAST_NAME': row[4],
                            'JOB_TITLE': row[5],
                            'DEPARTMENT': row[6],
                            'MANAGER': row[7],
                            'HIRE_DATE': HIRE_DATE,
                            'EMP_TYPE': row[9],
                            'REHIRE_DATE': REHIRE_DATE,
                            'TERMINATION_DATE': TERMINATION_DATE,
                            'STATUS': row[12],
                        }

                        # Try to get an existing record or create a new one
                        hr_record, created = HR_RECORD.objects.update_or_create(
                            USER_ID=row[1],
                            EMAIL_ADDRESS=row[2],
                            defaults=hr_record_data  # Data to update or create
                        )

                        # If the record already existed, update its fields
                        if not created:
                            for field, value in hr_record_data.items():
                                setattr(hr_record, field, value)
                            hr_record.save()                            

                        hr_import_log, created = HR_RECORD_IMPORT_LOG.objects.update_or_create(
                        JOB_NAME='Manual Import',
                        IMPORT_DATE=datetime.now(),
                        FILE_NAME=saved_file.name,
                        SOURCE_LINE_COUNT=row_count,
                        JOB_COMPLETE=True,
                        UPLOADED_BY= user.username
                        )

                    return Response({'message': 'File and data uploaded successfully'}, status=status.HTTP_201_CREATED)

            else:

                hr_import_log, created = HR_RECORD_IMPORT_LOG.objects.update_or_create(
                        JOB_NAME='Manual Import',
                        IMPORT_DATE=datetime.now(),
                        FILE_NAME=saved_file.name,
                        SOURCE_LINE_COUNT=row_count,
                        JOB_COMPLETE=False,
                        JOB_ERROR=serializer.errors,
                        UPLOADED_BY= user.username
                        )
                
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
