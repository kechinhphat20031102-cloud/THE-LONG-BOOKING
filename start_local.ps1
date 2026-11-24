$ErrorActionPreference = 'Stop'
$bookingPython = (Get-Command python -ErrorAction Stop).Source
$bookingServer = Join-Path $PSScriptRoot 'local_server.py'
Start-Process -FilePath $bookingPython -ArgumentList @(('"' + $bookingServer + '"'), '--open') -WorkingDirectory $PSScriptRoot -WindowStyle Hidden -RedirectStandardError (Join-Path $PSScriptRoot 'server-error.log')
