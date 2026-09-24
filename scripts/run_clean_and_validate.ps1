# 1. Stop all Lucky Charm processes and clean stale logs
Stop-Process -Name 'Lucky-Charm*', 'lucky_charm*' -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1
Remove-Item "$env:TEMP\lucky_charm_*.log" -Force -ErrorAction SilentlyContinue

$procs = Get-Process -Name 'Lucky-Charm*', 'lucky_charm*' -ErrorAction SilentlyContinue
if ($procs) {
    Write-Host "WARNING: Processes still running!"
    exit 1
} else {
    Write-Host "CLEAN: 0 Lucky Charm processes running."
}

# 2. Launch ONLY D:\Hariharan R\Lucky charm\release-bin\Lucky-Charm.exe
$targetExe = "d:\Hariharan R\Lucky charm\release-bin\Lucky-Charm.exe"
Write-Host "Launching Target Executable: $targetExe"
$proc = Start-Process -FilePath $targetExe -PassThru
Write-Host "Started Lucky-Charm.exe with PID: $($proc.Id)"

# 3. Wait for WebView2 and overlay window initialization
Start-Sleep -Seconds 3

# 4. Run Physical Validation Suite
Write-Host "`nRunning Physical Validation Suite..."
& "d:\Hariharan R\Lucky charm\scripts\FullPhysicalValidator.exe"
