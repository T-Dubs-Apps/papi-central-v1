@echo off
REM Simple backup script for PAPI Central
set BACKUP_DIR="%~dp0_papi_backup\%DATE:~10,4%%DATE:~4,2%%DATE:~7,2%_%TIME:~0,2%%TIME:~3,2%%TIME:~6,2%"
mkdir %BACKUP_DIR%
robocopy . %BACKUP_DIR% /E /XD node_modules __pycache__ .git .github

echo Backup complete: %BACKUP_DIR%
pause
