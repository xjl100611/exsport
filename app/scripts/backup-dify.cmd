@echo off
rem Run the Dify database backup once per day (invoked at logon by run-backup-dify.vbs)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0backup-dify.ps1"
