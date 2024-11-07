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
from rest_framework.exceptions import NotFound
from django.views import View
import bleach

class RiskListViewSet(viewsets.ModelViewSet):
    queryset = RISKLIST.objects.all()
    serializer_class = RiskList_Serializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'RISK_ID'

class ControlsListViewSet(viewsets.ModelViewSet):
    queryset = CONTROLLIST.objects.all()
    serializer_class = ControlsList_Serializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'CONTROL_ID'

class ProjectListViewSet(viewsets.ModelViewSet):
    queryset = AUDITLIST.objects.all()
    serializer_class = ProjectList_Serializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

class RiskMappingViewSet(viewsets.ModelViewSet):
    queryset = RISKMAPPING.objects.all()
    serializer_class = RiskMapping_Serializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'RISK_ID'

class RiskMappingUpdateViewSet(viewsets.ViewSet):
    queryset = RISKMAPPING.objects.all()
    serializer_class = RiskMapping_Serializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        app_name = self.kwargs.get('APP_NAME')
        risk_id = self.kwargs.get('RISK_ID')
        company_id = self.kwargs.get('COMPANY_ID')
        queryset =  RISKMAPPING.objects.filter(COMPANY_ID = company_id, APP_NAME=app_name, RISK_ID = risk_id)
        return queryset
    
    def update (self,request, *args, **kwargs):
        app_name = self.kwargs.get('APP_NAME')
        risk_id = self.kwargs.get('RISK_ID')
        control_id = request.data.get('CONTROL_ID')
        company_id = self.kwargs.get('COMPANY_ID')
        action = request.data.get('ACTION')
        rating = request.data.get('RATING')
        rationale = request.data.get('RATING_RATIONALE')   # Access RATING from request.data

        queryset = self.get_queryset()

        if queryset.exists():
    
                try:
                        app_instance = APP_LIST.objects.get(id=app_name)
                        control_instance = CONTROLLIST.objects.get(id=control_id)
                        company_instance = COMPANY.objects.get(id=company_id)
                except: 
                    control_instance = None
                    company_instance = None
                    app_instance = None

                for obj in queryset:
                    if control_instance:
                         if action == "UNMAP":
                                    obj.CONTROL_ID.remove(control_instance)  # Use add method to append control_id
                                    control_title = control_instance.CONTROL_ID + ":" + control_instance.CONTROL_TITLE
                                    workpaper = AUDITFILE.objects.filter(APP_NAME = app_instance, COMPANY_ID = company_instance, CONTROL_ID = control_instance).first()
                                    if workpaper: 
                                        workpaper.delete()
                         
                         else:
                                    obj.CONTROL_ID.add(control_instance)  # Use add method to append control_id
                                    control_title = control_instance.CONTROL_ID + ":" + control_instance.CONTROL_TITLE
                                    if control_title:
                                        workpaper, created = AUDITFILE.objects.get_or_create(APP_NAME = app_instance, COMPANY_ID = company_instance, CONTROL_ID = control_instance)
                                        workpaper.STATUS = 'Not Started'
                                        workpaper.FOLDER = 'Workpaper'
                                        workpaper.TYPE = control_instance.CONTROL_CATEGORY
                                        workpaper.save()

                    if rating:
                        obj.RATING = rating
                    if rationale:
                        obj.RATING_RATIONALE = rationale
                   
                    obj.save()
                
                updated_queryset = self.get_queryset().filter(APP_NAME=app_name, RISK_ID=risk_id)
                serializer = RiskMapping_Serializer(updated_queryset, many=True)

                return Response(
                    serializer.data,
                    status=status.HTTP_200_OK)

            # Retrieve the remaining records
        remaining_queryset = self.get_queryset().filter(APP_NAME=app_name)
        if remaining_queryset.exists():
                    risk_ids = remaining_queryset.values_list('RISK_ID', flat=True)
                    risklist_queryset = RISKLIST.objects.filter(id__in=risk_ids)
                    if risklist_queryset.exists():
                        # Serialize the RISKLIST data
                        serializer = RiskList_Serializer(risklist_queryset, many=True)
                        return Response(serializer.data)
                    else:
                        return Response({'detail': 'No related risk records found.'}, status=status.HTTP_404_NOT_FOUND)
        else:
                    return Response({'detail': 'No mapping records found for the given APP_NAME.'}, status=status.HTTP_404_NOT_FOUND)
       
    
    def destroy(self, request, *args, **kwargs):

        queryset = self.get_queryset()
        if queryset.exists():
                # Delete the records
                queryset.delete()
        else:
                pass
        
            # Retrieve the remaining records
        remaining_queryset = self.get_queryset()
        if remaining_queryset.exists():
                risk_ids = remaining_queryset.values_list('RISK_ID', flat=True)
                risklist_queryset = RISKLIST.objects.filter(id__in=risk_ids)
                if risklist_queryset.exists():
                    # Serialize the RISKLIST data
                    serializer = RiskList_Serializer(risklist_queryset, many=True)
                    return Response(serializer.data)
                else:
                    return Response({'detail': 'No related risk records found.'}, status=status.HTTP_404_NOT_FOUND)
        else:
                return Response({'detail': 'No mapping records found for the given APP_NAME.'}, status=status.HTTP_404_NOT_FOUND)
            

class RiskMappingViewSetbyAPP(viewsets.ModelViewSet):
    serializer_class = RiskMapping_Serializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Extract the parameters from the URL
        app_name = self.kwargs.get('APP_NAME')
        company_id = self.kwargs.get('COMPANY_ID')

        # Filter the queryset based on the parameters
        queryset = RISKMAPPING.objects.filter(APP_NAME=app_name, COMPANY_ID=company_id)
        return queryset
    
    def list(self, request, *args, **kwargs):
            queryset = self.get_queryset()
            controls_serializer = RiskMapping_Serializer(queryset, many=True)
            
            controls_data = controls_serializer.data  # Convert
            if queryset.exists():
                risk_ids = queryset.values_list('RISK_ID', flat=True)
                risklist_queryset = RISKLIST.objects.filter(id__in=risk_ids)
                if risklist_queryset.exists():
                     # Create a mapping of RISK_ID (foreign key id) to RATING and RATING_RATIONALE
                    mapping_data = queryset.values('RISK_ID', 'RATING', 'RATING_RATIONALE')
                   
                    # Check if the UUIDs are correctly handled
                    mapping_dict = {str(item['RISK_ID']): {'RATING': item['RATING'], 'RATING_RATIONALE': item['RATING_RATIONALE']} for item in mapping_data}

                    # Serialize the RISKLIST data
                    risklist_serializer = RiskList_Serializer(risklist_queryset, many=True)
                    
                    # Enhance the risk list data with rating information
                    enhanced_risklist_data = []
                    for risklist_item in risklist_serializer.data:
                        # Use 'id' from RISKLIST to match with 'RISK_ID' from RISKMAPPING
                        risk_id = str(risklist_item['id'])  # Convert UUID to string for matching
                        

                        # Check if the risk_id is present in the mapping dictionary
                        if risk_id in mapping_dict:
                            risklist_item.update(mapping_dict[risk_id])
                        else:
                           pass
                        
                        enhanced_risklist_data.append(risklist_item)
                                       
                    response_data = {
                        'risklist_data': enhanced_risklist_data,
                        'controls_data': controls_data
                    }
                    return Response(response_data)
                else:
                    return Response({'detail': 'No related risk records found.'}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({'detail': 'No mapping records found for the given APP_NAME.'}, status=status.HTTP_404_NOT_FOUND)
    
class MappedControlsViewSet(viewsets.ModelViewSet):
    serializer_class = RiskMapping_Serializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Extract the parameters from the URL
        app_name = self.kwargs.get('APP_NAME')
        company_id = self.kwargs.get('COMPANY_ID')
        risk_id = self.kwargs.get('RISK_ID')

        # Filter the queryset based on the parameters
        queryset = RISKMAPPING.objects.filter(APP_NAME=app_name, RISK_ID=risk_id, COMPANY_ID=company_id)
        return queryset
    
    def list(self, request, *args, **kwargs):
            queryset = self.get_queryset()
            if queryset.exists():
                 serializer = RiskMapping_Serializer(queryset, many=True)
                 return Response(serializer.data)
            else:
                    return Response({'detail': 'No related control records found.'}, status=status.HTTP_404_NOT_FOUND)
            

class TestingViewSet(viewsets.ModelViewSet):
    queryset = AUDITFILE.objects.all()
    serializer_class = AuditFile_Serializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

        
class WorkpapersViewSet(viewsets.ModelViewSet):
    serializer_class = AuditFile_Serializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Extract the parameters from the URL
        app_name = self.kwargs.get('APP_NAME')
        company_id = self.kwargs.get('COMPANY_ID')

        # Filter the queryset based on the parameters
        queryset = AUDITFILE.objects.filter(APP_NAME=app_name, COMPANY_ID=company_id)
        
        return queryset
    
    def list(self, request, *args, **kwargs):
            queryset = self.get_queryset()
            if queryset.exists():
                 serializer = AuditFile_Serializer(queryset, many=True)
                 return Response(serializer.data)
            else:
                    return Response({'detail': 'No related records found.'}, status=status.HTTP_404_NOT_FOUND)


def sanitize_html(content):
    # Convert ALLOWED_TAGS frozenset to a set, add new tags, then convert back to a frozenset if needed
    allowed_tags = set(bleach.sanitizer.ALLOWED_TAGS) | {'p', 'br', 'strong', 'em'}
    sanitized_content = bleach.clean(content, tags=allowed_tags, strip=True)
    return sanitized_content

class ProcedureListViewSet(viewsets.ModelViewSet):
    PROCEDURE_DETAILS = serializers.CharField()

    queryset = TEST_PROCEDURES.objects.all()
    serializer_class = ProcedureList_Serializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'CONTROL_ID'

    def perform_create(self, serializer):
        data = self.request.data

        sanitized_data = {
            'DESIGN_PROCEDURES': sanitize_html(data.get('DESIGN_PROCEDURES', '')),
            'INTERIM_PROCEDURES': sanitize_html(data.get('INTERIM_PROCEDURES', '')),
            'ROLLFORWARD_PROCEDURES': sanitize_html(data.get('ROLLFORWARD_PROCEDURES', '')),
            'FINAL_PROCEDURES': sanitize_html(data.get('FINAL_PROCEDURES', '')),
        }

        serializer.save(**sanitized_data)

    def perform_update(self, serializer):
        data = self.request.data

        sanitized_data = {
            'DESIGN_PROCEDURES': sanitize_html(data.get('DESIGN_PROCEDURES', '')),
            'INTERIM_PROCEDURES': sanitize_html(data.get('INTERIM_PROCEDURES', '')),
            'ROLLFORWARD_PROCEDURES': sanitize_html(data.get('ROLLFORWARD_PROCEDURES', '')),
            'FINAL_PROCEDURES': sanitize_html(data.get('FINAL_PROCEDURES', '')),
        }

        serializer.save(**sanitized_data)

class WorkPaperDetailsViewSet(viewsets.ModelViewSet):
    queryset = WORKPAPER_DETAILS.objects.all()
    serializer_class = WorkpaperDetails_Serializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'CONTROL_ID'