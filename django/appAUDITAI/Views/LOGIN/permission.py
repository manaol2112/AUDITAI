from rest_framework.permissions import BasePermission

class isAdministrator(BasePermission):

    def has_permission(self, request, view):
        # Check if the user is authenticated
        if not request.user.is_authenticated:
            return False
        
        # Check if the user is in the 'Admin' or 'Moderator' group
        allowed_groups = ['Administrator']
        return any(request.user.groups.filter(name=group).exists() for group in allowed_groups)
