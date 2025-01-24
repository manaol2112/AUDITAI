from django.http import JsonResponse
from ldap3 import Server, Connection, ALL, MODIFY_REPLACE
from datetime import datetime, timedelta
from rest_framework import viewsets
from appAUDITAI.Views.UTILS.serializers import *
from rest_framework.generics import RetrieveAPIView,  ListAPIView
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


class NetworkAuthViewSet(viewsets.ModelViewSet):
    queryset = NETWORK_AUTH.objects.all()
    serializer_class = NetworkAuthSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated, isAdministrator]
    lookup_field = "id"

# Function to query and display user statuses
def connect_ldap(request):
    # Define your AD server details
    ldap_server = 'ldap://10.0.0.246'  # Correct LDAP server URL format with the protocol
    ldap_port = 389  # Default LDAP port (no need to include the port in URL if using default)
    base_dn = 'DC=audit-ai,DC=net'  # Your Base DN
    bind_dn = 'CN=Administrator,CN=Users,DC=audit-ai,DC=net'  # Bind DN (Admin account)
    pw = ''  # Password for the bind DN

    # Connect to the server
    server = Server(ldap_server, port=ldap_port, get_info=ALL)
    conn = Connection(server, user=bind_dn, password=pw, auto_bind=True)

    # Perform a search (this example searches for all users)
    conn.search(base_dn, '(objectClass=user)', attributes=['cn', 'sAMAccountName', 'userAccountControl', 'lastLogonTimestamp'])

    # Collect the results into a list of dictionaries with account status and last login
    results = []
    for entry in conn.entries:
        # Check if the account is active or inactive
        user_status = 'Active' if int(entry.userAccountControl.value) & 2 == 0 else 'Inactive'

        # Process last logon timestamp (convert from LDAP timestamp to datetime)
        last_logon = entry.lastLogonTimestamp.value if 'lastLogonTimestamp' in entry else None
        if last_logon:
            # Check if the value is already a datetime object
            if isinstance(last_logon, datetime):
                # If it's already a datetime object, format it directly
                last_logon = last_logon.strftime('%Y-%m-%d %H:%M:%S')
            else:
                # Otherwise, process it as an integer (LDAP timestamp)
                last_logon = datetime(1601, 1, 1) + timedelta(microseconds=last_logon / 10)
                last_logon = last_logon.strftime('%Y-%m-%d %H:%M:%S')
        else:
            last_logon = 'Never'

        # Append the results for each entry
        results.append({
            'cn': entry.cn.value,
            'sAMAccountName': entry.sAMAccountName.value,
            'status': user_status,
            'lastLogon': last_logon
        })

    # Close the connection
    conn.unbind()

    # Return the results in a JSON response
    return JsonResponse(results, safe=False)

# Function to deactivate a specific user
def deactivate_user(request):
    # Define your AD server details
    ldap_server = 'ldap://10.0.0.22'  # Correct LDAP server URL format with the protocol
    ldap_port = 389  # Default LDAP port (no need to include the port in URL if using default)
    base_dn = 'DC=auditai,DC=net'  # Your Base DN
    bind_dn = 'CN=Administrator,CN=Users,DC=auditai,DC=net'  # Bind DN (Admin account)
    pw = ''  # Password for the bind DN

    # The username of the account you want to deactivate
    user_to_deactivate = 'test'  # Change this value to the user you want to deactivate

    # Connect to the server
    server = Server(ldap_server, port=ldap_port, get_info=ALL)
    conn = Connection(server, user=bind_dn, password=pw, auto_bind=True)

    # Perform a search for the specific user to deactivate
    conn.search(base_dn, f'(sAMAccountName={user_to_deactivate})', attributes=['cn', 'sAMAccountName', 'userAccountControl'])

    # Check if the user was found
    if conn.entries:
        entry = conn.entries[0]
        user_status = 'Active' if int(entry.userAccountControl.value) & 2 == 0 else 'Inactive'

        # If the account is active, deactivate it by modifying the userAccountControl
        if user_status == 'Active':
            # Set the userAccountControl value to disable the account (bitwise OR with 0x2 to disable)
            new_user_account_control = int(entry.userAccountControl.value) | 2
            conn.modify(entry.entry_dn, {'userAccountControl': [(MODIFY_REPLACE, [new_user_account_control])]})

            # Check if the modification was successful
            if conn.result['result'] == 0:
                message = f"User {user_to_deactivate} has been successfully deactivated."
            else:
                message = f"Failed to deactivate user {user_to_deactivate}: {conn.result}"

        else:
            message = f"User {user_to_deactivate} is already inactive."
    else:
        message = f"User {user_to_deactivate} not found."

    # Close the connection
    conn.unbind()

    # Return a success or error message in a JSON response
    return JsonResponse({'message': message})
