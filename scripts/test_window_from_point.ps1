Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
using System.Text;

public class WinPointTest {
    [DllImport("user32.dll")]
    public static extern IntPtr WindowFromPoint(POINT Point);

    [DllImport("user32.dll")]
    public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

    [DllImport("user32.dll")]
    public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

    [DllImport("user32.dll")]
    public static extern int GetClassName(IntPtr hWnd, StringBuilder lpClassName, int nMaxCount);

    [DllImport("user32.dll", EntryPoint = "GetWindowLongPtrW")]
    public static extern IntPtr GetWindowLongPtrW(IntPtr hWnd, int nIndex);

    [StructLayout(LayoutKind.Sequential)]
    public struct POINT { public int X; public int Y; }

    public const int GWL_EXSTYLE = -20;
}
"@

$proc = Start-Process "D:\Hariharan R\Lucky charm\release-bin\Lucky-Charm.exe" -PassThru
Start-Sleep -Seconds 3

Write-Host "Lucky Charm PID: $($proc.Id)"

# 1. Point at (200, 200) - Empty desktop area outside charm
$ptEmpty = New-Object WinPointTest+POINT; $ptEmpty.X = 200; $ptEmpty.Y = 200
$hwndEmpty = [WinPointTest]::WindowFromPoint($ptEmpty)
$pidEmpty = 0; [void][WinPointTest]::GetWindowThreadProcessId($hwndEmpty, [ref]$pidEmpty)
$sbTitle = New-Object System.Text.StringBuilder 256; [void][WinPointTest]::GetWindowText($hwndEmpty, $sbTitle, 256)
$sbClass = New-Object System.Text.StringBuilder 256; [void][WinPointTest]::GetClassName($hwndEmpty, $sbClass, 256)

Write-Host "`n[TEST A] WindowFromPoint(200, 200) [OUTSIDE CHARM]:"
Write-Host "   Hit HWND: 0x$($hwndEmpty.ToInt64().ToString('X'))"
Write-Host "   Hit PID: $pidEmpty"
Write-Host "   Hit Class: '$($sbClass.ToString())'"
Write-Host "   Hit Title: '$($sbTitle.ToString())'"
$isLuckyCharmEmpty = ($pidEmpty -eq $proc.Id)
Write-Host "   -> Is Lucky Charm consuming click? $isLuckyCharmEmpty"
if (-not $isLuckyCharmEmpty) {
    Write-Host "   >>> SUCCESS: Underneath desktop/app receives mouse input! <<<"
} else {
    Write-Host "   >>> BLOCKED: Lucky Charm is still intercepting input! <<<"
}

# 2. Point at (100, 100)
$pt100 = New-Object WinPointTest+POINT; $pt100.X = 100; $pt100.Y = 100
$hwnd100 = [WinPointTest]::WindowFromPoint($pt100)
$pid100 = 0; [void][WinPointTest]::GetWindowThreadProcessId($hwnd100, [ref]$pid100)
$sbTitle100 = New-Object System.Text.StringBuilder 256; [void][WinPointTest]::GetWindowText($hwnd100, $sbTitle100, 256)
$sbClass100 = New-Object System.Text.StringBuilder 256; [void][WinPointTest]::GetClassName($hwnd100, $sbClass100, 256)

Write-Host "`n[TEST B] WindowFromPoint(100, 100) [OUTSIDE CHARM]:"
Write-Host "   Hit HWND: 0x$($hwnd100.ToInt64().ToString('X'))"
Write-Host "   Hit PID: $pid100"
Write-Host "   Hit Class: '$($sbClass100.ToString())'"
Write-Host "   Hit Title: '$($sbTitle100.ToString())'"
$isLuckyCharm100 = ($pid100 -eq $proc.Id)
Write-Host "   -> Is Lucky Charm consuming click? $isLuckyCharm100"

Stop-Process -Id $proc.Id -Force
