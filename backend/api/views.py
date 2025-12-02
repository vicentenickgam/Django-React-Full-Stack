from django.contrib.auth.models import User
from rest_framework import generics, viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import (
    UserSerializer, NoteSerializer, AdministradorSerializer,
    EmpleadoSerializer, PrestamoSerializer, PagoSerializer
)
from .models import Note, Administrador, Empleado, Prestamo, Pago


# 🔹 Notas
class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class NoteDelete(generics.DestroyAPIView):
    queryset = Note.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)


# 🔹 Usuario
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# 🔹 Administrador / Empleado
class AdministradorViewSet(viewsets.ModelViewSet):
    queryset = Administrador.objects.all()
    serializer_class = AdministradorSerializer


class EmpleadoViewSet(viewsets.ModelViewSet):
    queryset = Empleado.objects.all()
    serializer_class = EmpleadoSerializer
    permission_classes = [AllowAny]


# 🔹 Préstamo
class PrestamoViewSet(viewsets.ModelViewSet):
    queryset = Prestamo.objects.all()
    serializer_class = PrestamoSerializer
    permission_classes = [AllowAny]


# 🔹 Pago
class PagoViewSet(viewsets.ModelViewSet):
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer
    permission_classes = [AllowAny]  # ✅ Puedes ajustar luego

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        pago = serializer.save()

        # 🔹 Actualizar el saldo del préstamo
        prestamo = pago.prestamo
        prestamo.saldo_actual -= pago.monto_abono

        # 🔹 Si el saldo llega a 0, marcarlo como pagado
        if prestamo.saldo_actual <= 0:
            prestamo.saldo_actual = 0
            prestamo.estado = "Pagado"

        prestamo.save()

        return Response(
            PagoSerializer(pago).data,
            status=status.HTTP_201_CREATED
        )

