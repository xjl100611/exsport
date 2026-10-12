@echo off
rem Keep-alive wrapper for the exsport static server.
rem ASCII comments only: cmd.exe parses this file with the OEM codepage,
rem and non-ASCII bytes can be mistaken for command separators.
setlocal

rem Absolute path to node so a not-yet-ready PATH cannot break startup.
set "NODEEXE=D:\cc-switch\node.js\node.exe"

:waitready
rem Wait until the project folder and the server script are reachable.
cd /d "%~dp0.." 2>nul
if errorlevel 1 (
  timeout /t 5 /nobreak >nul
  goto waitready
)
if not exist "scripts\serve-dist.mjs" (
  timeout /t 5 /nobreak >nul
  goto waitready
)
if not exist "%NODEEXE%" set "NODEEXE=node"

echo [%date% %time%] watcher started>>"serve-loop.log"

:loop
echo [%date% %time%] starting server>>"serve-loop.log"
"%NODEEXE%" scripts\serve-dist.mjs>>"serve-loop.log" 2>&1
echo [%date% %time%] server exited, restart in 3s>>"serve-loop.log"
timeout /t 3 /nobreak >nul
goto loop
