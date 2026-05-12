from django.shortcuts import render,redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .models import Incomes,Expenses,Budget,ExpenseImage
from rest_framework import viewsets,status
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import IncomeSerializer,ExpenseSerializer,BudgetSerializer
from django.contrib.auth.decorators import login_required
import cloudinary.uploader
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import parser_classes
from django.views.decorators.csrf import ensure_csrf_cookie


@login_required(login_url="/")
def index_page(request):
    return render(request, "budgy_app/index.html")
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    return Response({
        "username": request.user.username
    })
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
    Expenses.objects.filter(user=request.user).delete()
    Incomes.objects.filter(user=request.user).delete()
    Budget.objects.filter(user=request.user).delete()
    return Response({"message": "All data deleted."}, status=status.HTTP_204_NO_CONTENT)
@ensure_csrf_cookie
def login_view(request):
    if request.user.is_authenticated:
        if request.session.get("remember_me"):
            return redirect("/app/")
        else:
            logout(request)
    if request.method == "POST":
        username = request.POST.get("username", "").strip()
        password = request.POST.get("password", "")
        remember = request.POST.get("remember") == "on"

        if not username or not password:
            return render(request, "budgy_app/login.html", {
                "error": "Username and password required"
            })

        user = authenticate(request, username=username, password=password)

        if user:
            login(request, user)

            request.session["remember_me"] = remember

            if remember:
                 request.session.set_expiry(60 * 60 * 24 * 30)
            else:
                request.session.set_expiry(0)
            return redirect("/app/")
        else:
            return render(request, "budgy_app/login.html", {
                "error": "Invalid credentials"
            })

    return render(request, "budgy_app/login.html")
from django.contrib.auth.models import User

from django.db import IntegrityError

@ensure_csrf_cookie
def signup_view(request):
    if request.method == "POST":
        username = request.POST.get("username", "").strip()
        password = request.POST.get("password", "")

        if not username or not password:
            return render(request, "budgy_app/signup.html", {
                "error": "All fields required"
            })

        try:
            if User.objects.filter(username=username).exists():
                return render(request, "budgy_app/signup.html", {
                    "error": "Username taken"
                })

            user = User.objects.create_user(
                username=username,
                password=password
            )

            # auto login immediately after signup
            login(request, user)

            return redirect("/app/")

        except IntegrityError:
            return render(request, "budgy_app/signup.html", {
                "error": "Username already exists"
            })

    return render(request, "budgy_app/signup.html")
from django.contrib.auth import logout

def logout_view(request):
    logout(request)
    return redirect("login")

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_expense_images(request, expense_id):

    try:
        expense = Expenses.objects.get(
            id=expense_id,
            user=request.user
        )

    except Expenses.DoesNotExist:

        return Response(
            {"error": "Expense not found"},
            status=404
        )

    files = request.FILES.getlist('images')

    if not files:

        return Response(
            {"error": "No files uploaded"},
            status=400
        )

    created = []

    for file in files:

        try:
            img = ExpenseImage.objects.create(
                expense=expense,
                image=file
            )

            created.append(img.image.url)

        except Exception as e:

            return Response({
                "error": str(e)
            }, status=500)

    return Response({
        "message": "Images uploaded successfully",
        "images": created
    })

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])

def delete_expense_image(request, image_id):

    try:

        image = ExpenseImage.objects.get(
            id=image_id,
            expense__user=request.user
        )

    except ExpenseImage.DoesNotExist:

        return Response(
            {"error": "Image not found"},
            status=404
        )

    cloudinary.uploader.destroy(
        image.image.name
    )

    image.delete()

    return Response({
        "message": "Image deleted"
    })