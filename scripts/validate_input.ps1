Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
using System.Text;
using System.Collections.Generic;

public class Win32 {
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

    public const uint MOUSEEVENTF_LEFTDOWN = 0x0002;
    public const uint MOUSEEVENTF_LEFTUP   = 0x0004;
    public const uint MOUSEEVENTF_RIGHTDOWN = 0x0008;
    public const uint MOUSEEVENTF_RIGHTUP   = 0x0010;
    public const int GWL_EXSTYLE = -20;
    public const long WS_EX_TRANSPARENT = 0x00000020L;
    public const long WS_EX_LAYERED = 0x00080000L;
    public const long WS_EX_TOPMOST = 0x00000008L;
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

function Get-WindowTitle($hwnd) {
    $sb = New-Object System.Text.StringBuilder 256
    [void][Win32]::GetWindowText($hwnd, $sb, 256)
    return $sb.ToString()
}

function Get-WindowClassName($hwnd) {
    $sb = New-Object System.Text.StringBuilder 256
    [void][Win32]::GetClassName($hwnd, $sb, 256)
    return $sb.ToString()
}

Write-Host "=== 1. Check or Start Lucky Charm ==="
$exePath = "D:\Hariharan R\Lucky charm\release-bin\Lucky-Charm.exe"
$releaseBin = "D:\Hariharan R\Lucky charm\release-bin"
$homeDir = [System.Environment]::GetFolderPath('UserProfile')
$mingwBin = Join-Path $homeDir "AppData\Local\Microsoft\WinGet\Packages\BrechtSanders.WinLibs.POSIX.UCRT_Microsoft.Winget.Source_8wekyb3d8bbwe\mingw64\bin"

$env:PATH = "$releaseBin;$mingwBin;$env:PATH"
$env:Path = "$releaseBin;$mingwBin;$env:Path"

$proc = Get-Process -Name lucky_charm, Lucky-Charm -ErrorAction SilentlyContinue | Select-Object -First 1
if (-not $proc) {
    Write-Host "Starting Lucky Charm from: $exePath"
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = $exePath
    $psi.WorkingDirectory = $releaseBin
    $psi.UseShellExecute = $false
    $proc = [System.Diagnostics.Process]::Start($psi)
    Start-Sleep -Seconds 3
}

Write-Host "Lucky Charm Process ID: $($proc.Id)"

# Find Main Window HWND
$foundHwnd = [IntPtr]::Zero
$targetPid = [uint32]$proc.Id

$enumCallback = [Win32+EnumWindowsProc]{
    param($hwnd, $lParam)
    $pidOut = 0
    [void][Win32]::GetWindowThreadProcessId($hwnd, [ref]$pidOut)
    if ($pidOut -eq $targetPid -and [Win32]::IsWindowVisible($hwnd)) {
        $title = Get-WindowTitle $hwnd
        $class = Get-WindowClassName $hwnd
        if ($title -eq "Lucky Charm" -or $class -like "*tauri*" -or $class -like "*WebView2*" -or $title -eq "") {
            $script:foundHwnd = $hwnd
            return $false
        }
    }
    return $true
}

[void][Win32]::EnumWindows($enumCallback, [IntPtr]::Zero)
$mainHwnd = $foundHwnd

if ($mainHwnd -eq [IntPtr]::Zero) {
    # Try finding by title
    $mainHwnd = [Win32]::FindWindow($null, "Lucky Charm")
}

if ($mainHwnd -eq [IntPtr]::Zero) {
    Write-Error "Could not find Lucky Charm main window handle."
    exit 1
}

$rect = New-Object RECT
[Win32]::GetWindowRect($mainHwnd, [ref]$rect)
Write-Host "Lucky Charm Window HWND: $mainHwnd, Bounds: ($($rect.Left), $($rect.Top), $($rect.Right), $($rect.Bottom))"

function Test-PointInteractivity($hwnd, $x, $y, $description) {
    [Win32]::SetCursorPos($x, $y)
    Start-Sleep -Milliseconds 65
    
    $exStyle = [Win32]::GetWindowLongPtr($hwnd, [Win32]::GWL_EXSTYLE).ToInt64()
    $isTransparent = ($exStyle -band [Win32]::WS_EX_TRANSPARENT) -ne 0
    $pt = New-Object POINT
    $pt.X = $x
    $pt.Y = $y
    $targetHwnd = [Win32]::WindowFromPoint($pt)
    $targetTitle = Get-WindowTitle $targetHwnd
    $targetClass = Get-WindowClassName $targetHwnd
    
    [PSCustomObject]@{
        Test = $description
        Coord = "$x, $y"
        WS_EX_TRANSPARENT = if ($isTransparent) { "TRUE (Click-Through)" } else { "FALSE (Captured)" }
        LuckyCharmInteractive = (!$isTransparent)
        UnderlyingWindow = if ($targetTitle) { $targetTitle } else { $targetClass }
    }
}

$results = @()

Write-Host "`n=== 2. Testing Empty Desktop Points (Should be Click-Through) ==="
$results += Test-PointInteractivity $mainHwnd 100 100 "Empty Top-Left Desktop"
$results += Test-PointInteractivity $mainHwnd ($rect.Right - 100) 100 "Empty Top-Right Desktop"
$results += Test-PointInteractivity $mainHwnd 100 ($rect.Bottom - 100) "Empty Bottom-Left Desktop"
$results += Test-PointInteractivity $mainHwnd ($rect.Right - 100) ($rect.Bottom - 100) "Empty Bottom-Right Desktop"
$results += Test-PointInteractivity $mainHwnd 700 200 "250px Left of Charm"
$results += Test-PointInteractivity $mainHwnd 1200 200 "250px Right of Charm"
$results += Test-PointInteractivity $mainHwnd 960 550 "300px Below Charm"

Write-Host "`n=== 3. Testing Red Car Charm Target Points (Should be Captured by Lucky Charm) ==="
$results += Test-PointInteractivity $mainHwnd 960 145 "Car Upper Attachment Loop"
$results += Test-PointInteractivity $mainHwnd 960 210 "Car Center Body / Hood"
$results += Test-PointInteractivity $mainHwnd 930 250 "Car Front Bumper / Left Body"
$results += Test-PointInteractivity $mainHwnd 990 190 "Car Rear Spoiler / Upper Right"
$results += Test-PointInteractivity $mainHwnd 920 270 "Car Front Wheel Area"
$results += Test-PointInteractivity $mainHwnd 995 240 "Car Rear Wheel Area"
$results += Test-PointInteractivity $mainHwnd 950 200 "Car Windshield"
$results += Test-PointInteractivity $mainHwnd 975 215 "Car Side Window / Mirror"

Write-Host "`n=== 4. Testing Rope Corridor & Bracket ==="
$results += Test-PointInteractivity $mainHwnd 960 10 "Top Mounting Bracket"
$results += Test-PointInteractivity $mainHwnd 960 60 "Braided Rope Corridor"

Write-Host "`n=== 5. Testing Drag Interaction & Dynamic Hitbox Follow ==="
[Win32]::SetCursorPos(960, 210)
Start-Sleep -Milliseconds 60
[Win32]::mouse_event([Win32]::MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0)
Start-Sleep -Milliseconds 50

# Move cursor while dragging
for ($i = 0; $i -le 10; $i++) {
    $curX = 960 - ($i * 15)
    $curY = 210 + ($i * 10)
    [Win32]::SetCursorPos($curX, $curY)
    Start-Sleep -Milliseconds 16
}

$exStyleDuringDrag = [Win32]::GetWindowLongPtr($mainHwnd, [Win32]::GWL_EXSTYLE).ToInt64()
$isDragCaptured = ($exStyleDuringDrag -band [Win32]::WS_EX_TRANSPARENT) -eq 0
Write-Host "During Active Drag: Window captures mouse = $isDragCaptured"

[Win32]::mouse_event([Win32]::MOUSEEVENTF_LEFTUP, 0, 0, 0, 0)
Start-Sleep -Milliseconds 100

# Move cursor away to empty desktop
[Win32]::SetCursorPos(200, 200)
Start-Sleep -Milliseconds 60
$exStyleAfterRelease = [Win32]::GetWindowLongPtr($mainHwnd, [Win32]::GWL_EXSTYLE).ToInt64()
$isClickThroughRestored = ($exStyleAfterRelease -band [Win32]::WS_EX_TRANSPARENT) -ne 0
Write-Host "After Cursor Leaves to Empty Desktop: Click-Through Restored = $isClickThroughRestored"

$results | Format-Table -AutoSize
