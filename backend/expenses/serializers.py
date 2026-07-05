from rest_framework import serializers
from .models import Expense, ExpenseSplit
from .services import calculate_splits
class ExpenseSplitSerializer(serializers.ModelSerializer):
    class Meta: model=ExpenseSplit; fields=('user','amount','percentage','shares')
class ExpenseSerializer(serializers.ModelSerializer):
    splits=ExpenseSplitSerializer(many=True,read_only=True); split_payload=serializers.DictField(write_only=True,required=False); participants=serializers.ListField(write_only=True,required=False)
    class Meta: model=Expense; fields='__all__'
    def create(self, data):
        payload=data.pop('split_payload',{}); participants=data.pop('participants',[]) or [m.user_id for m in data['trip'].tripmember_set.filter(is_active=True)]
        exp=Expense.objects.create(**data); rows=calculate_splits(exp.amount,participants,exp.split_method,payload)
        ExpenseSplit.objects.bulk_create([ExpenseSplit(expense=exp,user_id=u,amount=a) for u,a in rows.items()]); return exp
