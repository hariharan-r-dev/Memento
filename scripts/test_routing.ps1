Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
using System.Text;

public class WinRoutingTest {
    [DllImport("user32.dll")]
    public static extern IntPtr WindowFromPoint(POINT Point);

    [DllImport("user32.dll")]
    public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

    [DllImport("user32.dll")]
    public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

    [DllImport("user32.dll")]
    public static extern int GetClassName(IntPtr hWnd, StringBuilder lpClassName, int nMaxCount);

    [StructLayout(LayoutKind.Sequential)]
    public struct POINT { public int X; public int Y; }
}
"@

# Clean previous processes
Get-Process -Name "Lucky-Charm", "lucky_charm" -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item "$env:TEMP\lucky_charm_monitor.log" -Force -ErrorAction SilentlyContinue
Remove-Item "$env:LOCALAPPDATA\com.luckycharm.desktop\instance.lock" -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 500

$lucky = Start-Process "D:\Hariharan R\Lucky charm\release-bin\Lucky-Charm.exe" -PassThru
Start-Sleep -Seconds 3

Write-Host "Lucky Charm PID: $($lucky.Id)"

# 1. Test click-through at (150, 150) (Desktop/Underlying Area)
$ptOutside = New-Object WinRoutingTest+POINT; $ptOutside.X = 150; $ptOutside.Y = 150
$hitOutside = [WinRoutingTest]::WindowFromPoint($ptOutside)
$pidOutside = 0; [void][WinRoutingTest]::GetWindowThreadProcessId($hitOutside, [ref]$pidOutside)
$sbTitle = New-Object System.Text.StringBuilder 256; [void][WinRoutingTest]::GetWindowText($hitOutside, $sbTitle, 256)
$sbClass = New-Object System.Text.StringBuilder 256; [void][WinRoutingTest]::GetClassName($hitOutside, $sbClass, 256)

Write-Host "`n>>> [TEST 1] Cursor at (150, 150) [OUTSIDE CHARM]:"
Write-Host "   Hit HWND: 0x$($hitOutside.ToInt64().ToString('X'))"
Write-Host "   Hit PID: $pidOutside (Lucky Charm PID is $($lucky.Id))"
Write-Host "   Hit Class: '$($sbClass.ToString())'"
Write-Host "   Hit Title: '$($sbTitle.ToString())'"

$outsidePass = ($pidOutside -ne $lucky.Id)
Write-Host "   Result: $(if ($outsidePass) { 'PASS (Click-through to Windows Desktop/App active)' } else { 'FAIL (Lucky Charm is intercepting input)' })"

# 2. Test hit targeting over Charm Center (Screen center X=768 / 1065, Y=265)
# Wait for monitor thread to sample and toggle interactive mode
$ptInside = New-Object WinRoutingTest+POINT; $ptInside.X = 960; $ptInside.Y = 220
$hitInside = [WinRoutingTest]::WindowFromPoint($ptInside)
$pidInside = 0; [void][WinRoutingTest]::GetWindowThreadProcessId($hitInside, [ref]$pidInside)
$sbTitleIn = New-Object System.Text.StringBuilder 256; [void][WinRoutingTest]::GetWindowText($hitInside, $sbTitleIn, 256)
$sbClassIn = New-Object System.Text.StringBuilder 256; [void][WinRoutingTest]::GetClassName($hitInside, $sbClassIn, 256)

Write-Host "`n>>> [TEST 2] Cursor at (960, 220) [OVER CHARM HITBOX]:"
Write-Host "   Hit HWND: 0x$($hitInside.ToInt64().ToString('X'))"
Write-Host "   Hit PID: $pidInside"
Write-Host "   Hit Class: '$($sbClassIn.ToString())'"
Write-Host "   Hit Title: '$($sbTitleIn.ToString())'"

Stop-Process -Id $lucky.Id -Force
Get-Process -Name "Notepad" -ErrorAction SilentlyContinue | Stop-Process -Force
