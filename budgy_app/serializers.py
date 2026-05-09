from rest_framework import serializers
from .models import Incomes,Expenses,Budget,ExpenseImage

class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Incomes
        fields = ['id', 'amount', 'date']
class ExpenseImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = ExpenseImage
        fields = ['id','image']
class ExpenseSerializer(serializers.ModelSerializer):
    images=ExpenseImageSerializer(
        many= True,
        read_only=True
    )
    class Meta:
        model=Expenses
        fields = ['id', 'amount', 'tag', 'date','images'] 

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model=Budget
        fields = ['id', 'amount', 'created_at'] 