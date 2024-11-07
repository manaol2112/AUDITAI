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


class PasswordPolicyByApp(viewsets.ModelViewSet):
    queryset = APP_PASSWORD.objects.all()
    serializer_class = AppPasswordSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'APP_NAME'

    def get_queryset(self):
        app_id = self.kwargs.get(self.lookup_field)
        set_password = APP_PASSWORD.objects.filter(APP_NAME = app_id)