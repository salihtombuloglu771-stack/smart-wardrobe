@echo off
echo ============================================
echo  Smart Wardrobe AI - Kalici Deploy Script
echo ============================================
echo.

:: GitHub'a push
echo [1/4] GitHub'a yukleniyor...
gh auth login
gh repo create smart-wardrobe --public --source=. --remote=origin --push
echo GitHub tamamlandi!
echo.

:: Railway backend deploy
echo [2/4] Railway backend deploy...
set /p RAILWAY_TOKEN="Railway token'ini yapistir: "
set RAILWAY_API_TOKEN=%RAILWAY_TOKEN%
cd backend
railway login --token %RAILWAY_TOKEN%
railway init --name smart-wardrobe-backend
railway add --database postgres
railway up --detach
for /f "tokens=*" %%a in ('railway domain') do set BACKEND_URL=%%a
echo Backend URL: %BACKEND_URL%
cd ..
echo.

:: Vercel frontend deploy
echo [3/4] Vercel frontend deploy...
cd frontend
npx vercel --prod --yes
for /f "tokens=*" %%a in ('npx vercel ls --json') do set FRONTEND_URL=%%a
cd ..
echo.

echo ============================================
echo  TAMAMLANDI!
echo  Uygulama linki: %FRONTEND_URL%
echo ============================================
pause
