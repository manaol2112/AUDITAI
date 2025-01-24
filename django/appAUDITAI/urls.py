from django.urls import path
from appAUDITAI.Views.LOGIN.authenticate import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from appAUDITAI.Views.ADMIN.company import *
from appAUDITAI.Views.ADMIN.roles import *
from appAUDITAI.Views.ADMIN.sftp import *
from appAUDITAI.Views.ADMIN.applications import *
from appAUDITAI.Views.ADMIN.policies import *
from appAUDITAI.Views.ADMIN.audit import *
from appAUDITAI.Views.ADMIN.hr import *
from appAUDITAI.Views.ADMIN.requests import *
from appAUDITAI.Views.ADMIN.network import *
from appAUDITAI.Views.UTILS.emails import *
from appAUDITAI.Views.ONBOARDING.onboarding import *


router = DefaultRouter()
router.register(r'companies', CompanyViewSet)
router.register(r'roles', GroupViewSet)
router.register(r'permission', PermissionViewSet)
router.register(r'users', UserViewSet)
router.register(r'userroles', USERROLESViewSet)
router.register(r'roleowners', RoleOwnerViewSet)
router.register(r'systemsettings', SystemSettingViewSet)
router.register(r'hr/data',HRViewSetbyEmail)
router.register(r'access/request',AccessRequestViewSet, basename='requests')
router.register(r'access/approval',AccessRequestApprovalViewSet, basename='approval')
# router.register(r'access/myrequests',AccessRequestByAppViewSet, basename='requestbyapp')
router.register(r'hr-sftp', HRSFTPViewSet)
router.register(r'app-sftp', APPSFTPViewSetbyID)
router.register(r'hr-job-schedule', HRJobViewSet)
router.register(r'hr-job-log', HRJobLogView)
router.register(r'network-auth', NetworkAuthViewSet)
router.register(r'app-job-schedule', AppJobViewSet,  basename='app_scheduling')
router.register(r'app-job-alert', JobAlertViewSet,  basename='job_alerting')
router.register(r'hr-job-alert', JobAlertHRViewSet,  basename='hr_job_alerting')
router.register(r'applications', AppViewSet)
router.register(r'registration', RegistrationViewSet)
router.register(r'useraccessreview', UARViewSet)
router.register(r'app-password', AppPasswordViewSetbyApp)
router.register(r'process/provisioning', ProvisioningProcessViewSetByID, basename='provisioning')
router.register(r'process/termination', TerminationProcessViewSetByID, basename='termination')
router.register(r'process/uar', UARProcessViewSetByID, basename='uar')
router.register(r'process/admin', AdminProcessViewSetByID, basename='admin')
router.register(r'policies/password', PasswordPolicyByApp, basename='password-policy')
router.register(r'audit/risk', RiskListViewSet, basename='risk-library')
router.register(r'audit/controls', ControlsListViewSet, basename='controls-library')
router.register(r'audit/projects', ProjectListViewSet, basename='projects')
router.register(r'audit/riskmapping', RiskMappingViewSet, basename='riskmapping')
router.register(r'audit/testing', TestingViewSet, basename='controltesting')
router.register(r'audit/testprocedures', ProcedureListViewSet, basename='testprocedures')
router.register(r'audit/workpaperdetails', WorkPaperDetailsViewSet, basename='workpaperdetails')
# router.register(r'audit/riskmapping/app', RiskMappingViewSetbyAPP, basename='riskmapping-by-app')
# router.register(r'hr-data-mapping', HR_Data_MappingViewSet)

urlpatterns = [

    path('', login_view),
    path('api/refresh_token/', MyTokenRefreshView.as_view(), name='refresh_token'),
    path('api/login/', login_view),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), 
    path('api/', include(router.urls)),  
    path('api/companies/<uuid:companyId>/', CompanyViewSetByID.as_view, name = 'company-details' ),
    path('api/registration/<uuid:id>/', RegistrationViewSetByID.as_view, name = 'registration-details' ),
    path('api/applications/<uuid:appId>/', AppViewSetByID.as_view, name = 'app-details' ),
    # path('api/useraccessreviewbyapp/<uuid:APP_NAME>/', UARViewSetbyApp.as_view(), name = 'uar-by-app'),
    path('api/fetch-app-password/<uuid:APP_NAME>/', AppPasswordViewSetbyID.as_view({'get': 'retrieve','post': 'create', 'put': 'update','delete': 'destroy'}), name='app-password-by-app'),
    path('api/app-password/appid/<uuid:APP_NAME>/', AppPasswordViewSet.as_view({'get': 'retrieve','post': 'create', 'put': 'update','delete': 'destroy'}), name='app-password-by-app'),
    path('api/app-users/<str:APP_NAME>/', AppRecordViewSetbyApp.as_view(), name='app-user-by-app'),
    path('api/useraccess-review/<uuid:APP_NAME>/', UARViewSetbyApp.as_view({'get': 'list'}), name='uar-by-app'),
    path('api/app-users/date-granted/<uuid:APP_NAME>/', AppRecordViewSetbyAppAndGrantDate.as_view(), name='app-user-by-app-granted'),
    path('api/app-users/date-removed/<uuid:APP_NAME>/', AppRecordViewSetbyAppAndRemovalDate.as_view(), name='app-user-by-app-removed'),
    path('api/audit/mapping/app/<uuid:APP_NAME>/<uuid:COMPANY_ID>/', RiskMappingViewSetbyAPP.as_view({'get':'list'}), name='riskmapping-by-app'),
    path('api/audit/workpapers/<uuid:APP_NAME>/<uuid:COMPANY_ID>/', WorkpapersViewSet.as_view({'get':'list'}), name='workpapers'),
    path('api/audit/riskmapping/delete/<uuid:APP_NAME>/<uuid:RISK_ID>/<uuid:COMPANY_ID>/', RiskMappingUpdateViewSet.as_view({'delete': 'destroy', 'put':'update'}), name='riskmapping-delete-by-app'),
    path('api/audit/mapping/controls/<uuid:APP_NAME>/<uuid:RISK_ID>/<uuid:COMPANY_ID>/', MappedControlsViewSet.as_view({'get': 'list', 'put':'update'}), name='workpaper-query'),
    path('api/app-users/joblog/<uuid:APP_NAME>/', AppRecordLastRefreshDateByApp.as_view(), name = 'job-log-by-app' ),
    path('api/applications/myapp/<str:APPLICATION_OWNER>/', AppViewSetByOwner.as_view(), name='app-details-by-owner'),
    path('api/applications/myapp/company/<uuid:COMPANY_ID>/', AppViewSetByCompany.as_view(), name='app-details-by-company'),
    path('api/applications/myapp/apptype/<str:appType>/', AppViewSetByType.as_view(), name='app-details-by-type'),
    path('api/roles/<int:id>/', GroupViewSetByID.as_view, name = 'role-details' ),
    path('api/permission/<int:id>/', PermissionViewSetByID.as_view, name = 'permission-details' ),
    path('api/users/<str:username>/', UserViewSetbyID.as_view, name = 'user-details' ),
    path('api/userroles/<str:user_id>/', USERROLESViewSetbyID.as_view, name = 'user-roles' ),
    path('api/userroles/company/<str:COMPANY_ID>/', USERROLESViewSetbyCompany.as_view(), name = 'user-roles-company' ),
    path('api/systemsettings/<int:id>/', SystemSettingViewSetbyID.as_view, name = 'system-settings' ),
    path('api/hr-sftp/<int:id>/', HRSFTPViewSetbyID.as_view, name = 'hr-sftp' ),
    path('api/hr-job-schedule/<int:id>/', HRJobViewSetbyID.as_view, name = 'hr-job' ),
    path('api/hr-data-mapping/<int:id>/', HR_Data_MappingViewSetbyID.as_view, name = 'hr-data-mapping-by-id' ),
    path('api/hr-data-mapping/', HRDataMappingView.as_view(), name = 'hr-data-mapping' ),
    path('api/user-data-mapping/', AppUserDataMappingView.as_view(), name = 'user-data-mapping' ),
    path('api/sftp/hrtest/', hr_sftp_connection, name = 'hr-sftp-test' ),
    path('api/current_user/', current_user, name='current_user'),
    path('api/request-id/', GenerateRequestIDView.as_view(), name='generate_request_id'),
    path('api/send-approval-request/', SubmitRequestView.as_view(), name='submit_request'),
    path('api/send-registration-confirmation/', SubmitRegistrationConfirmationView.as_view(), name='submit_registration_confirmation'),
    path('api/accessrequest/approval/<uuid:id>/', ApproveAccessRequestView.as_view(), name='approve_request'),
    path('api/accessrequest/reject/<uuid:id>/', SubmitRequestView.as_view(), name='reject_request'),
    path('api/access/myrequests/<uuid:app_id>/', AccessRequestByAppViewSet.as_view({'get': 'list'}), name='my_requests'),
    path('api/role-owners/<uuid:APP_NAME>/<str:ROLE_NAME>/', RoleOwnerViewSetbyID.as_view(), name='role-owner-by-id'),
    path('api/role-owners/<uuid:APP_NAME>/', RoleOwnerViewSetbyApp.as_view(), name='role-owner-by-app'),
    path('test_ldap/', connect_ldap, name='connect_ldap'),   
    path('deactivate_user/', deactivate_user, name='deactive_user'), 
    path('api/jobschedule/<uuid:APP_NAME>/', AppJobViewSetByID.as_view(), name='job-schedule'),
    path('api/jobalert/<uuid:APP_NAME>/', JobAlertSetByID.as_view(), name='job-alert'),
    path('api/joblog/<uuid:APP_NAME>/', AppJobUserLogFetchViewSetByID.as_view(), name='job-log'),
]       