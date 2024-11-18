from rest_framework import viewsets
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from appAUDITAI.models import HR_RECORD
from appAUDITAI.Views.UTILS.serializers import HRSerializer


class HRViewSetbyEmail(viewsets.ModelViewSet):
    queryset = HR_RECORD.objects.all()
    serializer_class = HRSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'EMAIL_ADDRESS'