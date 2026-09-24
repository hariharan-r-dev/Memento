Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
using System.Text;
using System.Collections.Generic;

public struct WindowInfo {
    public IntPtr Hwnd;
    public uint Pid;
    public string Title;
    public string ClassName;
    public int Left;
    public int Top;
    public int Right;
    public int Bottom;
    public bool Visible;
    public long ExStyle;
}

public class WinDumper {
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

    [DllImport("user32.dll", EntryPoint = "GetWindowLongPtr")]
    public static extern IntPtr GetWindowLongPtr(IntPtr hWnd, int nIndex);

    public const int GWL_EXSTYLE = -20;

    public static WindowInfo[] GetAllWindows() {
        List<WindowInfo> list = new List<WindowInfo>();
        EnumWindows((hWnd, lParam) => {
            StringBuilder title = new StringBuilder(256);
            GetWindowText(hWnd, title, 256);
            StringBuilder cls = new StringBuilder(256);
            GetClassName(hWnd, cls, 256);
            
            RECT r;
            GetWindowRect(hWnd, out r);
            uint pid = 0;
            GetWindowThreadProcessId(hWnd, out pid);
            bool vis = IsWindowVisible(hWnd);
            long ex = GetWindowLongPtr(hWnd, GWL_EXSTYLE).ToInt64();

            list.Add(new WindowInfo {
                Hwnd = hWnd,
                Pid = pid,
                Title = title.ToString(),
                ClassName = cls.ToString(),
                Left = r.Left,
                Top = r.Top,
                Right = r.Right,
                Bottom = r.Bottom,
                Visible = vis,
                ExStyle = ex
            });
            return true;
        }, IntPtr.Zero);
        return list.ToArray();
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

$windows = [WinDumper]::GetAllWindows()
Write-Host "Total Windows Found: $($windows.Length)"
$luckyProcs = Get-Process | Where-Object { $_.ProcessName -like "*lucky*" -or $_.Path -like "*Lucky*" }
foreach ($lp in $luckyProcs) {
    Write-Host "Lucky Process: PID $($lp.Id) Name $($lp.ProcessName)"
    $match = $windows | Where-Object { $_.Pid -eq $lp.Id }
    foreach ($m in $match) {
        Write-Host "  HWND: $($m.Hwnd) | Title: '$($m.Title)' | Class: '$($m.ClassName)' | Rect: ($($m.Left),$($m.Top),$($m.Right),$($m.Bottom)) | Visible: $($m.Visible) | ExStyle: 0x$($m.ExStyle.ToString('X'))"
    }
}
