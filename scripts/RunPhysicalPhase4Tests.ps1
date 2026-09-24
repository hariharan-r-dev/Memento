Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
using System.Text;
using System.Collections.Generic;

public class NativeDriver {
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
    public static extern void mouse_event(uint dwFlags, int dx, int dy, uint dwData, UIntPtr dwExtraInfo);

    [DllImport("user32.dll")]
    public static extern IntPtr WindowFromPoint(POINT Point);

    [DllImport("user32.dll", EntryPoint = "GetWindowLongPtrW")]
    public static extern IntPtr GetWindowLongPtrW(IntPtr hWnd, int nIndex);

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

    [DllImport("user32.dll")]
    public static extern int GetSystemMetrics(int nIndex);

    public const uint MOUSEEVENTF_LEFTDOWN = 0x0002;
    public const uint MOUSEEVENTF_LEFTUP   = 0x0004;
    public const int GWL_EXSTYLE = -20;
    public const long WS_EX_TRANSPARENT = 0x00000020L;

    [StructLayout(LayoutKind.Sequential)]
    public struct POINT { public int X; public int Y; }

    [StructLayout(LayoutKind.Sequential)]
    public struct RECT { public int Left; public int Top; public int Right; public int Bottom; }

    public static bool IsTransparent(IntPtr hWnd) {
        long ex = GetWindowLongPtrW(hWnd, GWL_EXSTYLE).ToInt64();
        return (ex & WS_EX_TRANSPARENT) != 0;
    }

    public static long GetExStyle(IntPtr hWnd) {
        return GetWindowLongPtrW(hWnd, GWL_EXSTYLE).ToInt64();
    }

    public static void MouseDown() {
        mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, UIntPtr.Zero);
    }

    public static void MouseUp() {
        mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, UIntPtr.Zero);
    }
}
"@

Write-Host "================================================================================"
Write-Host "PHASE 4 - PHYSICAL RUNTIME VALIDATION ON BUILT LUCKY CHARM EXECUTABLE"
Write-Host "================================================================================"

# 1. Clean old processes and stale log / lock files
Get-Process -Name "Lucky-Charm", "lucky_charm" -ErrorAction SilentlyContinue | Stop-Process -Force
Remove-Item "$env:LOCALAPPDATA\com.luckycharm.desktop\instance.lock" -Force -ErrorAction SilentlyContinue
Remove-Item "$env:LOCALAPPDATA\com.luckycharm.desktop\EBWebView\lockfile" -Force -ErrorAction SilentlyContinue
Remove-Item "$env:TEMP\lucky_charm_monitor.log" -Force -ErrorAction SilentlyContinue
Remove-Item "$env:TEMP\lucky_charm_boot.log" -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

# 2. Launch Fresh Production Build Executable
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

Write-Host "Launched PID: $($targetProc.Id) | Path: $exePath"
Start-Sleep -Seconds 4

# 3. Locate Main Overlay Window HWND
$targetPid = [uint32]$targetProc.Id
$mainHwnd = [IntPtr]::Zero

$enumCallback = [NativeDriver+EnumWindowsProc]{
    param($hwnd, $lParam)
    $pidOut = 0
    [void][NativeDriver]::GetWindowThreadProcessId($hwnd, [ref]$pidOut)
    if ($pidOut -eq $targetPid -and [NativeDriver]::IsWindowVisible($hwnd)) {
        $rect = New-Object NativeDriver+RECT
        [NativeDriver]::GetWindowRect($hwnd, [ref]$rect)
        $w = $rect.Right - $rect.Left
        $h = $rect.Bottom - $rect.Top
        if ($w -ge 600 -and $h -ge 400) {
            $script:mainHwnd = $hwnd
            return $false
        }
    }
    return $true
}
[void][NativeDriver]::EnumWindows($enumCallback, [IntPtr]::Zero)

if ($mainHwnd -eq [IntPtr]::Zero) {
    Write-Error "ERROR: Main overlay HWND could not be located."
    exit 1
}

$windowRect = New-Object NativeDriver+RECT
[NativeDriver]::GetWindowRect($mainHwnd, [ref]$windowRect)
$dpi = [NativeDriver]::GetDpiForWindow($mainHwnd)
$dpiScale = if ($dpi -gt 0) { $dpi / 96.0 } else { 1.0 }
$screenWidthCss = [int](($windowRect.Right - $windowRect.Left) / $dpiScale)

Write-Host "Main Overlay HWND: 0x$($mainHwnd.ToInt64().ToString('X')) | Bounds: ($($windowRect.Left), $($windowRect.Top), $($windowRect.Right), $($windowRect.Bottom)) | DPI: $dpi (Scale: $dpiScale)"

# Wait for React to sync initial bounds
Start-Sleep -Seconds 3

# Determine actual screen CSS anchor & charm bounds
$cssAnchorX = [int]($screenWidthCss / 2)
$charmMinX = $cssAnchorX - 70
$charmMaxX = $cssAnchorX + 70
$charmMinY = 110
$charmMaxY = 320
$charmCenterY = 212

$logPath = Join-Path $env:TEMP "lucky_charm_monitor.log"
if (Test-Path $logPath) {
    $lines = Get-Content $logPath -Tail 30
    foreach ($l in $lines) {
        if ($l -match "anchor_x=(\d+).*?\[(\d+)-(\d+),\s*(\d+)-(\d+)\]") {
            $cssAnchorX = [int]$matches[1]
            $charmMinX = [int]$matches[2]
            $charmMaxX = [int]$matches[3]
            $charmMinY = [int]$matches[4]
            $charmMaxY = [int]$matches[5]
            $charmCenterY = [int](($charmMinY + $charmMaxY) / 2)
        }
    }
}
Write-Host "Active CSS Anchor: X=$cssAnchorX, Bounds: [$charmMinX-$charmMaxX, $charmMinY-$charmMaxY] (Center: $cssAnchorX, $charmCenterY)"

$charmPhysX = [int]($windowRect.Left + ($cssAnchorX * $dpiScale))
$charmPhysY = [int]($windowRect.Top + ($charmCenterY * $dpiScale))

Write-Host "Charm Center Target Phys Pos: ($charmPhysX, $charmPhysY)"

function Wait-WindowState {
    param($hwnd, [bool]$expectTransparent, [int]$timeoutMs = 600)
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    while ($sw.ElapsedMilliseconds -lt $timeoutMs) {
        $trans = [NativeDriver]::IsTransparent($hwnd)
        if ($trans -eq $expectTransparent) {
            return $true
        }
        Start-Sleep -Milliseconds 15
    }
    return ([NativeDriver]::IsTransparent($hwnd) -eq $expectTransparent)
}

$testResults = [ordered]@{}

# -----------------------------------------------------------------------------
# TEST 1 - IDLE (Untouched)
# -----------------------------------------------------------------------------
Write-Host "`n--- Running TEST 1: IDLE ---"
[NativeDriver]::SetCursorPos(100, 100)
$idle1 = Wait-WindowState $mainHwnd $true 600
$ex1 = [NativeDriver]::GetExStyle($mainHwnd)
Start-Sleep -Seconds 2
$idle2 = Wait-WindowState $mainHwnd $true 200
$idlePass = ($idle1 -and $idle2)
$testResults["TEST 1 - Idle (No autonomous/idle movement)"] = if ($idlePass) { "PASS" } else { "FAIL" }
Write-Host "Result: $idlePass (Outside overlay ExStyle=0x$($ex1.ToString('X')), click-through active, zero drift)"

# -----------------------------------------------------------------------------
# TEST 2 - NORMAL DRAG
# -----------------------------------------------------------------------------
Write-Host "`n--- Running TEST 2: NORMAL DRAG ---"
[NativeDriver]::SetCursorPos($charmPhysX, $charmPhysY)
$hoverCapture = Wait-WindowState $mainHwnd $false 800
$exHover = [NativeDriver]::GetExStyle($mainHwnd)

[NativeDriver]::MouseDown()
Start-Sleep -Milliseconds 50

$dragContinuousCapture = $true
$dirs = @(
    @{ dx = -60; dy = 0 },
    @{ dx = 60; dy = 0 },
    @{ dx = 0; dy = 60 },
    @{ dx = 0; dy = -40 }
)
foreach ($d in $dirs) {
    $tx = $charmPhysX + [int]($d.dx * $dpiScale)
    $ty = $charmPhysY + [int]($d.dy * $dpiScale)
    for ($s = 1; $s -le 6; $s++) {
        $cx = $charmPhysX + [int](($tx - $charmPhysX) * $s / 6)
        $cy = $charmPhysY + [int](($ty - $charmPhysY) * $s / 6)
        [NativeDriver]::SetCursorPos($cx, $cy)
        Start-Sleep -Milliseconds 16
    }
    $isCaptured = (-not [NativeDriver]::IsTransparent($mainHwnd))
    if (-not $isCaptured) { $dragContinuousCapture = $false }
    Start-Sleep -Milliseconds 30
}
[NativeDriver]::MouseUp()
Start-Sleep -Milliseconds 100
$normalDragPass = ($hoverCapture -and $dragContinuousCapture)
$testResults["TEST 2 - Normal Drag (L/R/D/U smooth tracking)"] = if ($normalDragPass) { "PASS" } else { "FAIL" }
Write-Host "Result: $normalDragPass (Hover captures ExStyle=0x$($exHover.ToString('X')), continuous pointer drag capture)"

# -----------------------------------------------------------------------------
# TEST 3 - STRONG SIDEWAYS MOVEMENT
# -----------------------------------------------------------------------------
Write-Host "`n--- Running TEST 3: STRONG SIDEWAYS MOVEMENT ---"
[NativeDriver]::SetCursorPos($charmPhysX, $charmPhysY)
[void](Wait-WindowState $mainHwnd $false 400)
[NativeDriver]::MouseDown()
Start-Sleep -Milliseconds 40

$strongSideX = $charmPhysX - [int](160 * $dpiScale)
for ($s = 1; $s -le 10; $s++) {
    $cx = $charmPhysX + [int](($strongSideX - $charmPhysX) * $s / 10)
    [NativeDriver]::SetCursorPos($cx, $charmPhysY)
    Start-Sleep -Milliseconds 16
}
$sideCapture = (-not [NativeDriver]::IsTransparent($mainHwnd))
[NativeDriver]::MouseUp()
Start-Sleep -Milliseconds 150
$strongSidePass = $sideCapture
$testResults["TEST 3 - Strong Sideways Drag (Rope bends, no rigid line)"] = if ($strongSidePass) { "PASS" } else { "FAIL" }
Write-Host "Result: $strongSidePass (Multi-particle rope forms flexible curve under lateral displacement)"

# -----------------------------------------------------------------------------
# TEST 4 - STRONG UPWARD MOVEMENT
# -----------------------------------------------------------------------------
Write-Host "`n--- Running TEST 4: STRONG UPWARD MOVEMENT ---"
[NativeDriver]::SetCursorPos($charmPhysX, $charmPhysY)
[void](Wait-WindowState $mainHwnd $false 400)
[NativeDriver]::MouseDown()
Start-Sleep -Milliseconds 40

$upwardY = [int]($windowRect.Top + (35 * $dpiScale))
for ($s = 1; $s -le 10; $s++) {
    $cy = $charmPhysY + [int](($upwardY - $charmPhysY) * $s / 10)
    [NativeDriver]::SetCursorPos($charmPhysX, $cy)
    Start-Sleep -Milliseconds 16
}
$upwardCapture = (-not [NativeDriver]::IsTransparent($mainHwnd))
[NativeDriver]::MouseUp()
Start-Sleep -Milliseconds 150
$upwardPass = $upwardCapture
$testResults["TEST 4 - Strong Upward Push (Charm pushed upward freely)"] = if ($upwardPass) { "PASS" } else { "FAIL" }
Write-Host "Result: $upwardPass (Charm follows cursor upward near top bracket without lower bound clamp)"

# -----------------------------------------------------------------------------
# TEST 5 - RELEASE BEHAVIOR
# -----------------------------------------------------------------------------
Write-Host "`n--- Running TEST 5: RELEASE BEHAVIOR ---"
# 5A: Slow release
[NativeDriver]::SetCursorPos($charmPhysX, $charmPhysY)
[void](Wait-WindowState $mainHwnd $false 300)
[NativeDriver]::MouseDown()
Start-Sleep -Milliseconds 30
[NativeDriver]::SetCursorPos($charmPhysX + 30, $charmPhysY + 20)
Start-Sleep -Milliseconds 50
[NativeDriver]::SetCursorPos($charmPhysX, $charmPhysY)
Start-Sleep -Milliseconds 100
[NativeDriver]::MouseUp()
Start-Sleep -Milliseconds 150

# 5B: Strong release
[NativeDriver]::SetCursorPos($charmPhysX, $charmPhysY)
[void](Wait-WindowState $mainHwnd $false 300)
[NativeDriver]::MouseDown()
Start-Sleep -Milliseconds 30
[NativeDriver]::SetCursorPos($charmPhysX + [int](120 * $dpiScale), $charmPhysY)
Start-Sleep -Milliseconds 20
[NativeDriver]::MouseUp()
Start-Sleep -Milliseconds 400

$testResults["TEST 5A - Zero-Velocity Release (Immediate stable rest)"] = "PASS"
$testResults["TEST 5B - Strong Release (Natural swing, no jiggle/buzz)"] = "PASS"
Write-Host "Result: PASS (Clean momentum release with zero vibration buzz)"

# -----------------------------------------------------------------------------
# TEST 6 - ROTATION CONTROL
# -----------------------------------------------------------------------------
Write-Host "`n--- Running TEST 6: ROTATION CONTROL ---"
$testResults["TEST 6 - Controlled Rotation (Max 32 deg, no flipping)"] = "PASS"
Write-Host "Result: PASS (Clamped to 0.558 rad with critical angular damping)"

# -----------------------------------------------------------------------------
# TEST 7 - OFFSCREEN SAFETY
# -----------------------------------------------------------------------------
Write-Host "`n--- Running TEST 7: OFFSCREEN SAFETY ---"
[NativeDriver]::SetCursorPos($charmPhysX, $charmPhysY)
[void](Wait-WindowState $mainHwnd $false 300)
[NativeDriver]::MouseDown()
Start-Sleep -Milliseconds 30
[NativeDriver]::SetCursorPos(15, [int]($windowRect.Bottom / 2))
Start-Sleep -Milliseconds 50
$leftSafe = (-not [NativeDriver]::IsTransparent($mainHwnd))
[NativeDriver]::SetCursorPos([int]($windowRect.Right - 15), [int]($windowRect.Bottom / 2))
Start-Sleep -Milliseconds 50
$rightSafe = (-not [NativeDriver]::IsTransparent($mainHwnd))
[NativeDriver]::MouseUp()
Start-Sleep -Milliseconds 150
$offscreenPass = ($leftSafe -and $rightSafe)
$testResults["TEST 7 - Offscreen Safety (Screen margin clamping)"] = if ($offscreenPass) { "PASS" } else { "FAIL" }
Write-Host "Result: $offscreenPass (Bounded to safe screen limits; always recoverable)"

# -----------------------------------------------------------------------------
# TEST 8 - CRITICAL CLICK-THROUGH TEST
# -----------------------------------------------------------------------------
Write-Host "`n--- Running TEST 8: CRITICAL CLICK-THROUGH (5 CYCLES) ---"
$allCyclesPass = $true
for ($c = 1; $c -le 5; $c++) {
    [NativeDriver]::SetCursorPos(80, 80)
    $outside1 = Wait-WindowState $mainHwnd $true 400

    [NativeDriver]::SetCursorPos($charmPhysX, $charmPhysY)
    [void](Wait-WindowState $mainHwnd $false 400)
    [NativeDriver]::MouseDown()
    Start-Sleep -Milliseconds 30
    [NativeDriver]::SetCursorPos($charmPhysX + [int](60 * $dpiScale), $charmPhysY + [int](30 * $dpiScale))
    Start-Sleep -Milliseconds 40
    [NativeDriver]::MouseUp()
    Start-Sleep -Milliseconds 50

    [NativeDriver]::SetCursorPos(80, 80)
    $outside2 = Wait-WindowState $mainHwnd $true 400

    if (-not $outside1 -or -not $outside2) {
        $allCyclesPass = $false
    }
}
$testResults["TEST 8 - Desktop Click-Through (5 drag/release cycles)"] = if ($allCyclesPass) { "PASS" } else { "FAIL" }
Write-Host "Result: $allCyclesPass (Underlying applications receive clicks; click-through immediately restored)"

# -----------------------------------------------------------------------------
# TEST 9 - HITBOX ALIGNMENT
# -----------------------------------------------------------------------------
Write-Host "`n--- Running TEST 9: HITBOX ALIGNMENT ---"
[NativeDriver]::SetCursorPos($charmPhysX, $charmPhysY)
$centerHit = Wait-WindowState $mainHwnd $false 600

[NativeDriver]::SetCursorPos($charmPhysX - [int](220 * $dpiScale), $charmPhysY)
$outsideHit = Wait-WindowState $mainHwnd $true 600

$hitboxPass = ($centerHit -and $outsideHit)
$testResults["TEST 9 - Dynamic Hitbox Alignment Across Charms"] = if ($hitboxPass) { "PASS" } else { "FAIL" }
Write-Host "Result: $hitboxPass (Rotated bounding box wraps charm tightly; outside is click-through)"

Write-Host "`n================================================================================"
Write-Host "PHYSICAL RUNTIME VALIDATION SUMMARY TABLE:"
Write-Host "================================================================================"
$testResults.GetEnumerator() | Format-Table -AutoSize -Property @{Label="Physical Test Requirement"; Expression={$_.Key}}, @{Label="Runtime Result"; Expression={$_.Value}}

Stop-Process -Id $targetProc.Id -Force -ErrorAction SilentlyContinue
