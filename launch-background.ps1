# Awesome Generative AI Apps Hub - Decoupled Background Launcher
$ErrorActionPreference = "Stop"
$appDir = $PSScriptRoot

Write-Host "Checking for existing process on port 3000..." -ForegroundColor Cyan
$existingConn = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($existingConn) {
    $pids = $existingConn.OwningProcess | Select-Object -Unique
    foreach ($p in $pids) {
        if ($p -gt 0) {
            Write-Host "Terminating existing process on port 3000 (PID $p)..." -ForegroundColor Yellow
            Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
        }
    }
    Start-Sleep -Seconds 1
}

Write-Host "Starting Next.js Production Server as a decoupled Windows process..." -ForegroundColor Cyan
$cmd = '"C:\Program Files\nodejs\node.exe" "' + $appDir + '\node_modules\next\dist\bin\next" start -p 3000'
$res = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{
    CommandLine = $cmd
    CurrentDirectory = $appDir
}

if ($res.ReturnValue -eq 0) {
    Write-Host "Process created successfully (PID $($res.ProcessId)). Waiting for port 3000 to bind..." -ForegroundColor Green
    $bound = $false
    for ($i = 0; $i -lt 10; $i++) {
        Start-Sleep -Seconds 1
        $conn = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
        if ($conn) {
            $bound = $true
            break
        }
    }
    if ($bound) {
        Write-Host "SUCCESS: Hub is listening on http://localhost:3000" -ForegroundColor Green
    } else {
        Write-Warning "Process started, but port 3000 is still initializing. Check http://localhost:3000 in a few seconds."
    }
} else {
    Write-Error "Failed to start process via WMI. Return value: $($res.ReturnValue)"
}
