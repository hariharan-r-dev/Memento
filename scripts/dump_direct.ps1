Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
using System.Text;

public class DirectHwnd {
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern bool EnumChildWindows(IntPtr hWndParent, EnumWindowsProc lpEnumFunc, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

    [DllImport("user32.dll")]
    public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

    [DllImport("user32.dll")]
    public static extern int GetClassName(IntPtr hWnd, StringBuilder lpClassName, int nMaxCount);

    [DllImport("user32.dll", EntryPoint = "GetWindowLongPtrW")]
    public static extern IntPtr GetWindowLongPtrW(IntPtr hWnd, int nIndex);

    [DllImport("user32.dll")]
    public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);

    [DllImport("user32.dll")]
    public static extern bool IsWindowVisible(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern IntPtr GetWindow(IntPtr hWnd, uint uCmd);

    [StructLayout(LayoutKind.Sequential)]
    public struct RECT { public int Left; public int Top; public int Right; public int Bottom; }

    public const int GWL_STYLE = -16;
    public const int GWL_EXSTYLE = -20;
}
"@

Get-Process -Name "Lucky-Charm", "lucky_charm" -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item "$env:TEMP\lucky_charm_monitor.log" -Force -ErrorAction SilentlyContinue
Remove-Item "$env:LOCALAPPDATA\com.luckycharm.desktop\instance.lock" -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 500

$proc = Start-Process "D:\Hariharan R\Lucky charm\release-bin\Lucky-Charm.exe" -PassThru
Start-Sleep -Seconds 3

$log = Get-Content "$env:TEMP\lucky_charm_monitor.log"
$mainHwndHex = ""
foreach ($l in $log) {
    if ($l -match "raw_hwnd=(0x[0-9A-Fa-f]+)") {
        $mainHwndHex = $matches[1]
        break
    }
}

Write-Host "Main HWND from log: $mainHwndHex"

if ($mainHwndHex) {
    $mainHwnd = [IntPtr][Convert]::ToInt64($mainHwndHex, 16)
    
    $sbClass = New-Object System.Text.StringBuilder 256
    [void][DirectHwnd]::GetClassName($mainHwnd, $sbClass, 256)
    $sbTitle = New-Object System.Text.StringBuilder 256
    [void][DirectHwnd]::GetWindowText($mainHwnd, $sbTitle, 256)
    $style = [DirectHwnd]::GetWindowLongPtrW($mainHwnd, [DirectHwnd]::GWL_STYLE).ToInt64()
    $exStyle = [DirectHwnd]::GetWindowLongPtrW($mainHwnd, [DirectHwnd]::GWL_EXSTYLE).ToInt64()
    $rect = New-Object DirectHwnd+RECT
    [void][DirectHwnd]::GetWindowRect($mainHwnd, [ref]$rect)
    $vis = [DirectHwnd]::IsWindowVisible($mainHwnd)
    $pidOut = 0
    [void][DirectHwnd]::GetWindowThreadProcessId($mainHwnd, [ref]$pidOut)

    Write-Host "`n>>> TAURI MAIN HWND: 0x$($mainHwnd.ToInt64().ToString('X'))"
    Write-Host "   PID: $pidOut"
    Write-Host "   Class: $($sbClass.ToString())"
    Write-Host "   Title: '$($sbTitle.ToString())'"
    Write-Host "   Visible: $vis"
    Write-Host "   Style: 0x$($style.ToString('X'))"
    Write-Host "   ExStyle: 0x$($exStyle.ToString('X'))"
    Write-Host "   Rect: ($($rect.Left), $($rect.Top), $($rect.Right), $($rect.Bottom))"

    Write-Host "`n--- ENUMERATING ALL CHILD HWNDS OF TAURI MAIN HWND ---"
    $childCallback = [DirectHwnd+EnumWindowsProc]{
        param($cHwnd, $cLParam)
        $sbCClass = New-Object System.Text.StringBuilder 256
        [void][DirectHwnd]::GetClassName($cHwnd, $sbCClass, 256)
        $sbCTitle = New-Object System.Text.StringBuilder 256
        [void][DirectHwnd]::GetWindowText($cHwnd, $sbCTitle, 256)
        $cPid = 0
        [void][DirectHwnd]::GetWindowThreadProcessId($cHwnd, [ref]$cPid)
        $cStyle = [DirectHwnd]::GetWindowLongPtrW($cHwnd, [DirectHwnd]::GWL_STYLE).ToInt64()
        $cExStyle = [DirectHwnd]::GetWindowLongPtrW($cHwnd, [DirectHwnd]::GWL_EXSTYLE).ToInt64()
        $cVis = [DirectHwnd]::IsWindowVisible($cHwnd)
        $cRect = New-Object DirectHwnd+RECT
        [void][DirectHwnd]::GetWindowRect($cHwnd, [ref]$cRect)

        Write-Host "   Child HWND: 0x$($cHwnd.ToInt64().ToString('X')) | PID: $cPid | Class: '$($sbCClass.ToString())' | Title: '$($sbCTitle.ToString())' | Visible: $cVis | Style: 0x$($cStyle.ToString('X')) | ExStyle: 0x$($cExStyle.ToString('X')) | Rect: ($($cRect.Left), $($cRect.Top), $($cRect.Right), $($cRect.Bottom))"
        return $true
    }
    [void][DirectHwnd]::EnumChildWindows($mainHwnd, $childCallback, [IntPtr]::Zero)
}

Stop-Process -Id $proc.Id -Force
