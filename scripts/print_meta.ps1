$files = @(
    "D:\Hariharan R\Lucky charm\release-bin\Lucky-Charm.exe",
    "D:\Hariharan R\Lucky charm\release-bin\Lucky-Charm-Setup.exe",
    "C:\Users\HarisH\AppData\Local\Temp\lucky-charm-target\release\lucky_charm.exe",
    "C:\Users\HarisH\AppData\Local\Temp\lucky-charm-target\release\bundle\nsis\Lucky Charm_0.1.0_x64-setup.exe",
    "C:\Users\HarisH\AppData\Local\Temp\lucky-charm-target\release\bundle\msi\Lucky Charm_0.1.0_x64_en-US.msi"
)
foreach ($f in $files) {
    if (Test-Path $f) {
        $item = Get-Item $f
        Write-Host "PATH: $($item.FullName)"
        Write-Host "SIZE: $($item.Length) bytes ($([Math]::Round($item.Length / 1MB, 2)) MB)"
        Write-Host "TIMESTAMP: $($item.LastWriteTime.ToString('yyyy-MM-dd HH:mm:ss.fff zzz'))"
        Write-Host "--------------------------------------------------"
    }
}
