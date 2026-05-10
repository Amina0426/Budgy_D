from django.urls import path,include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'incomes', views.IncomeViewSet,basename='incomes')
router.register(r'expenses',views.ExpenseViewSet,basename='expenses')
router.register(r'budgets',views.BudgetViewSet,basename='budgets')

urlpatterns = [
    path('',views.login_view,name='login'),
    path("signup/", views.signup_view, name="signup"),
    path("logout/", views.logout_view, name="logout"),
    path('app/', views.index_page, name='index'),
    path('api/', include(router.urls)),
    path(
    'api/expenses/<int:expense_id>/images/',
    views.upload_expense_images,
    name='upload_expense_images'
    ),
    path(
    'api/expense-images/<int:image_id>/',
    views.delete_expense_image,
    name='delete_expense_image'
),
    path('api/reset/', views.reset, name='reset_app'),

]
