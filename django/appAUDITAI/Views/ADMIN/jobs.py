from auditai.celery import app
from appAUDITAI.models import *
from datetime import datetime
import logging
from io import StringIO
import paramiko
import csv
from django.utils.timezone import make_aware, get_current_timezone
from rest_framework import viewsets, status
from ldap3 import Server, Connection, ALL, MODIFY_REPLACE

def parse_date(date_str, date_formats):
    for date_format in date_formats:
        try:
            return datetime.strptime(date_str, date_format)
        except ValueError:
            pass
    return None  # Return None if no formats matched

@app.task
def fetch_user_data():

    logger = logging.getLogger('auditai.celery')

    # Get current day and time
    current_day = datetime.now().strftime('%A').upper() 
    current_time = datetime.now().time()

    date_formats = ["%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%Y%m%d", "%m/%d/%y"]

    # Dynamically build the filter condition for the correct day
    filter_conditions = {
        # current_day: True,  # e.g., MONDAY=True
        # 'SCHEDULE_TIME__lte': current_time,  # Only jobs scheduled before or at the current time
        # 'STATUS': 'Scheduled'  # Only jobs with status 'Scheduled'
        'id__isnull': False  # Ensure the 'id' is not null
    }

    # Pre-fetch the jobs to run and the corresponding SFTP configurations
    jobs_to_run = APP_JOB_PULL.objects.filter(**filter_conditions)

    if not jobs_to_run:
        logger.info("No jobs found to run at this time.")
        return

    # Extract all app names at once for better performance
    app_names = [job.APP_NAME for job in jobs_to_run]
    
    # Fetch all SFTP configurations for the app names we're processing
    sftp_configs = APP_USER_SFTP.objects.filter(APP_NAME__in=app_names)

    # Create a dictionary for quick lookup of SFTP config by app name
    sftp_dict = {config.APP_NAME: config for config in sftp_configs}

    # Iterate over jobs and process each one
    for job in jobs_to_run:
        try:
            sftp = sftp_dict.get(job.APP_NAME)

            if sftp:
                # Prepare connection details for the specific app
                app_name = sftp.APP_NAME
                hostname = sftp.HOST_NAME
                port = int(sftp.PORT) if sftp.PORT and sftp.PORT.isdigit() else 22
                username = sftp.SFTP_USERNAME
                password = sftp.SFTP_PW_HASHED
                remote_file_path = sftp.SFTP_DIRECTORY  # This should be unique per app

                # Set up the SSH connection
                with paramiko.SSHClient() as ssh_client:
                    try:
                        transport = paramiko.Transport((hostname, port))
                        transport.connect(username=username, password=password)

                        # Open an SFTP session
                        with paramiko.SFTPClient.from_transport(transport) as sftp_client:
                            logger.info(f"Successfully connected to SFTP server of {app_name} at {hostname}. Preparing to query {remote_file_path}.")

                            # List all files in the directory for this specific app
                            files = sftp_client.listdir_attr(remote_file_path)

                            # Filter out files that aren't CSV (optional, but a good idea)
                            csv_files = [file for file in files if file.filename.endswith('.csv')]

                            # Sort the files by their modification time (newest first)
                            csv_files.sort(key=lambda x: x.st_mtime, reverse=True)  # Sort by modification time

                            if csv_files:
                                # Get the latest file for this app
                                latest_file = csv_files[0].filename
                                file_path = os.path.join(remote_file_path, latest_file)  # Full path to the file

                                logger.info(f'File name of the file that will be processed for {app_name}: {latest_file}')

                                with sftp_client.open(file_path, 'r') as remote_file:
                                    file_content = remote_file.read().decode('utf-8-sig')

                                    csv_file = StringIO(file_content)
                                    csv_reader = csv.reader(csv_file)

                                    # Read the header (skip it)
                                    header = next(csv_reader)

                                    # Count rows
                                    row_count = sum(1 for _ in csv_reader)
                                    logger.info(f'This is the row count {row_count}')

                                    # Go back to the beginning of the CSV reader after counting rows
                                    csv_file.seek(0)
                                    csv_reader = csv.reader(csv_file)  # Re-initialize csv_reader

                                    # Skip the header again, since it's already read
                                    next(csv_reader)

                                    # Process rows
                                    for row in csv_reader:
        
                                        if not row:  # Skip empty rows
                                            continue

                                        try:
                                                logger.info(f'Processing {row[1]} for upload')

                                                DATE_GRANTED = row[6]
                                                DATE_REVOKED = row[7]
                                                LAST_LOGIN = row[8]

                                                # Parse dates, fallback to default if invalid
                                                DATE_GRANTED = parse_date(DATE_GRANTED, date_formats) if DATE_GRANTED else datetime(1900, 1, 1)
                                                DATE_REVOKED = parse_date(DATE_REVOKED, date_formats) if DATE_REVOKED else datetime(1900, 1, 1)
                                                LAST_LOGIN = parse_date(LAST_LOGIN, date_formats) if LAST_LOGIN else datetime(1900, 1, 1)

                                                # Ensure dates are timezone-aware
                                                tz = get_current_timezone()
                                                today = datetime.now()

                                                DATE_GRANTED = make_aware(DATE_GRANTED, timezone=tz)
                                                DATE_REVOKED = make_aware(DATE_REVOKED, timezone=tz)
                                                LAST_LOGIN = make_aware(LAST_LOGIN, timezone=tz)
                                                LAST_UPDATED = make_aware(today, timezone=tz )

                                                # Prepare user data
                                                user_record_data = {
                                                    'APP_NAME': sftp.APP_NAME,
                                                    'USER_ID': row[0],
                                                    'EMAIL_ADDRESS': row[1],
                                                    'FIRST_NAME': row[2],
                                                    'LAST_NAME': row[3],
                                                    'ROLE_NAME': row[4],
                                                    'STATUS': row[5],
                                                    'DATE_GRANTED': DATE_GRANTED,
                                                    'DATE_REVOKED': DATE_REVOKED,
                                                    'LAST_LOGIN': LAST_LOGIN,
                                                    'LAST_UPDATED':LAST_UPDATED
                                                }

                                                # Update or create the record in the database
                                                user_record_data, created = APP_RECORD.objects.update_or_create(
                                                    APP_NAME=sftp.APP_NAME,
                                                    USER_ID=row[0],
                                                    EMAIL_ADDRESS=row[1],
                                                    ROLE_NAME=row[4],
                                                    defaults=user_record_data
                                                )

                                                if created:
                                                    logger.info(f'Created Record for {row[1]}')
                                                else:
                                                    logger.info(f'Updated Record for {row[1]}')

                                        except Exception as e:
                                                logger.error(f"Error processing row {row[1]}: {e}")
                                                continue  # Skip to the next row if this one fails

                                    app_import_log = APP_JOB_USER_LOG.objects.create(
                                            APP_NAME=sftp.APP_NAME,
                                            JOB_NAME=job.JOB_NAME,
                                            JOB_DATE=datetime.now(),
                                            JOB_FILE_NAME=latest_file,
                                            SOURCE_LINE_COUNT=row_count,
                                            JOB_COMPLETE=True,
                                            UPLOADED_BY='automated_job'
                                        )

                                    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                                    logger.info(f'Job import for {sftp.APP_NAME} with the job name {job.JOB_NAME} has been successfully completed on {current_time}')

                            else:
                                logger.warning(f"No CSV files found in {remote_file_path} for {app_name}.")


                    except paramiko.AuthenticationException:
                        logger.error(f"Authentication failed when connecting to {hostname}. Check your username/password.")
                    except paramiko.SSHException as e:
                        logger.error(f"Could not establish SSH connection to {hostname}: {e}")
                    except Exception as e:
                        logger.error(f"An error occurred: {e}")

        except APP_USER_SFTP.DoesNotExist:
            # If no SFTP configuration exists for this job, log it and skip
            logger.warning(f"App {job.APP_NAME} does not exist in the SFTP configuration. Skipping job.")
        
        except Exception as e:
            # Catch any other exceptions and log them
            logger.error(f"An unexpected error occurred while processing job {job.APP_NAME}: {str(e)}")
        
        # Log job execution details
        logger.info(f"Running job: {job.JOB_NAME} scheduled for {current_day} at {current_time}")


@app.task
def fetch_hr_data():
    logger = logging.getLogger('auditai.celery')

    logger.info(f"Running HR Data Extract")

    current_day = datetime.now().strftime('%A').upper() 
    current_time = datetime.now().time()

    date_formats = ["%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y", "%Y%m%d", "%m/%d/%y"]

    try:
        sftp = HR_LIST_SFTP.objects.get(id__isnull=False)

        if sftp:
            # Prepare connection details for the specific app
            hostname = sftp.HOST_NAME
            port = int(sftp.PORT) if sftp.PORT and sftp.PORT.isdigit() else 22
            username = sftp.SFTP_USERNAME
            password = sftp.SFTP_PW_HASHED
            remote_file_path = sftp.SFTP_DIRECTORY  # This should be unique per app

            with paramiko.SSHClient() as ssh_client:
                try:
                    transport = paramiko.Transport((hostname, port))
                    transport.connect(username=username, password=password)
    
                            # Open an SFTP session
                    with paramiko.SFTPClient.from_transport(transport) as sftp_client:
                        logger.info(f"Successfully connected to HR SFTP server at {hostname}. Preparing to query {remote_file_path}.")
                        # List all files in the directory for this specific app
                        files = sftp_client.listdir_attr(remote_file_path)

                        # Filter out files that aren't CSV (optional, but a good idea)
                        csv_files = [file for file in files if file.filename.endswith('.csv')]

                        # Sort the files by their modification time (newest first)
                        csv_files.sort(key=lambda x: x.st_mtime, reverse=True)  # Sort by modification time

                        if csv_files:
                                # Get the latest file for this app
                                latest_file = csv_files[0].filename
                                file_path = os.path.join(remote_file_path, latest_file)  # Full path to the file

                                with sftp_client.open(file_path, 'r') as remote_file:
                                    file_content = remote_file.read().decode('utf-8-sig')

                                    csv_file = StringIO(file_content)
                                    csv_reader = csv.reader(csv_file)

                                    # Read the header (skip it)
                                    header = next(csv_reader)

                                    # Count rows
                                    row_count = sum(1 for _ in csv_reader)
                                    logger.info(f'This is the row count {row_count}')

                                    # Go back to the beginning of the CSV reader after counting rows
                                    csv_file.seek(0)
                                    csv_reader = csv.reader(csv_file)  # Re-initialize csv_reader

                                    # Skip the header again, since it's already read
                                    next(csv_reader)

                                    # Process rows
                                    for row in csv_reader:
                                        if not row:  # Skip empty rows
                                            continue
                                        HIRE_DATE = row[8]
                                        REHIRE_DATE = row[10]
                                        TERMINATION_DATE = row[11]

                                        # Parse dates or assign default values
                                        HIRE_DATE = parse_date(HIRE_DATE, date_formats) if HIRE_DATE else datetime(1900, 1, 1)
                                        REHIRE_DATE = parse_date(REHIRE_DATE, date_formats) if REHIRE_DATE else datetime(1900, 1, 1)
                                        TERMINATION_DATE = parse_date(TERMINATION_DATE, date_formats) if TERMINATION_DATE else datetime(1900, 1, 1)

                                        hr_record_data = {
                                            'COMPANY_ID': row[0],
                                            'USER_ID': row[1],
                                            'EMAIL_ADDRESS': row[2],
                                            'FIRST_NAME': row[3],
                                            'LAST_NAME': row[4],
                                            'JOB_TITLE': row[5],
                                            'DEPARTMENT': row[6],
                                            'MANAGER': row[7],
                                            'HIRE_DATE': HIRE_DATE,
                                            'EMP_TYPE': row[9],
                                            'REHIRE_DATE': REHIRE_DATE,
                                            'TERMINATION_DATE': TERMINATION_DATE,
                                            'STATUS': row[12],
                                            'LAST_REFRESHED': datetime.now()
                                        }

                                        # Try to get an existing record or create a new one
                                        hr_record, created = HR_RECORD.objects.update_or_create(
                                            USER_ID=row[1],
                                            EMAIL_ADDRESS=row[2],
                                            defaults=hr_record_data  # Data to update or create
                                        )

                                        # If the record already existed, update its fields
                                        if not created:
                                            for field, value in hr_record_data.items():
                                                setattr(hr_record, field, value)
                                            hr_record.save()                            

                                        hr_import_log, created = HR_RECORD_IMPORT_LOG.objects.update_or_create(
                                        JOB_NAME='FETCH_HR_DATA',
                                        IMPORT_DATE=datetime.now(),
                                        FILE_NAME=latest_file,
                                        SOURCE_LINE_COUNT=row_count,
                                        JOB_COMPLETE=True,
                                        UPLOADED_BY= 'automated_job'
                                        )

                                    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                                    logger.info(f'Job import for HR Data has been successfully completed on {current_time}')
                        else:
                            logger.warning(f"No CSV files found in {remote_file_path}.")

                             
                except paramiko.AuthenticationException:
                    logger.error(f"Authentication failed when connecting to {hostname}. Check your username/password.")
                except paramiko.SSHException as e:
                    logger.error(f"Could not establish SSH connection to {hostname}: {e}")
                except Exception as e:
                    logger.error(f"An error occurred: {e}")
                                     
    except APP_USER_SFTP.DoesNotExist:
            # If no SFTP configuration exists for this job, log it and skip
            logger.warning(f"SFTP configuration for HR record is not yet configured. Skipping job.")
        
    except Exception as e:
            # Catch any other exceptions and log them
            logger.error(f"An unexpected error occurred while processing HR job: {str(e)}")


@app.task
def deactivate_ad_account():
    # Define your AD server details
    logger = logging.getLogger('auditai.celery')

    logger.info(f"Running AD Termination")

    try:
        ldap = NETWORK_AUTH.objects.get(id__isnull=False)

        if ldap:
            ldap_server = ldap.LDAP_SERVER  # Correct LDAP server URL format with the protocol
            ldap_port = int(ldap.LDAP_PORT) if ldap.LDAP_PORT and ldap.LDAP_PORT.isdigit() else 389
            base_dn = ldap.BASE_DN  # Your Base DN
            bind_dn = ldap.BIND_DN  # Bind DN (Admin account)
            password = ldap.LDAP_PW_HASHED

            # Fetch all users with 'Inactive' status from HR_RECORD
            inactive_users_in_system = HR_RECORD.objects.filter(STATUS__iexact='inactive')

            logger.info('Inactive users in HR REcord', inactive_users_in_system)

            # List of sAMAccountNames to query in AD (to check if they're still active)
            email_addresses = [user.EMAIL_ADDRESS for user in inactive_users_in_system]

            # Connect to the AD server
            server = Server(ldap_server, port=ldap_port, get_info=ALL)
            conn = Connection(server, user=bind_dn, password=password, auto_bind=True)

            # Log connection success
            logger.info(f"Successfully connected to the AD server at {ldap_server}:{ldap_port}")

            # Fetch all users that are active in AD (objectClass=user and userAccountControl active)
            conn.search(base_dn, '(objectClass=user)', attributes=['sAMAccountName', 'userAccountControl', 'memberOf'])

            # Create a set of active users in AD
            active_users_in_ad = {entry.sAMAccountName.value for entry in conn.entries}

            logger.info(active_users_in_ad)

            # Log the matched users
            matched_users = [user for user in inactive_users_in_system if user.USER_ID in active_users_in_ad]
            logger.info(f"Found {len(matched_users)} matched inactive users in the system who are active in AD.")

            # Filter out users that are inactive in the system but active in AD
            users_to_deactivate = matched_users

            # For each user to deactivate, modify their status in AD
            for user in users_to_deactivate:

                user_to_deactivate = user.USER_ID

                # Search for the user in AD by sAMAccountName
                conn.search(base_dn, f'(sAMAccountName={user_to_deactivate})', attributes=['userAccountControl'])

                # If the user exists in AD and is active, deactivate them
                if conn.entries:
                    entry = conn.entries[0]
                    user_status = 'Active' if int(entry.userAccountControl.value) & 2 == 0 else 'Inactive'

                    # If the user is active in AD, deactivate them by setting the disabled bit
                    if user_status == 'Active':
                        new_user_account_control = int(entry.userAccountControl.value) | 2
                        conn.modify(entry.entry_dn, {'userAccountControl': [(MODIFY_REPLACE, [new_user_account_control])]})

                        # Check if the modification was successful
                        if conn.result['result'] == 0:
                            message = f"User {user_to_deactivate} has been successfully deactivated in AD."
                            logger.info(message)  # Log successful deactivation
                        else:
                            message = f"Failed to deactivate user {user_to_deactivate}: {conn.result}"
                            logger.error(message)  # Log failure message

                    else:
                        message = f"User {user_to_deactivate} is already inactive in AD."
                        logger.info(message)  # Log if user is already inactive

                else:
                    message = f"User {user_to_deactivate} not found in AD."
                    logger.error(message)  # Log user not found

            # Close the connection
            conn.unbind()

    except NETWORK_AUTH.DoesNotExist:
        logger.warning(f"SFTP configuration for HR record is not yet configured. Skipping job.")
    except Exception as e:
        logger.error(f"An error occurred: {str(e)}")




# @app.task
# def deactivate_user(request):
#     # Define your AD server details
#     logger = logging.getLogger('auditai.celery')
#     logger.info(f"Running AD Termination")

#     try:
#         ldap = NETWORK_AUTH.objects.get(id__isnull = False)

#         if ldap:
#             ldap_server = ldap.LDAP_SERVER  # Correct LDAP server URL format with the protocol
#             ldap_port = int(ldap.LDAP_PORT) if ldap.LDAP_PORT and ldap.LDAP_PORT.isdigit() else 389
#             base_dn = ldap.BASE_DN  # Your Base DN
#             bind_dn = ldap.BIND_DN # Bind DN (Admin account)
#             password = ldap.LDAP_PW_HASHED

#             termed_users = HR_RECORD.objects.filter(STATUS = 'Inactive')

#             for user in termed_users:

#                 # The username of the account you want to deactivate
#                 user_to_deactivate = user.EMAIL_ADDRESS  # Change this value to the user you want to deactivate

#                 # Connect to the server
#                 server = Server(ldap_server, port=ldap_port, get_info=ALL)
#                 conn = Connection(server, user=bind_dn, password=password, auto_bind=True)

#                 # Perform a search for the specific user to deactivate
#                 conn.search(base_dn, f'(sAMAccountName={user_to_deactivate})', attributes=['cn', 'sAMAccountName', 'userAccountControl'])

#                 # Check if the user was found
#                 if conn.entries:
#                     entry = conn.entries[0]
#                     user_status = 'Active' if int(entry.userAccountControl.value) & 2 == 0 else 'Inactive'

#                     # If the account is active, deactivate it by modifying the userAccountControl
#                     if user_status == 'Active':
#                         # Set the userAccountControl value to disable the account (bitwise OR with 0x2 to disable)
#                         new_user_account_control = int(entry.userAccountControl.value) | 2
#                         conn.modify(entry.entry_dn, {'userAccountControl': [(MODIFY_REPLACE, [new_user_account_control])]})

#                         # Check if the modification was successful
#                         if conn.result['result'] == 0:
#                             message = f"User {user_to_deactivate} has been successfully deactivated."
#                         else:
#                             message = f"Failed to deactivate user {user_to_deactivate}: {conn.result}"

#                     else:
#                         message = f"User {user_to_deactivate} is already inactive."
#                 else:
#                     message = f"User {user_to_deactivate} not found."

#                 # Close the connection
#                 conn.unbind()

#                 # Return a success or error message in a JSON response
#                 logger.info(message)

#     except NETWORK_AUTH.DoesNotExist:
#         logger.warning(f"SFTP configuration for HR record is not yet configured. Skipping job.")