# from django.db import models
# from django.contrib.auth.models import User 

# # Create your models here.
# class Employee(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)  # Link to login account
#     designation = models.CharField(max_length=100)
#     join_date = models.DateField(auto_now_add=True)
#     leave_balance = models.IntegerField(default=15)

#     def __str__(self):
#         return self.user.username  # ✅ fixed

# class Attendance(models.Model):
#     STATUS_CHOICES = [
#         ('Present', 'Present'),
#         ('Absent', 'Absent'),
#         ('Leave', 'Leave'),
#     ]

#     MODE_CHOICES = [
#         ('WFH', 'Work From Home'),
#         ('Onsite', 'Onsite'),
#     ]

#     employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
#     date = models.DateField(auto_now_add=True)
#     status = models.CharField(max_length=10, choices=STATUS_CHOICES)
#     mode = models.CharField(max_length=10, choices=MODE_CHOICES, blank=True, null=True)

#     def __str__(self):
#         return f"{self.employee.user.username} - {self.date} - {self.status}"
# # models.py
# from django.db import models
# from django.contrib.auth.models import User

# class LeaveRequest(models.Model):
#     STATUS_CHOICES = (
#         ('pending', 'Pending'),
#         ('approved', 'Approved'),
#         ('rejected', 'Rejected'),
#     )
#     employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
#     start_date = models.DateField()
#     end_date = models.DateField()
#     reason = models.TextField()
#     status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

#     def __str__(self):
#         return f"{self.employee.user.username} - {self.status}"
    



# attendance/models.py
from django.db import models
from django.contrib.auth.models import User
from datetime import date as date_cls

class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    designation = models.CharField(max_length=100)
    join_date = models.DateField(auto_now_add=True)
    leave_balance = models.IntegerField(default=15)

    def __str__(self):
        return self.user.username

class Attendance(models.Model):
    STATUS_CHOICES = [
        ('Present', 'Present'),
        ('Absent', 'Absent'),
        ('Leave', 'Leave'),
    ]
    MODE_CHOICES = [
        ('WFH', 'Work From Home'),
        ('Onsite', 'Onsite'),
    ]
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    # default=today so we can also create backfilled rows (e.g., for leave)
    date = models.DateField(default=date_cls.today)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    mode = models.CharField(max_length=10, choices=MODE_CHOICES, blank=True, null=True)

    class Meta:
        unique_together = ('employee', 'date')  # one attendance per day
        ordering = ['-date']

    def __str__(self):
        return f"{self.employee.user.username} - {self.date} - {self.status}"

class LeaveRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"{self.employee.user.username} - {self.status}"
