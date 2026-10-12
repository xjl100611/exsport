@echo off
rem Wait for the Docker engine, then make sure the services are running.
rem Safe by design: it only starts stopped containers, never stops or removes anything.
setlocal

set MAX_WAIT=60
set /a waited=0

:waitloop
docker info >nul 2>&1
if %errorlevel%==0 goto ready
if %waited% GEQ %MAX_WAIT% goto giveup
timeout /t 5 /nobreak >nul
set /a waited+=5
goto waitloop

:ready
rem Dify: reverse proxy and the two outbound proxy containers
docker start docker-nginx-1 >nul 2>&1
docker start docker-ssrf_proxy-1 >nul 2>&1
docker start docker-agent_ssrf_proxy-1 >nul 2>&1

rem exsport static site is started by exsport-static.vbs in the same folder
exit /b 0

:giveup
exit /b 1
