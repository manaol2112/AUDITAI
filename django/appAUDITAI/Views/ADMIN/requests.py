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
from django.http import JsonResponse
from uuid import UUID

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

class ApproveAccessRequestView(APIView):
    
    def post(self, request, *args, **kwargs):

        request_id = request.data.get('id')  # Extract 'id'
        status = request.data.get('STATUS')  # Extract 'STATUS'
        token = request.data.get('TOKEN')  # Extract 'TOKEN'
        
        if not token:
            return JsonResponse({'error': 'Token is required'}, status=400)
        
        try:
            # Find the token in the database
            approval_token = ApprovalToken.objects.get(token=token)
            
            # Check if the token is expired
            if approval_token.is_expired():
                return JsonResponse({'error': 'Token has expired'}, status=400)
            
            # Check if the token has already been used
            if approval_token.is_used:
                return JsonResponse({'error': 'Token is invalid or has already been used'}, status=400)
            
            # Validate that the request ID matches
            if approval_token.request.id != UUID(request_id):
                return JsonResponse({'error': 'Invalid request'}, status=400)
            
            # Proceed with the approval action
            access_request = approval_token.request
            access_request.STATUS = 'Approved'  
            access_request.save()

            # Update the request status
            status = ACCESSREQUEST.objects.get(id=request_id)
            if status:
                status.STATUS = "Approved"
                status.save()
                
            # Update the approver's approval date
            approval = ACCESSREQUESTAPPROVER.objects.get(REQUEST_ID_id=request_id)
            if approval:
                approval.DATE_APPROVED = timezone.now()
                approval.save()

            # Mark the token as used
            approval_token.is_used = True
            approval_token.save()

            return JsonResponse({'message': 'Request approved successfully'}, status=200)
        
        except ApprovalToken.DoesNotExist:
            return JsonResponse({'error': 'Invalid or expired token'}, status=400)
