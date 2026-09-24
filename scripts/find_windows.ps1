Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
using System.Text;

public class WinFinder {
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

    [DllImport("user32.dll")]
    public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

    [DllImport("user32.dll")]
    public static extern int GetClassName(IntPtr hWnd, StringBuilder lpClassName, int nMaxCount);

    [DllImport("user32.dll")]
    public static extern bool IsWindowVisible(IntPtr hWnd);
}
"@

$enumCallback = [WinFinder+EnumWindowsProc]{
    param($hwnd, $lParam)
    $pidOut = 0
    [void][WinFinder]::GetWindowThreadProcessId($hwnd, [ref]$pidOut)
    $titleSb = New-Object System.Text.StringBuilder 256
    [void][WinFinder]::GetWindowText($hwnd, $titleSb, 256)
    $classSb = New-Object System.Text.StringBuilder 256
    [void][WinFinder]::GetClassName($hwnd, $classSb, 256)
    
    $pname = (Get-Process -Id $pidOut -ErrorAction SilentlyContinue).ProcessName
    if ($pname -like "*lucky*" -or $titleSb.ToString() -like "*Lucky*" -or $classSb.ToString() -like "*tauri*") {
        Write-Host "HWND: $hwnd | PID: $pidOut ($pname) | Title: '$($titleSb.ToString())' | Class: '$($classSb.ToString())' | Visible: $([WinFinder]::IsWindowVisible($hwnd))"
    }
    return $true
}

[void][WinFinder]::EnumWindows($enumCallback, [IntPtr]::Zero)
