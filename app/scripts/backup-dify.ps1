# Daily Dify database backup (keeps the latest 14 dumps).
# ASCII only on purpose: Windows PowerShell reads this file with the OEM codepage,
# and non-ASCII comments can break parsing (same issue as the .cmd wrappers).
$ErrorActionPreference = 'Stop'

# Resolve the backup folder relative to this script (no non-ASCII literals in the script).
$root = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..\..\backups\dify'))
New-Item -ItemType Directory -Force -Path $root | Out-Null

$today = Get-Date -Format 'yyyyMMdd'
$dump = Join-Path $root "dify-$today.sql"
if (Test-Path $dump) {
  Write-Output "already backed up today: $dump"
  exit 0
}

$container = 'docker-db_postgres-1'
$running = docker ps --filter "name=$container" --format '{{.Names}}' 2>$null
if (-not $running) {
  Write-Output 'dify db container is not running, skip this run'
  exit 1
}

# Dump inside the container first, then copy out, to avoid encoding issues.
docker exec $container sh -c 'pg_dump -U postgres -d dify > /tmp/dify-dump.sql'
docker cp "${container}:/tmp/dify-dump.sql" $dump
docker exec $container sh -c 'rm -f /tmp/dify-dump.sql'

$size = [math]::Round((Get-Item $dump).Length / 1KB)
Write-Output "backup done: $dump ($size KB)"

Get-ChildItem $root -Filter 'dify-*.sql' |
  Sort-Object LastWriteTime -Descending |
  Select-Object -Skip 14 |
  Remove-Item -Force -ErrorAction SilentlyContinue
