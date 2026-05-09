from django.db import models
from django.contrib.auth.models import User
import cloudinary.uploader

class Expenses(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,null=True)
    amount=models.FloatField()
    tag=models.CharField(max_length=50)
    date=models.DateField(auto_now_add=True)
    ##img=models.ImageField(upload_to='expense_images/',blank=True,null=True)

    def __str__(self):
        return f"{self.tag}:{self.amount} on {self.date}."

class ExpenseImage(models.Model):

    expense = models.ForeignKey(
        Expenses,
        on_delete=models.CASCADE,
        related_name='images'
    )

    image = models.ImageField(
        upload_to='expense_images/'
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

class Incomes(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    amount=models.FloatField()
    date=models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.amount} on {self.date}."

class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)
    amount=models.FloatField()
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Budget: ₹{self.amount}"


