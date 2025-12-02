from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.db.models import Sum, F, DecimalField, ExpressionWrapper
from .models import Prestamo, Pago

class ReportePrestamosView(APIView):
    """
    Vista solo para reportes de préstamos.
    No modifica ninguna tabla, solo calcula valores.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        prestamos = (
            Prestamo.objects.annotate(
                total_abonado=Sum("pago__monto_abono"),
                base_prestamo=ExpressionWrapper(
                    F("valor_solicitado") + (F("valor_solicitado") * F("interes") / 100),
                    output_field=DecimalField()
                ),
                saldo_actual=ExpressionWrapper(
                    F("valor_solicitado") + (F("valor_solicitado") * F("interes") / 100)
                    - Sum("pago__monto_abono"),
                    output_field=DecimalField()
                ),
            )
            .values(
                "id",
                "empleado__nombre",
                "valor_solicitado",
                "interes",
                "base_prestamo",
                "total_abonado",
                "saldo_actual",
            )
        )

        # Reemplaza None por 0 si no hay pagos
        for p in prestamos:
            p["total_abonado"] = p["total_abonado"] or 0
            p["saldo_actual"] = p["saldo_actual"] or p["base_prestamo"]

        return Response(list(prestamos))
