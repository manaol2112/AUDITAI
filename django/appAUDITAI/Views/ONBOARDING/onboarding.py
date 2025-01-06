from rest_framework import viewsets
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from appAUDITAI.models import ALPHAREGISTRATION
from appAUDITAI.Views.UTILS.serializers import RegistrationSerializer


class RegistrationViewSet(viewsets.ModelViewSet):
    queryset = ALPHAREGISTRATION.objects.all()
    serializer_class = RegistrationSerializer


class RegistrationViewSetByID(RetrieveAPIView):
    queryset = ALPHAREGISTRATION.objects.all()
    serializer_class = RegistrationSerializer
    lookup_field = 'id'
