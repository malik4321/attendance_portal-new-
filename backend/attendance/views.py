# views.py
from rest_framework import status, serializers
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import Employee
from .serializers import EmployeeCreateSerializer
from rest_framework.generics import ListAPIView
from .models import Employee
from .serializers import EmployeeCreateSerializer
from rest_framework.permissions import IsAdminUser
from rest_framework.generics import DestroyAPIView
from .models import Employee
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets, permissions
from .models import LeaveRequest
from .serializers import LeaveRequestSerializer
from rest_framework.generics import ListAPIView, UpdateAPIView
from .models import LeaveRequest
from .serializers import LeaveRequestSerializer
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Attendance, Employee
from django.utils import timezone
from datetime import date
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import timedelta, date
from .models import Attendance, Employee, LeaveRequest

# # views.py

# class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
#     def validate(self, attrs):
#         data = super().validate(attrs)
#         user = self.user

#         # 🔍 PRINT DEBUGGING
#         print("🔥 Username:", user.username)
#         print("🔥 Is Staff:", user.is_staff)
#         print("🔥 Request Data:", self.context['request'].data)

#         role = self.context['request'].data.get('role')

#         if role == "admin" and not user.is_staff:
#             raise serializers.ValidationError("You are not authorized as admin.")
#         elif role == "employee":
#             if not Employee.objects.filter(user=user).exists():
#                 raise serializers.ValidationError("You are not registered as employee.")

#         data['username'] = user.username
#         data['role'] = role
#         data['is_staff'] = user.is_staff
#         return data


# class CustomTokenObtainPairView(TokenObtainPairView):
#     serializer_class = CustomTokenObtainPairSerializer

# class CreateEmployeeAPIView(APIView):
#     permission_classes = [IsAdminUser]  # ✅ Only admin can create employees

#     def post(self, request):
#         serializer = EmployeeCreateSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"message": "Employee created successfully."}, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


    
# class EmployeeListAPIView(ListAPIView):
#     queryset = Employee.objects.select_related('user').all()
#     serializer_class = EmployeeCreateSerializer
#     permission_classes = [IsAdminUser]

# class DeleteEmployeeAPIView(DestroyAPIView):
#     permission_classes = [IsAdminUser]
#     queryset = Employee.objects.all()

#     def delete(self, request, pk, *args, **kwargs):
#         try:
#             employee = self.get_object()
#             user = employee.user
#             employee.delete()
#             user.delete()  # Delete linked user as well
#             return Response({"message": "Employee deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
#         except Exception as e:
#             return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# class LeaveRequestViewSet(viewsets.ModelViewSet):
#     queryset = LeaveRequest.objects.all()
#     serializer_class = LeaveRequestSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_queryset(self):
#         if self.request.user.is_staff:
#             return LeaveRequest.objects.all()
#         return LeaveRequest.objects.filter(employee__user=self.request.user)
    
# class LeaveRequestListAPIView(ListAPIView):
#     queryset = LeaveRequest.objects.all()
#     serializer_class = LeaveRequestSerializer
#     permission_classes = [IsAdminUser]


# class LeaveRequestUpdateAPIView(UpdateAPIView):
#     queryset = LeaveRequest.objects.all()
#     serializer_class = LeaveRequestSerializer
#     permission_classes = [IsAdminUser]


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def dashboard_stats(request):
#     today = date.today()

#     total_employees = Employee.objects.count()
#     present_today = Attendance.objects.filter(date=today, status='Present').count()
#     absent_today = Attendance.objects.filter(date=today, status='Absent').count()

#     # Pending leave requests from the LeaveRequest model
#     leave_pending = LeaveRequest.objects.filter(status='pending').count()

#     # WFH vs Onsite (today)
#     wfh_count = Attendance.objects.filter(date=today, mode='WFH').count()
#     onsite_count = Attendance.objects.filter(date=today, mode='Onsite').count()

#     # Attendance trend for the last 7 days (inclusive), ordered oldest -> newest
#     days = [today - timedelta(days=i) for i in range(6, -1, -1)]
#     trend = []
#     for d in days:
#         total = Attendance.objects.filter(date=d).count()
#         present = Attendance.objects.filter(date=d, status='Present').count()
#         absent = Attendance.objects.filter(date=d, status='Absent').count()
#         trend.append({
#             "date": d.isoformat(),
#             "present": present,
#             "absent": absent,
#             "total": total,
#         })

#     return Response({
#         "total_employees": total_employees,
#         "present_today": present_today,
#         "absent_today": absent_today,
#         "leave_pending": leave_pending,
#         "wfh": wfh_count,
#         "onsite": onsite_count,
#         "trend": trend
#     })



# attendance/views.py
from datetime import date, timedelta

from django.shortcuts import get_object_or_404
from rest_framework import status, serializers, viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import ListAPIView, UpdateAPIView, DestroyAPIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from datetime import date, timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .serializers import LeaveRequestSerializer, LeaveRequestStatusUpdateSerializer

from datetime import date, timedelta
from django.db.models import Q, Count
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from .models import Employee, Attendance, LeaveRequest

from .models import Employee, Attendance, LeaveRequest
from .serializers import (
    EmployeeCreateSerializer,
    EmployeeProfileSerializer,
    AttendanceSerializer,
    LeaveRequestSerializer,
)

# ---------- AUTH ----------

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        role = self.context['request'].data.get('role')

        if role == "admin" and not user.is_staff:
            raise serializers.ValidationError("You are not authorized as admin.")
        elif role == "employee":
            if not Employee.objects.filter(user=user).exists():
                raise serializers.ValidationError("You are not registered as employee.")

        data['username'] = user.username
        data['role'] = role
        data['is_staff'] = user.is_staff
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# ---------- ADMIN APIs (unchanged behaviors) ----------

class CreateEmployeeAPIView(APIView):
    permission_classes = [IsAdminUser]
    def post(self, request):
        serializer = EmployeeCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Employee created successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EmployeeListAPIView(ListAPIView):
    queryset = Employee.objects.select_related('user').all()
    serializer_class = EmployeeCreateSerializer
    permission_classes = [IsAdminUser]

class DeleteEmployeeAPIView(DestroyAPIView):
    permission_classes = [IsAdminUser]
    queryset = Employee.objects.all()
    def delete(self, request, pk, *args, **kwargs):
        try:
            employee = self.get_object()
            user = employee.user
            employee.delete()
            user.delete()
            return Response({"message": "Employee deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class LeaveRequestListAPIView(ListAPIView):
    queryset = LeaveRequest.objects.all().select_related('employee', 'employee__user')
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAdminUser]

def _apply_approved_leave(leave: LeaveRequest):
    emp = leave.employee
    start = leave.start_date
    end = leave.end_date
    if end < start:
        raise serializers.ValidationError("end_date cannot be before start_date.")
    days = (end - start).days + 1
    if emp.leave_balance < days:
        raise serializers.ValidationError("Insufficient leave balance to approve this request.")
    cur = start
    while cur <= end:
        Attendance.objects.update_or_create(
            employee=emp, date=cur,
            defaults={"status": "Leave", "mode": None}
        )
        cur += timedelta(days=1)
    emp.leave_balance -= days
    emp.save()

class LeaveRequestUpdateAPIView(UpdateAPIView):
    queryset = LeaveRequest.objects.all()
    serializer_class = LeaveRequestSerializer
    permission_classes = [IsAdminUser]

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        prev_status = instance.status
        response = super().partial_update(request, *args, **kwargs)
        instance.refresh_from_db()
        if prev_status != "approved" and instance.status == "approved":
            try:
                _apply_approved_leave(instance)
            except serializers.ValidationError as e:
                instance.status = prev_status
                instance.save()
                detail = e.detail[0] if isinstance(e.detail, list) else e.detail
                return Response({"detail": str(detail)}, status=status.HTTP_400_BAD_REQUEST)
        return response

# ---------- SHARED DASHBOARD STATS ----------
@api_view(['GET'])
@permission_classes([IsAdminUser])
def dashboard_stats(request):
    """
    Supports optional ?from=YYYY-MM-DD&to=YYYY-MM-DD.
    Defaults to the last 7 days (inclusive).
    """
    # ---- parse range safely
    f = request.query_params.get("from")
    t = request.query_params.get("to")

    if f and t:
        try:
            start = date.fromisoformat(f)
            end   = date.fromisoformat(t)
        except ValueError:
            return Response({"detail": "from/to must be YYYY-MM-DD."}, status=400)
        if end < start:
            return Response({"detail": "to cannot be before from."}, status=400)
        # clamp excessively long ranges (optional)
        if (end - start).days > 120:
            end = start + timedelta(days=120)
    else:
        end = date.today()
        start = end - timedelta(days=6)  # last 7 days

    # ---- point-in-time (end day) KPIs
    total_employees = Employee.objects.count()

    # present / absent / leave for the END day
    present_today = Attendance.objects.filter(date=end, status="Present").count()
    leave_today   = Attendance.objects.filter(date=end, status="Leave").count()

    # define "absent" as total employees minus those who are present or on leave that day
    # (tweak if you treat "absent" differently)
    absent_today  = max(0, total_employees - (present_today + leave_today))

    # work modes for the END day
    wfh = Attendance.objects.filter(date=end, status="Present", mode="WFH").count()
    onsite = Attendance.objects.filter(date=end, status="Present", mode="Onsite").count()

    # pending leave requests (global)
    leave_pending = LeaveRequest.objects.filter(status='pending').count()

    # ---- trend over the selected range: for each day compute present/total
    # here "total" = total employees (so Absent = total - present - leave)
    trend = []
    cur = start
    # prefetch all attendance in range to cut queries
    att_in_range = Attendance.objects.filter(date__range=(start, end))
    by_day = {
        d['date']: d for d in att_in_range.values('date')
                                .annotate(
                                    present=Count('id', filter=Q(status="Present")),
                                    leave=Count('id', filter=Q(status="Leave"))
                                )
    }
    while cur <= end:
        agg = by_day.get(cur, {"present": 0, "leave": 0})
        present = int(agg["present"])
        leave = int(agg["leave"])
        total = total_employees
        trend.append({
            "date": cur.isoformat(),
            "present": present,
            "leave": leave,
            "total": total,
        })
        cur += timedelta(days=1)

    return Response({
        "total_employees": total_employees,
        "present_today": present_today,
        "absent_today": absent_today,
        "leave_pending": leave_pending,
        "wfh": wfh,
        "onsite": onsite,
        "trend": trend,
        "range": {"from": start.isoformat(), "to": end.isoformat()},
    })
# ---------- EMPLOYEE APIs ----------

def _get_employee(user) -> Employee:
    return get_object_or_404(Employee, user=user)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_profile(request):
    emp = _get_employee(request.user)
    return Response(EmployeeProfileSerializer(emp).data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_today_present(request):
    emp = _get_employee(request.user)
    mode = (request.data.get("mode") or "").strip()
    if mode not in ["WFH", "Onsite"]:
        return Response({"detail": "mode must be 'WFH' or 'Onsite'."}, status=400)
    today = date.today()
    existing = Attendance.objects.filter(employee=emp, date=today).first()
    if existing and existing.status == "Leave":
        return Response({"detail": "You are on approved leave today."}, status=400)
    obj, _ = Attendance.objects.update_or_create(
        employee=emp, date=today,
        defaults={"status": "Present", "mode": mode}
    )
    return Response(AttendanceSerializer(obj).data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_attendance(request):
    emp = _get_employee(request.user)

    # 1) Try explicit date range first: ?from=YYYY-MM-DD&to=YYYY-MM-DD
    from_str = request.query_params.get("from")
    to_str   = request.query_params.get("to")

    if from_str and to_str:
        try:
            start = date.fromisoformat(from_str)
            end   = date.fromisoformat(to_str)
        except ValueError:
            return Response({"detail": "from/to must be YYYY-MM-DD."}, status=400)
        if end < start:
            return Response({"detail": "to cannot be before from."}, status=400)
        # (optional) clamp long ranges
        if (end - start).days > 120:
            end = start + timedelta(days=120)
    else:
        # 2) Fallback: ?days=30 (default)
        try:
            days = int(request.query_params.get("days", 30))
        except ValueError:
            days = 30
        days = max(1, min(days, 90))
        end = date.today()
        start = end - timedelta(days=days - 1)

    qs = Attendance.objects.filter(employee=emp, date__range=(start, end))
    by_date = {a.date: a for a in qs}

    out = []
    cur = start
    while cur <= end:
        a = by_date.get(cur)
        if a:
            out.append({
                "id": a.id,
                "date": cur.isoformat(),
                "status": a.status,
                "mode": a.mode
            })
        else:
            out.append({
                "id": None,
                "date": cur.isoformat(),
                "status": "Absent",
                "mode": None
            })
        cur += timedelta(days=1)

    return Response(out)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_stats(request):
    emp = _get_employee(request.user)
    days = 30
    end = date.today()
    start = end - timedelta(days=days - 1)
    qs = Attendance.objects.filter(employee=emp, date__range=(start, end))
    by_date = {a.date: a for a in qs}
    present = leave = absent = 0
    cur = start
    while cur <= end:
        a = by_date.get(cur)
        if a:
            if a.status == "Present":
                present += 1
            elif a.status == "Leave":
                leave += 1
            else:
                absent += 1
        else:
            absent += 1
        cur += timedelta(days=1)
    upcoming = LeaveRequest.objects.filter(
        employee=emp, status='approved', start_date__gte=date.today()
    ).order_by('start_date').first()
    today_row = Attendance.objects.filter(employee=emp, date=date.today()).first()
    on_leave_today = LeaveRequest.objects.filter(
        employee=emp, status='approved', start_date__lte=date.today(), end_date__gte=date.today()
    ).exists()
    today_status = (
        today_row.status if today_row else ("Leave" if on_leave_today else "None")
    )
    return Response({
        "leave_balance": emp.leave_balance,
        "present_days": present,
        "leave_days": leave,
        "absent_days": absent,
        "today_status": today_status,
        "upcoming_leave": {
            "start_date": upcoming.start_date.isoformat(),
            "end_date": upcoming.end_date.isoformat(),
            "reason": upcoming.reason,
        } if upcoming else None
    })

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def my_leaves(request):
    emp = _get_employee(request.user)
    if request.method == 'GET':
        qs = LeaveRequest.objects.filter(employee=emp).order_by('-id')
        return Response(LeaveRequestSerializer(qs, many=True).data)
    # POST
    start_date = request.data.get('start_date')
    end_date = request.data.get('end_date')
    reason = request.data.get('reason', '')
    if not (start_date and end_date):
        return Response({"detail": "start_date and end_date are required."}, status=400)
    try:
        s = date.fromisoformat(start_date)
        e = date.fromisoformat(end_date)
    except ValueError:
        return Response({"detail": "Dates must be YYYY-MM-DD."}, status=400)
    if e < s:
        return Response({"detail": "end_date cannot be before start_date."}, status=400)
    overlap = LeaveRequest.objects.filter(
        employee=emp, end_date__gte=s, start_date__lte=e, status__in=['pending', 'approved']
    ).exists()
    if overlap:
        return Response({"detail": "Requested range overlaps an existing request."}, status=400)
    days_needed = (e - s).days + 1
    if emp.leave_balance < days_needed:
        return Response({"detail": "Insufficient leave balance."}, status=400)
    obj = LeaveRequest.objects.create(
        employee=emp, start_date=s, end_date=e, reason=reason, status='pending'
    )
    return Response(LeaveRequestSerializer(obj).data, status=201)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def my_leave_cancel(request, pk):
    emp = _get_employee(request.user)
    obj = get_object_or_404(LeaveRequest, pk=pk, employee=emp)
    if obj.status != 'pending':
        return Response({"detail": "Only pending leaves can be cancelled."}, status=400)
    obj.delete()
    return Response(status=204)


from datetime import date, timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me_dashboard(request):
    emp = _get_employee(request.user)
    today = date.today()

    # profile
    profile = {
        "username": request.user.username,
        "designation": getattr(emp, "designation", "") or "",
        "join_date": getattr(emp, "join_date", None).isoformat() if getattr(emp, "join_date", None) else "",
        "leave_balance": int(getattr(emp, "leave_balance", 0) or 0),
    }

    # today
    today_row = Attendance.objects.filter(employee=emp, date=today).first()
    on_leave_today = LeaveRequest.objects.filter(
        employee=emp, status='approved', start_date__lte=today, end_date__gte=today
    ).exists()
    today_block = (
        {"status": today_row.status, "mode": today_row.mode}
        if today_row else
        {"status": "Leave" if on_leave_today else "None", "mode": None}
    )

    # month counters
    month_start = today.replace(day=1)
    month_qs = Attendance.objects.filter(employee=emp, date__range=(month_start, today))
    present_count = month_qs.filter(status="Present").count()
    leave_count   = month_qs.filter(status="Leave").count()
    elapsed_days  = (today - month_start).days + 1
    absent_count  = max(0, elapsed_days - (present_count + leave_count))
    wfh_count     = month_qs.filter(status="Present", mode="WFH").count()
    onsite_count  = month_qs.filter(status="Present", mode="Onsite").count()

    # pending leaves
    pending_leaves = LeaveRequest.objects.filter(employee=emp, status='pending').count()

    # trend (last 7 days)
    days = 7
    start = today - timedelta(days=days - 1)
    by_date = {a.date: a for a in Attendance.objects.filter(employee=emp, date__range=(start, today))}

    trend = []
    cur = start
    while cur <= today:
        a = by_date.get(cur)
        status = a.status if a else None
        present = 1 if status == "Present" else 0
        leave   = 1 if status == "Leave" else 0
        absent  = 1 if status is None or status == "Absent" else 0  # nothing recorded or explicitly Absent
        trend.append({
            "date": cur.isoformat(),
            "present": present,
            "leave": leave,
            "absent": absent,
            "total": 1,
        })
        cur += timedelta(days=1)

    return Response({
        "profile": profile,
        "today": today_block,
        "month": {
            "present": present_count, "absent": absent_count, "leave": leave_count,
            "wfh": wfh_count, "onsite": onsite_count
        },
        "pending_leaves": pending_leaves,
        "trend": trend,
    })



class LeaveRequestUpdateAPIView(UpdateAPIView):
    queryset = LeaveRequest.objects.all()
    permission_classes = [IsAdminUser]

    # writable serializer for PATCH
    serializer_class = LeaveRequestStatusUpdateSerializer

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        prev_status = instance.status
        response = super().partial_update(request, *args, **kwargs)  # writes new status

        instance.refresh_from_db()
        if prev_status != "approved" and instance.status == "approved":
            try:
                _apply_approved_leave(instance)
            except serializers.ValidationError as e:
                instance.status = prev_status
                instance.save()
                detail = e.detail[0] if isinstance(e.detail, list) else e.detail
                return Response({"detail": str(detail)}, status=400)
        return response