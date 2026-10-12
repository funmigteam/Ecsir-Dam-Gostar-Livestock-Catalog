$ErrorActionPreference = 'Stop'

$portInUse = Get-NetTCPConnection -State Listen -LocalPort 8002 -ErrorAction SilentlyContinue
if ($portInUse) {
    exit 0
}

$appDir = $PSScriptRoot
$python = 'python'
$arguments = '-m waitress --host=127.0.0.1 --port=8002 ecsir_site.wsgi:application'

Start-Process `
    -FilePath $python `
    -ArgumentList $arguments `
    -WorkingDirectory $appDir `
    -WindowStyle Hidden `
    -RedirectStandardOutput (Join-Path $appDir 'logs\ecsir.log') `
    -RedirectStandardError (Join-Path $appDir 'logs\ecsir_error.log')
