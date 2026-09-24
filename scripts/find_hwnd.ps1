Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
using System.Text;

public class WinInspector {
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

    [DllImport("user32.dll")]
    public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);
}

[StructLayout(LayoutKind.Sequential)]
public struct RECT {
    public int Left;
    public int Top;
    public int Right;
    public int Bottom;
}
"@

$procs = Get-Process -Name "Lucky-Charm", "lucky_charm"
Write-Host "Processes found: $($procs.Count)"
foreach ($p in $procs) {
    Write-Host "Process ID: $($p.Id) Name: $($p.Name) MainWindowHandle: $($p.MainWindowHandle)"
}

$enumCallback = [WinInspector+EnumWindowsProc]{
    param($hwnd, $lParam)
    $pidOut = 0
    [void][WinInspector]::GetWindowThreadProcessId($hwnd, [ref]$pidOut)
    $titleSb = New-Object System.Text.StringBuilder 256
    [void][WinInspector]::GetWindowText($hwnd, $titleSb, 256)
    $classSb = New-Object System.Text.StringBuilder 256
    [void][WinInspector]::GetClassName($hwnd, $classSb, 256)
    $rect = New-Object RECT
    [WinInspector]::GetWindowRect($hwnd, [ref]$rect)
    
    foreach ($p in $procs) {
        if ($p.Id -eq $pidOut) {
            Write-Host "HWND: $hwnd | Title: '$($titleSb.ToString())' | Class: '$($classSb.ToString())' | Rect: ($($rect.Left),$($rect.Top),$($rect.Right),$($rect.Bottom)) | Visible: $([WinInspector]::IsWindowVisible($hwnd))"
        }
    }
    return $true
}

[void][WinInspector]::EnumWindows($enumCallback, [IntPtr]::Zero)
