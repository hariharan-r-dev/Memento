Get-Process -Name "Lucky-Charm", "lucky_charm" -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item "$env:TEMP\lucky_charm_monitor.log" -Force -ErrorAction SilentlyContinue
Remove-Item "$env:LOCALAPPDATA\com.luckycharm.desktop\instance.lock" -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 500

$proc = Start-Process "D:\Hariharan R\Lucky charm\release-bin\Lucky-Charm.exe" -PassThru
Start-Sleep -Seconds 4

if (Test-Path "$env:TEMP\lucky_charm_monitor.log") {
    Get-Content "$env:TEMP\lucky_charm_monitor.log"
} else {
    Write-Host "No monitor log found!"
}

if (Test-Path "$env:TEMP\lucky_charm_boot.log") {
    Write-Host "--- BOOT LOG ---"
    Get-Content "$env:TEMP\lucky_charm_boot.log"
}

Stop-Process -Id $proc.Id -Force
