@echo off
echo ========================================
echo PAPI Central - Quick Deploy Script
echo ========================================
echo.
echo Choose deployment method:
echo.
echo 1. Netlify Drag-and-Drop (Easiest)
echo    - Go to: https://app.netlify.com/drop
echo    - Drag the PAPI Central folder
echo    - Get instant link!
echo.
echo 2. GitHub + Netlify (Automatic)
echo    - Create repo at: https://github.com/new
echo    - Name it: papi-central
echo    - Run these commands:
echo.
echo    git remote add origin https://github.com/YOUR-USERNAME/papi-central.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo    Then connect to Netlify for auto-deploy!
echo.
echo 3. Vercel Deploy
echo    - Go to: https://vercel.com/new
echo    - Import from Git
echo    - Deploy!
echo.
echo ========================================
echo Your local server is still running at:
echo http://localhost:8000
echo ========================================
pause
