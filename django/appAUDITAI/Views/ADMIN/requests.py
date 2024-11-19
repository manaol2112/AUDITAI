from rest_framework import viewsets
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from appAUDITAI.models import RequestIDCounter
from appAUDITAI.Views.UTILS.serializers import CounterSerializer
from appAUDITAI.Views.UTILS.serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import F
from rest_framework.permissions import AllowAny
from appAUDITAI.models import *


class GenerateRequestIDView(APIView):

    serializer_class = CounterSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny]
    

    def get(self, request, *args, **kwargs):
        # Retrieve the RequestIDCounter object or create it if it doesn't exist
        counter_obj, created = RequestIDCounter.objects.get_or_create(pk=1)

        # If the object already exists, increment the counter in a thread-safe way
        if not created:
            counter_obj.counter = F('counter') + 1
            counter_obj.save()  # This performs the database update
        
        # Refresh the object to get the updated value
        counter_obj.refresh_from_db()

        # Return the updated counter
        context = {
            'request_id_counter': counter_obj.counter,
        }

        return Response(context)
    

class AccessRequestViewSet(viewsets.ModelViewSet):
    queryset = ACCESSREQUEST.objects.all()
    serializer_class = AccessRequestSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny]


class AccessRequestApprovalViewSet(viewsets.ModelViewSet):
    queryset = ACCESSREQUESTAPPROVER.objects.all()
    serializer_class = AccessRequestApproverSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny]

