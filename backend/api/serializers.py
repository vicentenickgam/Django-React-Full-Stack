from django.contrib.auth.models import User
from rest_framework import serializers
from decimal import Decimal
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

# 🔹 Prestamo
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
        Calcula automáticamente los valores derivados usando la misma lógica del frontend:
          gastosAdm = valor_solicitado * 0.04
          basePrestamo = valor_solicitado + (numero_cuotas * gastosAdm)
          valor_cuota = basePrestamo / numero_cuotas
          saldo_actual = basePrestamo
        """
        from decimal import Decimal, ROUND_HALF_UP

        valor_solicitado = validated_data.get('valor_solicitado', Decimal('0'))
        numero_cuotas = validated_data.get('numero_cuotas', 1)

        try:
            n = int(numero_cuotas)
            if n <= 0:
                n = 1
        except (TypeError, ValueError):
            n = 1

        gastos_adm = valor_solicitado * Decimal('0.04')
        base_prestamo = valor_solicitado + (Decimal(n) * gastos_adm)
        valor_cuota = (base_prestamo / Decimal(n)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        saldo_actual = base_prestamo.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

        validated_data['saldo_actual'] = saldo_actual
        validated_data['valor_cuota'] = valor_cuota

        return super().create(validated_data)

# 🔹 Pago
class PagoSerializer(serializers.ModelSerializer):
    prestamo = PrestamoSerializer(read_only=True)
    prestamo_id = serializers.PrimaryKeyRelatedField(
        queryset=Prestamo.objects.all(), source='prestamo', write_only=True
    )

    class Meta:
        model = Pago
        fields = ['id', 'prestamo', 'prestamo_id', 'fecha_pago', 'monto_abono']
