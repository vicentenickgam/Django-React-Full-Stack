from django.db import models
from django.contrib.auth.models import User

class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return self.title

class Administrador(models.Model):
    usuario = models.CharField(max_length=100, unique=True)
    contrasena = models.CharField(max_length=100)

    def __str__(self):
        return self.usuario


class Empleado(models.Model):
    ESTADOS = (
        ('Activo', 'Activo'),
        ('Inactivo', 'Inactivo'),
    )

    nombre = models.CharField(max_length=100)
    documento = models.CharField(max_length=50, unique=True)
    cargo = models.CharField(max_length=100)
    estado = models.CharField(max_length=10, choices=ESTADOS, default='Activo')

    def __str__(self):
        return self.nombre


class Prestamo(models.Model):
    ESTADOS = (
        ('Activo', 'Activo'),
        ('Cancelado', 'Cancelado'),
    )

    empleado = models.ForeignKey(Empleado, on_delete=models.CASCADE, related_name='prestamos')
    valor_solicitado = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_inicio = models.DateField()
    numero_cuotas = models.IntegerField()
    valor_cuota = models.DecimalField(max_digits=10, decimal_places=2)
    saldo_actual = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=10, choices=ESTADOS, default='Activo')

    def __str__(self):
        return f"Préstamo {self.id} - {self.empleado.nombre}"


class Pago(models.Model):
    prestamo = models.ForeignKey(Prestamo, on_delete=models.CASCADE, related_name='pagos')
    fecha_pago = models.DateField()
    monto_abono = models.DecimalField(max_digits=10, decimal_places=2)
    saldo_despues_pago = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Pago {self.id} - {self.prestamo.id}"
