from django.contrib import admin
from .models import Employee
from .models import Employee, Attendance
# Register your models here.


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('user', 'designation', 'leave_balance', 'join_date')

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('employee', 'date', 'status', 'mode')
    list_filter = ('status', 'mode', 'date')
