Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
using System.Text;

public class WinUnderlyingTest {
    [DllImport("user32.dll")]
    public static extern IntPtr WindowFromPoint(POINT Point);

    [DllImport("user32.dll")]
    public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

    [DllImport("user32.dll")]
    public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

    [DllImport("user32.dll")]
    public static extern int GetClassName(IntPtr hWnd, StringBuilder lpClassName, int nMaxCount);

    [DllImport("user32.dll")]
    public static extern bool SetWindowPos(IntPtr hWnd, IntPtr hWndInsertAfter, int X, int Y, int cx, int cy, uint uFlags);

    [StructLayout(LayoutKind.Sequential)]
    public struct POINT { public int X; public int Y; }
}
"@

# 1. Start Notepad
$notepad = Start-Process "notepad.exe" -PassThru
Start-Sleep -Seconds 1
[WinUnderlyingTest]::SetWindowPos($notepad.MainWindowHandle, [IntPtr]::Zero, 100, 100, 500, 400, 0x0040)

# 2. Start Lucky Charm
$lucky = Start-Process "D:\Hariharan R\Lucky charm\release-bin\Lucky-Charm.exe" -PassThru
Start-Sleep -Seconds 3

Write-Host "Notepad PID: $($notepad.Id) | HWND: 0x$($notepad.MainWindowHandle.ToInt64().ToString('X'))"
Write-Host "Lucky Charm PID: $($lucky.Id)"

# 3. Test WindowFromPoint inside Notepad's area (250, 250)
$pt = New-Object WinUnderlyingTest+POINT; $pt.X = 250; $pt.Y = 250
$hitHwnd = [WinUnderlyingTest]::WindowFromPoint($pt)
$hitPid = 0; [void][WinUnderlyingTest]::GetWindowThreadProcessId($hitHwnd, [ref]$hitPid)
$sbTitle = New-Object System.Text.StringBuilder 256; [void][WinUnderlyingTest]::GetWindowText($hitHwnd, $sbTitle, 256)
$sbClass = New-Object System.Text.StringBuilder 256; [void][WinUnderlyingTest]::GetClassName($hitHwnd, $sbClass, 256)

Write-Host "`n>>> WindowFromPoint(250, 250) with Notepad directly behind fullscreen Lucky Charm overlay:"
Write-Host "   Hit HWND: 0x$($hitHwnd.ToInt64().ToString('X'))"
Write-Host "   Hit PID: $hitPid"
Write-Host "   Hit Class: '$($sbClass.ToString())'"
Write-Host "   Hit Title: '$($sbTitle.ToString())'"

if ($hitPid -eq $notepad.Id) {
    Write-Host "`n========================================================"
    Write-Host "VERIFIED: NOTEPAD RECEIVED HIT-TEST THROUGH LUCKY CHARM!"
    Write-Host "========================================================"
} else {
    Write-Host "`nFAILED: Hit target was PID $hitPid instead of Notepad ($($notepad.Id))"
}

Stop-Process -Id $lucky.Id -Force
Stop-Process -Id $notepad.Id -Force
