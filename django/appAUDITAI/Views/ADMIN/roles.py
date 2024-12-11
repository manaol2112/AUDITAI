from rest_framework import viewsets
from appAUDITAI.Views.UTILS.serializers import *
from rest_framework.generics import RetrieveAPIView
from django.contrib.auth.models import *
from rest_framework.decorators import action
from rest_framework import viewsets, status
from rest_framework.response import Response
from appAUDITAI.Views.UTILS.serializers import CompanySerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.exceptions import NotFound

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class GroupViewSetByID(RetrieveAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    lookup_field = 'roleId'
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

#Permission
class PermissionViewSet(viewsets.ModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class PermissionViewSetByID(viewsets.ModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    lookup_field = 'roleId'  
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

#User
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'username'
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserViewSetbyID(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'username'
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated] 

class USERROLESViewSet(viewsets.ModelViewSet):
    queryset = USERROLES.objects.all()
    serializer_class = USERROLESSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated] 
    lookup_field = 'USERNAME'

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class USERROLESViewSetbyID(viewsets.ModelViewSet):
    queryset = USERROLES.objects.all()
    serializer_class = USERROLESSerializer
    lookup_field = 'USERNAME'  
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
class USERROLESViewSetbyCompany(ListAPIView):
    queryset = USERROLES.objects.all()
    serializer_class = USERROLESSerializer
    lookup_field = 'COMPANY_ID'  
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        company_id = self.kwargs['COMPANY_ID']
        return USERROLES.objects.filter(COMPANY_ID=company_id)

class SystemSettingViewSet(viewsets.ModelViewSet):
    queryset = PASSWORDCONFIG.objects.all()
    serializer_class = SystemSettingSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    

class SystemSettingViewSetbyID(viewsets.ModelViewSet):
    queryset = PASSWORDCONFIG.objects.all()
    serializer_class = SystemSettingSerializer
    lookup_field = 'id'
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated] 


class RoleOwnerViewSet(viewsets.ModelViewSet):
    queryset = ROLE_OWNERS.objects.all()
    serializer_class = RoleOwnerSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

class RoleOwnerViewSetbyID(ListAPIView):
    queryset = ROLE_OWNERS.objects.all()
    serializer_class = RoleOwnerSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get APP_NAME and ROLE_NAME from URL parameters (kwargs)
        app_name = self.kwargs.get('APP_NAME')
        role_name = self.kwargs.get('ROLE_NAME')
        
        if not app_name or not role_name:
            raise NotFound("Both APP_NAME and ROLE_NAME must be provided.")

        try:
            # Filter the queryset based on the provided parameters
            return self.queryset.filter(ROLE_NAME=role_name, APP_NAME=app_name)
        except ROLE_OWNERS.DoesNotExist:
            raise NotFound("Role owner with the given ROLE_NAME and APP_NAME not found.")
    
