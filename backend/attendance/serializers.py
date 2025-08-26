# # attendance/serializers.py
# from rest_framework import serializers
# from django.contrib.auth.models import User
# from .models import Employee, LeaveRequest, Attendance

# class EmployeeCreateSerializer(serializers.ModelSerializer):
#     username = serializers.CharField(write_only=True)
#     password = serializers.CharField(write_only=True)

#     class Meta:
#         model = Employee
#         fields = ['id', 'username', 'password', 'designation', 'leave_balance', 'join_date']

#     def create(self, validated_data):
#         username = validated_data.pop('username')
#         password = validated_data.pop('password')
#         user = User.objects.create_user(username=username, password=password)
#         return Employee.objects.create(user=user, **validated_data)

#     def to_representation(self, instance):
#         rep = super().to_representation(instance)
#         rep['username'] = instance.user.username
#         return rep


# class LeaveRequestSerializer(serializers.ModelSerializer):
#     # NOTE: Employee -> User -> username
#     employee_name = serializers.CharField(source='employee.user.username', read_only=True)

#     class Meta:
#         model = LeaveRequest
#         fields = [
#             'id',
#             'employee',        # PK of Employee
#             'employee_name',   # computed
#             'start_date',
#             'end_date',
#             'reason',
#             'status',
#         ]
# class AttendanceSerializer(serializers.ModelSerializer):
#     date = serializers.DateField(format="%Y-%m-%d")

#     class Meta:
#         model = Attendance
#         fields = ["id", "date", "status", "mode"]



# attendance/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Employee, LeaveRequest, Attendance

class EmployeeCreateSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Employee
        fields = ['id', 'username', 'password', 'designation', 'leave_balance', 'join_date']

    def create(self, validated_data):
        username = validated_data.pop('username')
        password = validated_data.pop('password')
        user = User.objects.create_user(username=username, password=password)
        return Employee.objects.create(user=user, **validated_data)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['username'] = instance.user.username
        return rep

class EmployeeProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Employee
        fields = ['id', 'username', 'designation', 'join_date', 'leave_balance']

class AttendanceSerializer(serializers.ModelSerializer):
    date = serializers.DateField(format="%Y-%m-%d")

    class Meta:
        model = Attendance
        fields = ["id", "date", "status", "mode"]

class LeaveRequestSerializer(serializers.ModelSerializer):
    employee_name = serializers.CharField(source='employee.user.username', read_only=True)

    class Meta:
        model = LeaveRequest
        fields = [
            'id',
            'employee',
            'employee_name',
            'start_date',
            'end_date',
            'reason',
            'status',
        ]
        # read_only_fields = ['status']


class LeaveRequestStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaveRequest
        fields = ['status']  # only allow changing status







