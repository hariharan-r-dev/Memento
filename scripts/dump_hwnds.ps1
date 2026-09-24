Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
using System.Text;
using System.Collections.Generic;

public class WinTree3 {
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);

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
    public static extern IntPtr WindowFromPoint(POINT Point);

    [StructLayout(LayoutKind.Sequential)]
    public struct POINT { public int X; public int Y; }

    [StructLayout(LayoutKind.Sequential)]
    public struct RECT { public int Left; public int Top; public int Right; public int Bottom; }

    public const int GWL_STYLE = -16;
    public const int GWL_EXSTYLE = -20;
}
"@

$proc = Start-Process "D:\Hariharan R\Lucky charm\release-bin\Lucky-Charm.exe" -PassThru
Start-Sleep -Seconds 4

$pids = @($proc.Id)
Get-Process -Name "Lucky-Charm", "lucky_charm", "msedgewebview2" -ErrorAction SilentlyContinue | ForEach-Object {
    $pids += $_.Id
}
$pids = $pids | Select-Object -Unique

Write-Host "Target PIDs: $($pids -join ', ')"

$enumProc = [WinTree3+EnumWindowsProc]{
    param($hwnd, $lParam)
    $pidOut = 0
    [void][WinTree3]::GetWindowThreadProcessId($hwnd, [ref]$pidOut)

    if ($script:pids -contains $pidOut) {
        $sbClass = New-Object System.Text.StringBuilder 256
        [void][WinTree3]::GetClassName($hwnd, $sbClass, 256)
        $sbTitle = New-Object System.Text.StringBuilder 256
        [void][WinTree3]::GetWindowText($hwnd, $sbTitle, 256)
        $style = [WinTree3]::GetWindowLongPtrW($hwnd, [WinTree3]::GWL_STYLE).ToInt64()
        $exStyle = [WinTree3]::GetWindowLongPtrW($hwnd, [WinTree3]::GWL_EXSTYLE).ToInt64()
        $vis = [WinTree3]::IsWindowVisible($hwnd)
        $rect = New-Object WinTree3+RECT
        [void][WinTree3]::GetWindowRect($hwnd, [ref]$rect)

        Write-Host "`n>>> TOP HWND: 0x$($hwnd.ToInt64().ToString('X')) | PID=$pidOut | Visible=$vis | Class='$($sbClass.ToString())' | Title='$($sbTitle.ToString())' | Style=0x$($style.ToString('X')) | ExStyle=0x$($exStyle.ToString('X')) | Rect=($($rect.Left), $($rect.Top), $($rect.Right), $($rect.Bottom))"

        $childEnum = [WinTree3+EnumWindowsProc]{
            param($childHwnd, $childLParam)
            $sbCClass = New-Object System.Text.StringBuilder 256
            [void][WinTree3]::GetClassName($childHwnd, $sbCClass, 256)
            $sbCTitle = New-Object System.Text.StringBuilder 256
            [void][WinTree3]::GetWindowText($childHwnd, $sbCTitle, 256)
            $cPid = 0
            [void][WinTree3]::GetWindowThreadProcessId($childHwnd, [ref]$cPid)
            $cStyle = [WinTree3]::GetWindowLongPtrW($childHwnd, [WinTree3]::GWL_STYLE).ToInt64()
            $cExStyle = [WinTree3]::GetWindowLongPtrW($childHwnd, [WinTree3]::GWL_EXSTYLE).ToInt64()
            $cVis = [WinTree3]::IsWindowVisible($childHwnd)
            $cRect = New-Object WinTree3+RECT
            [void][WinTree3]::GetWindowRect($childHwnd, [ref]$cRect)

            Write-Host "   --- CHILD HWND: 0x$($childHwnd.ToInt64().ToString('X')) | PID=$cPid | Visible=$cVis | Class='$($sbCClass.ToString())' | Title='$($sbCTitle.ToString())' | Style=0x$($cStyle.ToString('X')) | ExStyle=0x$($cExStyle.ToString('X')) | Rect=($($cRect.Left), $($cRect.Top), $($cRect.Right), $($cRect.Bottom))"
            return $true
        }
        [void][WinTree3]::EnumChildWindows($hwnd, $childEnum, [IntPtr]::Zero)
    }
    return $true
}

[void][WinTree3]::EnumWindows($enumProc, [IntPtr]::Zero)

Stop-Process -Id $proc.Id -Force
