from django.shortcuts import render,redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .models import Incomes,Expenses,Budget
from rest_framework import viewsets,status
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import IncomeSerializer,ExpenseSerializer,BudgetSerializer
from django.contrib.auth.decorators import login_required

@login_required(login_url="login")
def index_page(request):
    return render(request,'budgy_app/index.html')

class IncomeViewSet(viewsets.ModelViewSet):
    permission_classes=[IsAuthenticated]
    serializer_class = IncomeSerializer
    def get_queryset(self):
        return Incomes.objects.filter(user=self.request.user).order_by('-date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ExpenseViewSet(viewsets.ModelViewSet):
    serializer_class = ExpenseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Expenses.objects.filter(user=self.request.user).order_by('-date')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def reset(request):
    Expenses.objects.all().delete()
    Incomes.objects.all().delete()
    return Response({"message": "All data deleted."}, status=status.HTTP_204_NO_CONTENT)

def login_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        remember = request.POST.get("remember")  

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            if remember:
                request.session.set_expiry(60 * 60 * 24 * 30)
            else:
                request.session.set_expiry(0)

            return redirect("index") 
        else:
            return render(request, "budgy_app/login.html", {"error": "Invalid credentials"})
    return render(request, "budgy_app/login.html")

from django.contrib.auth.models import User

def signup_view(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        if User.objects.filter(username=username).exists():
            return render(request, "budgy_app/signup.html", {"error": "Username taken"})
        User.objects.create_user(username=username, password=password)
        return redirect("login")
    return render(request, "budgy_app/signup.html")

from django.contrib.auth import logout

def logout_view(request):
    logout(request)
    return redirect("login")

