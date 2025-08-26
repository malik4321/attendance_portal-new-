from django.urls import path
from .views import CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CreateEmployeeAPIView
from .views import EmployeeListAPIView
from .views import DeleteEmployeeAPIView
from .views import LeaveRequestListAPIView, LeaveRequestUpdateAPIView
from .views import dashboard_stats
from . import views
from .views import (
    CustomTokenObtainPairView,
    CreateEmployeeAPIView, EmployeeListAPIView, DeleteEmployeeAPIView,
    LeaveRequestListAPIView, LeaveRequestUpdateAPIView,
    dashboard_stats,
    me_profile, my_stats, my_attendance, mark_today_present,
    my_leaves, my_leave_cancel,
)
from .views import my_leaves, my_leave_cancel
from .views import me_dashboard

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('employees/', CreateEmployeeAPIView.as_view(), name='create_employee'),
    path('employees/all/', EmployeeListAPIView.as_view(), name='all_employees'),
    path('employees/delete/<int:pk>/', DeleteEmployeeAPIView.as_view(), name='delete_employee'),
    path('dashboard-stats/', views.dashboard_stats),

    path('me/', me_profile, name='me_profile'),
    path('me/stats/', my_stats, name='my_stats'),
    path('me/attendance/', my_attendance, name='my_attendance'),
    path('me/attendance/mark/', mark_today_present, name='mark_today_present'),
    path('me/leave-requests/', my_leaves, name='my_leaves_alias'),
    path('me/leave-requests/<int:pk>/', my_leave_cancel, name='my_leave_cancel_alias'),
    path('me/leaves/<int:pk>/', my_leave_cancel, name='my_leave_cancel'),
    path('me/dashboard/', me_dashboard, name='me_dashboard'),
     path('dashboard-stats/', dashboard_stats),
]


urlpatterns += [
    path('leave-requests/', LeaveRequestListAPIView.as_view(), name='leave_requests'),
    path('leave-requests/<int:pk>/', LeaveRequestUpdateAPIView.as_view(), name='leave_request_update'),
]