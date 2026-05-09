from django.contrib import admin
from .models import Expenses,Incomes,Budget,ExpenseImage

# Register your models here.
admin.site.register(Expenses)
admin.site.register(Incomes)
admin.site.register(Budget)
admin.site.register(ExpenseImage)
