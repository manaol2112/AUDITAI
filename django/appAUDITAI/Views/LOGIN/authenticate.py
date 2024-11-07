from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token  
from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')

    print(f"Attempting login for username: {username}")

    user = authenticate(username=username, password=password)
    if user:
        login(request, user)
        refresh = RefreshToken.for_user(user)

        # Get user's groups and prepare them for JWT payload
        user_groups = list(user.groups.values_list('name', flat=True))

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'groups': user_groups
        })
    else:
        return Response({'error': 'Invalid credentials'}, status=400)

@api_view(['POST'])
def logout_view(request):
    logout(request)
    return Response({'success': 'Successfully logged out'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name
    })


class MyTokenRefreshView(TokenRefreshView):
    pass

   