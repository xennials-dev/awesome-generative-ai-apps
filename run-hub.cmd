@echo off
title Awesome Generative AI Apps Hub (localhost:3000)
cd /d "%~dp0"
echo ==========================================================
echo Starting Awesome Generative AI Apps Hub on http://localhost:3000
echo ==========================================================
"C:\Program Files\nodejs\node.exe" "./node_modules/next/dist/bin/next" start -p 3000
if %ERRORLEVEL% neq 0 (
  echo Server stopped or encountered an error.
  pause
)
