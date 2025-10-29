from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note, Administrador, Empleado, Prestamo, Pago


# 🔹 Usuario
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


# 🔹 Nota
class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}


# 🔹 Administrador
class AdministradorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrador
        fields = '__all__'


# 🔹 Empleado
class EmpleadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empleado
        fields = '__all__'


# 🔹 Prestamo simple (para usar dentro de PagoSerializer)
class PrestamoSimpleSerializer(serializers.ModelSerializer):
    empleado_nombre = serializers.CharField(source='empleado.nombre', read_only=True)

    class Meta:
        model = Prestamo
        fields = ['id', 'empleado_nombre', 'valor_cuota']


# 🔹 Pago
class PagoSerializer(serializers.ModelSerializer):
    # ✅ Solo mostrar datos resumidos del préstamo, no el objeto completo
    prestamo = PrestamoSimpleSerializer(read_only=True)
    prestamo_id = serializers.PrimaryKeyRelatedField(
        queryset=Prestamo.objects.all(), source='prestamo', write_only=True
    )

    class Meta:
        model = Pago
        fields = ['id', 'prestamo', 'prestamo_id', 'fecha_pago', 'monto_abono']



class PrestamoSerializer(serializers.ModelSerializer):
    empleado = EmpleadoSerializer(read_only=True)
    empleado_id = serializers.PrimaryKeyRelatedField(
        queryset=Empleado.objects.all(), source='empleado', write_only=True
    )
    pagos = serializers.SerializerMethodField()  
    cuotas_pagadas = serializers.SerializerMethodField()

    class Meta:
        model = Prestamo
        fields = [
            'id', 'empleado', 'empleado_id', 'valor_solicitado',
            'fecha_inicio', 'numero_cuotas', 'valor_cuota',
            'saldo_actual', 'estado', 'pagos', 'cuotas_pagadas'
        ]

    def get_pagos(self, obj):
        pagos = obj.pagos.all().order_by('-fecha_pago')
        return [{'id': p.id, 'fecha_pago': p.fecha_pago, 'monto_abono': p.monto_abono} for p in pagos]

    def get_cuotas_pagadas(self, obj):
        total_pagado = sum(p.monto_abono for p in obj.pagos.all())
        return int(total_pagado / obj.valor_cuota) if obj.valor_cuota > 0 else 0

    def create(self, validated_data):
        """
        Calcula automáticamente el saldo_actual con un 10% de interés sobre el valor solicitado.
        """
        interes = 10  # 💰 Porcentaje de interés (puedes hacerlo dinámico luego)
        valor_solicitado = validated_data.get('valor_solicitado', 0)

        # 🔹 Cálculo del saldo actual con interés
        saldo_actual = valor_solicitado + (valor_solicitado * interes / 100)
        validated_data['saldo_actual'] = saldo_actual

        # 🔹 Crear préstamo
        return super().create(validated_data)

