@echo off

REM ==== INICIAR FRONTEND ====
start "" /min cmd /c "cd frontend && npm run dev"

REM ==== INICIAR BACKEND ====
start "" /min cmd /c "cd backend && ..\env\Scripts\activate && python manage.py runserver"

REM ==== ABRIR NAVEGADOR ====
start "" http://localhost:5173
