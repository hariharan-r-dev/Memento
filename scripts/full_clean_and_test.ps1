Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
using System.Text;
using System.Collections.Generic;

public class NativeTester {
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

    [DllImport("user32.dll")]
    public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);

    [DllImport("user32.dll")]
    public static extern bool GetCursorPos(out POINT lpPoint);

    [DllImport("user32.dll")]
    public static extern bool SetCursorPos(int X, int Y);

    [DllImport("user32.dll")]
    public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, int dwExtraInfo);

    [DllImport("user32.dll")]
    public static extern IntPtr WindowFromPoint(POINT Point);

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

    public const uint MOUSEEVENTF_LEFTDOWN = 0x0002;
    public const uint MOUSEEVENTF_LEFTUP   = 0x0004;
    public const int GWL_EXSTYLE = -20;
    public const long WS_EX_TRANSPARENT = 0x00000020L;

    public static IntPtr FindOverlayWindow(uint targetProcessId) {
        IntPtr result = IntPtr.Zero;
        EnumWindows((hWnd, lParam) => {
            uint procId = 0;
            GetWindowThreadProcessId(hWnd, out procId);
            if (procId == targetProcessId && IsWindowVisible(hWnd)) {
                StringBuilder title = new StringBuilder(256);
                GetWindowText(hWnd, title, 256);
                StringBuilder cls = new StringBuilder(256);
                GetClassName(hWnd, cls, 256);
                
                RECT r;
                GetWindowRect(hWnd, out r);
                int w = r.Right - r.Left;
                int h = r.Bottom - r.Top;

                // Main overlay is full screen
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
public struct POINT {
    public int X;
    public int Y;
}

[StructLayout(LayoutKind.Sequential)]
public struct RECT {
    public int Left;
    public int Top;
    public int Right;
    public int Bottom;
}
"@

Write-Host "============================================="
Write-Host "1. TERMINATING ALL OLD PROCESSES"
Write-Host "============================================="
Get-Process -Name "Lucky-Charm", "lucky_charm" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

Write-Host "`n============================================="
Write-Host "2. LAUNCHING FRESH RELEASE-BIN EXECUTABLE"
Write-Host "============================================="
$releaseBin = "D:\Hariharan R\Lucky charm\release-bin"
$exePath = "$releaseBin\Lucky-Charm.exe"
$homeDir = [System.Environment]::GetFolderPath('UserProfile')
$mingwBin = Join-Path $homeDir "AppData\Local\Microsoft\WinGet\Packages\BrechtSanders.WinLibs.POSIX.UCRT_Microsoft.Winget.Source_8wekyb3d8bbwe\mingw64\bin"

$env:PATH = "$releaseBin;$mingwBin;$env:PATH"
$env:Path = "$releaseBin;$mingwBin;$env:Path"

$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = $exePath
$psi.WorkingDirectory = $releaseBin
$psi.UseShellExecute = $false
$targetProc = [System.Diagnostics.Process]::Start($psi)
Start-Sleep -Seconds 4

Write-Host "Launched PID: $($targetProc.Id) (Running: $(-not $targetProc.HasExited))"

$mainHwnd = [NativeTester]::FindOverlayWindow([uint32]$targetProc.Id)
if ($mainHwnd -eq [IntPtr]::Zero) {
    $allProcs = Get-Process -Name "Lucky-Charm", "lucky_charm"
    foreach ($pr in $allProcs) {
        $h = [NativeTester]::FindOverlayWindow([uint32]$pr.Id)
        if ($h -ne [IntPtr]::Zero) {
            $mainHwnd = $h
            break
        }
    }
}

Write-Host "Main Overlay HWND: $mainHwnd"
if ($mainHwnd -eq [IntPtr]::Zero) {
    Write-Error "Could not locate Main Overlay HWND."
    exit 1
}

$windowRect = New-Object RECT
[NativeTester]::GetWindowRect($mainHwnd, [ref]$windowRect)
$dpi = [NativeTester]::GetDpiForWindow($mainHwnd)
$scale = if ($dpi -gt 0) { $dpi / 96.0 } else { 1.0 }

Write-Host "Window Rect: ($($windowRect.Left), $($windowRect.Top), $($windowRect.Right), $($windowRect.Bottom)) | DPI: $dpi (Scale: $scale)"

function Test-CssPoint($hwnd, $cssX, $cssY, $name, $scaleFactor) {
    $physX = [int]($windowRect.Left + ($cssX * $scaleFactor))
    $physY = [int]($windowRect.Top + ($cssY * $scaleFactor))
    
    [NativeTester]::SetCursorPos($physX, $physY)
    Start-Sleep -Milliseconds 75
    
    $isTrans = [NativeTester]::IsTransparent($hwnd)
    
    [PSCustomObject]@{
        Target = $name
        CssCoord = "($cssX, $cssY)"
        PhysCoord = "($physX, $physY)"
        ClickThrough_Active = $isTrans
        LuckyCharm_Captures = (-not $isTrans)
    }
}

$results = @()

Write-Host "`n============================================="
Write-Host "3. TESTING EMPTY DESKTOP CLICK-THROUGH"
Write-Host "============================================="
$results += Test-CssPoint $mainHwnd 100 100 "Empty Top-Left Desktop" $scale
$results += Test-CssPoint $mainHwnd 1800 100 "Empty Top-Right Desktop" $scale
$results += Test-CssPoint $mainHwnd 100 950 "Empty Bottom-Left Desktop" $scale
$results += Test-CssPoint $mainHwnd 1800 950 "Empty Bottom-Right Desktop" $scale
$results += Test-CssPoint $mainHwnd 700 200 "260px Left of Charm" $scale
$results += Test-CssPoint $mainHwnd 1220 200 "260px Right of Charm" $scale
$results += Test-CssPoint $mainHwnd 960 550 "300px Below Charm" $scale

Write-Host "`n============================================="
Write-Host "4. TESTING RED CAR CHARM INTERACTION HITBOX"
Write-Host "============================================="
$results += Test-CssPoint $mainHwnd 960 145 "Car Upper Attachment Loop" $scale
$results += Test-CssPoint $mainHwnd 960 210 "Car Center Hood / Body" $scale
$results += Test-CssPoint $mainHwnd 930 250 "Car Front Bumper" $scale
$results += Test-CssPoint $mainHwnd 990 190 "Car Rear Spoiler" $scale
$results += Test-CssPoint $mainHwnd 920 270 "Car Front Wheel Area" $scale
$results += Test-CssPoint $mainHwnd 995 240 "Car Rear Wheel Area" $scale
$results += Test-CssPoint $mainHwnd 950 200 "Car Windshield" $scale
$results += Test-CssPoint $mainHwnd 975 215 "Car Side Window / Mirror" $scale

Write-Host "`n============================================="
Write-Host "5. TESTING ROPE CORRIDOR & TOP BRACKET"
Write-Host "============================================="
$results += Test-CssPoint $mainHwnd 960 10 "Top Mounting Bracket" $scale
$results += Test-CssPoint $mainHwnd 960 60 "Braided Rope Corridor" $scale

Write-Host "`n============================================="
Write-Host "6. TESTING DRAG INTERACTION"
Write-Host "============================================="
$startPhysX = [int]($windowRect.Left + (960 * $scale))
$startPhysY = [int]($windowRect.Top + (210 * $scale))
[NativeTester]::SetCursorPos($startPhysX, $startPhysY)
Start-Sleep -Milliseconds 60
[NativeTester]::mouse_event([NativeTester]::MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0)
Start-Sleep -Milliseconds 50

# Move while dragging
for ($i = 0; $i -le 8; $i++) {
    $curPhysX = [int]($startPhysX - ($i * 15 * $scale))
    $curPhysY = [int]($startPhysY + ($i * 10 * $scale))
    [NativeTester]::SetCursorPos($curPhysX, $curPhysY)
    Start-Sleep -Milliseconds 16
}

$dragCaptured = (-not [NativeTester]::IsTransparent($mainHwnd))
Write-Host "During Active Drag: Window Captures Mouse = $dragCaptured"

[NativeTester]::mouse_event([NativeTester]::MOUSEEVENTF_LEFTUP, 0, 0, 0, 0)
Start-Sleep -Milliseconds 100

$emptyPhysX = [int]($windowRect.Left + (150 * $scale))
$emptyPhysY = [int]($windowRect.Top + (150 * $scale))
[NativeTester]::SetCursorPos($emptyPhysX, $emptyPhysY)
Start-Sleep -Milliseconds 75
$clickThroughRestored = [NativeTester]::IsTransparent($mainHwnd)
Write-Host "After Releasing to Empty Desktop: Click-Through Restored = $clickThroughRestored"

Write-Host "`n============================================="
Write-Host "COMPLETE HIT-TEST VALIDATION SUMMARY TABLE:"
Write-Host "============================================="
$results | Format-Table -AutoSize
