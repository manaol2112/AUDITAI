from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content
from django.conf import settings
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from appAUDITAI.models import HR_RECORD
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.exceptions import ObjectDoesNotExist
from appAUDITAI.models import *
from uuid import UUID
import secrets
from datetime import timedelta
from django.utils import timezone

SENDGRID_API_KEY = settings.SENDGRID_API_KEY

class SubmitRequestView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def generate_approval_token(self, request_id, approver):
        token = secrets.token_urlsafe(64)  # Create a random token
        expiration_time = timezone.now() + timedelta(hours=24)  # Token expires in 24 hours
        
        approval_token = ApprovalToken(
            request_id=request_id,
            approver=approver,
            token=token,
            expires_at=expiration_time
        )
        approval_token.save()
        return token

    def send_email(self, to_email, subject, body):

        
       
        try:
            # Create the SendGrid client
        
            sg = SendGridAPIClient(api_key=SENDGRID_API_KEY)
            

            # Define from and to email addresses
            from_email = Email('manaol2112@gmail.com')  # Replace with your verified SendGrid sender email
            to_email_obj = To(to_email)  # SendGrid To object, which encapsulates the email address
            content = Content("text/html", body)
            mail = Mail(from_email, to_email_obj, subject, content)

            # Send the email
            response = sg.send(mail)

            # Debug output
            print(f"SendGrid Response Status: {response.status_code}")
            print(f"SendGrid Response Headers: {response.headers}")

            if response.status_code != 202:
                print(f"Failed to send email. Response body: {response.body}")
                return None

            # Log the successful email delivery
            print(f"Email sent to {to_email_obj.email} with status code {response.status_code}")
            return response

        except Exception as e:
            print(f"Error sending email: {str(e)}")
            return None

    def post(self, request, *args, **kwargs):
        data = request.data
        request_id = data.get('REQUEST_ID')
        approvers = data.get('APPROVER')

        if not request_id or not approvers:
            return Response({'error': 'REQUEST_ID and APPROVER are required.'}, status=status.HTTP_400_BAD_REQUEST)

        if not isinstance(approvers, list):
            return Response({'error': 'APPROVER must be a list.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            approvers_emails = HR_RECORD.objects.filter(id__in=approvers)
            if not approvers_emails:
                return Response({'error': 'No approvers found with the provided IDs.'}, status=status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist:
            return Response({'error': 'Error fetching approvers from the database.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        request_details = ACCESSREQUEST.objects.get(id = request_id)

        if request_details.STATUS == 'Approved':

            if request_details: 
                formatted_roles = request_details.ROLES.replace(",", ", ")
                requestor_uuids = request_details.REQUESTOR.split(',')

            system_name = APP_LIST.objects.get(id=request_details.APP_NAME)

            uuids = [UUID(uuid_str) for uuid_str in requestor_uuids]

            role_assignees = HR_RECORD.objects.filter(id__in=uuids)

            role_assignee_names = [f"{assignee.FIRST_NAME} {assignee.LAST_NAME}" for assignee in role_assignees]

            role_assignee_names_str = ", ".join(role_assignee_names)

            for approver in approvers_emails:

                subject = f"ACTION NEEDED: APPROVE OR REJECT ACCESS REQUEST {request_details.REQUEST_ID}"
                
                body = f"""
                <html>
                        <body style="font-family: Arial, sans-serif; color: #333333;">
                            <p>Dear {approver.FIRST_NAME} {approver.LAST_NAME},</p>

                            <p>We would like to inform you that the access request you have submitted has been processed by the system and your corresponding approval has been recorded. Please find the details of the access request approval for your reference:</p>
                            
                            <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd; width: 30%; font-weight: bold;">Request ID</td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">{request_details.REQUEST_ID}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd; width: 30%; font-weight: bold;">Entity:</td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">{system_name.COMPANY_ID}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd; width: 30%; font-weight: bold;">System Name:</td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">{system_name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Role Assignee</td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">{role_assignee_names_str} </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Role Requested</td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">{formatted_roles}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Date Approved</td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">{request_details.DATE_REQUESTED}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Status</td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">{request_details.STATUS}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Comments</td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">{request_details.COMMENTS}</td>
                                </tr>
                            </table>

                            <p>If you have have not authorized the approval of this access request, please do not hesitate to contact the admin team at your convenience.</p>

                            <p>Thank you for your attention to this request.</p>

                            <br><br>
                            <p>Best regards,</p>
                            <p><strong>Audit-AI</strong></p>
                        </body>
                    </html>

                """
                
                # Send email to the approver
                self.send_email(approver.EMAIL_ADDRESS, subject, body)

            return Response({'message': 'Request submitted successfully and emails sent to approvers.'}, status=status.HTTP_200_OK)

        elif request_details.STATUS == 'Pending Approval':

            if request_details: 
                formatted_roles = request_details.ROLES.replace(",", ", ")
                requestor_uuids = request_details.REQUESTOR.split(',')

            system_name = APP_LIST.objects.get(id=request_details.APP_NAME)

            uuids = [UUID(uuid_str) for uuid_str in requestor_uuids]

            role_assignees = HR_RECORD.objects.filter(id__in=uuids)

            role_assignee_names = [f"{assignee.FIRST_NAME} {assignee.LAST_NAME}" for assignee in role_assignees]

            role_assignee_names_str = ", ".join(role_assignee_names)

            

            for approver in approvers_emails:

                token = self.generate_approval_token(request_id, approver)

                subject = f"ACTION NEEDED: APPROVE OR REJECT ACCESS REQUEST {request_details.REQUEST_ID}"
                
                body = f"""
                <html>
                        <body style="font-family: Arial, sans-serif; color: #333333;">
                            <p>Dear {approver.FIRST_NAME} {approver.LAST_NAME},</p>

                            <p>We would like to inform you that there is a new access request pending your approval. Please find the details of the request below:</p>
                            
                            <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd; width: 30%; font-weight: bold;">Request ID</td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">{request_details.REQUEST_ID}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd; width: 30%; font-weight: bold;">Entity:</td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">{system_name.COMPANY_ID}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd; width: 30%; font-weight: bold;">System Name:</td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">{system_name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Role Assignee</td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">{role_assignee_names_str} </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Role Requested</td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">{formatted_roles}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Date Requested</td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">{request_details.DATE_REQUESTED}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Status</td>
                                <td style="padding: 8px; border: 1px solid #ddd;">{request_details.STATUS}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Comments</td>
                                    <td style="padding: 8px; border: 1px solid #ddd;">{request_details.COMMENTS}</td>
                                </tr>
                            </table>

                            <p style="margin-top: 20px;">To proceed with the request, please select one of the following options:</p>

                            <table style="margin-top: 20px;">
                                <tr>
                                    <td style="padding-right: 10px;">
                                        <a href="http://localhost:3000/accessrequest/approval/{request_id}/?token={token}" 
                                        style="background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 14px; display: inline-block;">
                                            Approve
                                        </a>
                                    </td>
                                    <td>
                                        <a href="http://yourdomain.com/reject/{request_details.REQUEST_ID}" 
                                        style="background-color: #dc3545; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 14px; display: inline-block;">
                                            Reject
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p>If you have any questions or require further assistance, please do not hesitate to contact the admin team at your convenience.</p>

                            <p>Thank you for your attention to this request.</p>

                            <br><br>
                            <p>Best regards,</p>
                            <p><strong>Audit-AI</strong></p>
                        </body>
                    </html>

                """
                
                # Send email to the approver
                self.send_email(approver.EMAIL_ADDRESS, subject, body)

            return Response({'message': 'Request submitted successfully and emails sent to approvers.'}, status=status.HTTP_200_OK)
