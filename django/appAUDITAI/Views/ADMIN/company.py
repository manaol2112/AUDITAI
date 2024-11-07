from rest_framework import viewsets
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from appAUDITAI.models import COMPANY
from appAUDITAI.Views.UTILS.serializers import CompanySerializer


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = COMPANY.objects.all()
    serializer_class = CompanySerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

class CompanyViewSetByID(RetrieveAPIView):
    queryset = COMPANY.objects.all()
    serializer_class = CompanySerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    lookup_field = 'companyID'
