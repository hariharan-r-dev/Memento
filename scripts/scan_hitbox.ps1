Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
using System.Text;

public class NativeTester {
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

    [DllImport("user32.dll")]
    public static extern bool SetCursorPos(int X, int Y);

    [DllImport("user32.dll")]
    public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo);

    [DllImport("user32.dll", EntryPoint = "GetWindowLongPtr")]
    public static extern IntPtr GetWindowLongPtr(IntPtr hWnd, int nIndex);

    [DllImport("user32.dll")]
    public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);

    [DllImport("user32.dll")]
    public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

    [DllImport("user32.dll")]
    public static extern int GetClassName(IntPtr hWnd, StringBuilder lpClassName, int nMaxCount);

    [DllImport("user32.dll")]
    public static extern bool IsWindowVisible(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern uint GetDpiForWindow(IntPtr hWnd);

    public const int GWL_EXSTYLE = -20;
    public const long WS_EX_TRANSPARENT = 0x00000020L;

    public static IntPtr FindOverlayWindow(uint targetProcessId) {
        IntPtr result = IntPtr.Zero;
        EnumWindows((hWnd, lParam) => {
            uint procId = 0;
            GetWindowThreadProcessId(hWnd, out procId);
            if (procId == targetProcessId && IsWindowVisible(hWnd)) {
                RECT r;
                GetWindowRect(hWnd, out r);
                int w = r.Right - r.Left;
                int h = r.Bottom - r.Top;
                if (w > 600 && h > 400) {
                    result = hWnd;
                    return false;
                }
            }
            return true;
        }, IntPtr.Zero);
        return result;
    }

    public static bool IsTransparent(IntPtr hWnd) {
        long exStyle = GetWindowLongPtr(hWnd, GWL_EXSTYLE).ToInt64();
        return (exStyle & WS_EX_TRANSPARENT) != 0;
    }
}

[StructLayout(LayoutKind.Sequential)]
public struct RECT {
    public int Left;
    public int Top;
    public int Right;
    public int Bottom;
}
"@

$proc = Get-Process | Where-Object { $_.Path -like "*Lucky-Charm*" -or $_.ProcessName -like "*Lucky*" } | Select-Object -First 1
if (-not $proc) {
    Write-Error "No Lucky Charm process found."
    exit 1
}

Write-Host "Found Lucky Charm PID: $($proc.Id) ($($proc.ProcessName))"

$mainHwnd = [NativeTester]::FindOverlayWindow([uint32]$proc.Id)
$windowRect = New-Object RECT
[NativeTester]::GetWindowRect($mainHwnd, [ref]$windowRect)
$dpi = [NativeTester]::GetDpiForWindow($mainHwnd)
$scale = if ($dpi -gt 0) { $dpi / 96.0 } else { 1.0 }

$physCenterW = ($windowRect.Right - $windowRect.Left) / 2.0
Write-Host "Window Rect: ($($windowRect.Left), $($windowRect.Top), $($windowRect.Right), $($windowRect.Bottom)) | Scale: $scale | PhysCenter: $physCenterW"

# Scan horizontally across the top bracket (y = 10) from X = 600 to 1000
Write-Host "`nScanning horizontally across Top Bracket (Y=10):"
for ($x = 700; $x -le 850; $x += 10) {
    [NativeTester]::SetCursorPos($x, 10)
    Start-Sleep -Milliseconds 40
    $isTrans = [NativeTester]::IsTransparent($mainHwnd)
    Write-Host "X = $x, Y = 10 -> Interactive = $(-not $isTrans)"
}

# Scan vertically through the center from Y = 0 to 400
Write-Host "`nScanning vertically through physical center (X=$physCenterW):"
for ($y = 0; $y -le 350; $y += 20) {
    [NativeTester]::SetCursorPos([int]$physCenterW, $y)
    Start-Sleep -Milliseconds 40
    $isTrans = [NativeTester]::IsTransparent($mainHwnd)
    Write-Host "X = $physCenterW, Y = $y -> Interactive = $(-not $isTrans)"
}
