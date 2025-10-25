from django.urls import path
from . import views

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>", views.NoteDelete.as_view(), name= "delete-note"),
]


from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AdministradorViewSet, EmpleadoViewSet, PrestamoViewSet, PagoViewSet

router = DefaultRouter()
router.register('administradores', AdministradorViewSet)
router.register('empleados', EmpleadoViewSet)
router.register('prestamos', PrestamoViewSet)
router.register('pagos', PagoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
