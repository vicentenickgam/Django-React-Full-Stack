from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note,Administrador, Empleado, Prestamo, Pago

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id","username","password"]
        extra_kwargs = {"password" : {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}
        


class AdministradorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrador
        fields = '__all__'


class EmpleadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empleado
        fields = '__all__'


class PagoSerializer(serializers.ModelSerializer):
    prestamo = serializers.PrimaryKeyRelatedField(queryset=Prestamo.objects.all())
    empleado_nombre = serializers.CharField(source='prestamo.empleado.nombre', read_only=True)

    class Meta:
        model = Pago
        fields = ['id', 'prestamo', 'fecha_pago', 'monto_abono', 'saldo_despues_pago', 'empleado_nombre']



class PrestamoSerializer(serializers.ModelSerializer):
    empleado = EmpleadoSerializer(read_only=True)
    empleado_id = serializers.PrimaryKeyRelatedField(
        queryset=Empleado.objects.all(), source='empleado', write_only=True
    )
    pagos = PagoSerializer(many=True, read_only=True)

    class Meta:
        model = Prestamo
        fields = [
            'id', 'empleado', 'empleado_id', 'valor_solicitado',
            'fecha_inicio', 'numero_cuotas', 'valor_cuota',
            'saldo_actual', 'estado', 'pagos'
        ]
