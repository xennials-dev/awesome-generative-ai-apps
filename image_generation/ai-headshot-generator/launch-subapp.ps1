$ErrorActionPreference = "SilentlyContinue"
$appDir = $PSScriptRoot

$conn = Get-NetTCPConnection -LocalPort 3001
if ($conn) {
    $pids = $conn.OwningProcess | Select-Object -Unique
    foreach ($p in $pids) {
        if ($p -gt 0) {
            Stop-Process -Id $p -Force
        }
    }
    Start-Sleep -Seconds 1
}

$cmd = '"C:\Program Files\nodejs\node.exe" "' + $appDir + '\node_modules\next\dist\bin\next" start -p 3001'
$res = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{
    CommandLine = $cmd
    CurrentDirectory = $appDir
}

if ($res.ReturnValue -eq 0) {
    Write-Host "Started ai-headshot-generator (PID $($res.ProcessId)). Waiting for port 3001..."
    for ($i = 0; $i -lt 10; $i++) {
        Start-Sleep -Seconds 1
        $check = Get-NetTCPConnection -LocalPort 3001
        if ($check) {
            Write-Host "SUCCESS: ai-headshot-generator listening on http://localhost:3001"
            break
        }
    }
} else {
    Write-Error "Failed to start process via WMI."
}
