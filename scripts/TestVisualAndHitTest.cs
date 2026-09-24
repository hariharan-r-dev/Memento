using System;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;

class TestVisualAndHitTest {
    [DllImport("user32.dll")]
    static extern bool SetCursorPos(int X, int Y);

    [DllImport("user32.dll")]
    static extern bool GetCursorPos(out POINT lpPoint);

    [DllImport("user32.dll")]
    static extern IntPtr WindowFromPoint(POINT Point);

    [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
    static extern int GetClassName(IntPtr hWnd, StringBuilder lpClassName, int nMaxCount);

    [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
    static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

    [DllImport("user32.dll")]
    static extern IntPtr GetAncestor(IntPtr hwnd, uint gaFlags);

    [DllImport("user32.dll")]
    static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);

    [DllImport("user32.dll")]
    static extern IntPtr GetDC(IntPtr hwnd);

    [DllImport("user32.dll")]
    static extern int ReleaseDC(IntPtr hwnd, IntPtr hdc);

    [DllImport("gdi32.dll")]
    static extern uint GetPixel(IntPtr hdc, int nXPos, int nYPos);

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

    const uint GA_ROOT = 2;

    static void Main(string[] args) {
        Console.WriteLine("=== Starting TestVisualAndHitTest ===");

        // 1. Launch Lucky-Charm.exe
        string exePath = @"D:\Hariharan R\Lucky charm\release-bin\Lucky-Charm.exe";
        Process proc = Process.Start(exePath);
        Thread.Sleep(3000); // Wait for initialization

        try {
            // Find window
            IntPtr tauriHwnd = IntPtr.Zero;
            foreach (Process p in Process.GetProcessesByName("lucky_charm")) {
                if (p.MainWindowHandle != IntPtr.Zero) {
                    tauriHwnd = p.MainWindowHandle;
                    break;
                }
            }
            if (tauriHwnd == IntPtr.Zero) {
                foreach (Process p in Process.GetProcessesByName("Lucky-Charm")) {
                    if (p.MainWindowHandle != IntPtr.Zero) {
                        tauriHwnd = p.MainWindowHandle;
                        break;
                    }
                }
            }
            Console.WriteLine("Tauri HWND: 0x" + tauriHwnd.ToString("X"));

            // Test A: Cursor far away on desktop (e.g. 200, 500)
            POINT ptDesktop = new POINT { X = 200, Y = 500 };
            SetCursorPos(ptDesktop.X, ptDesktop.Y);
            Thread.Sleep(200);

            IntPtr hitDesktop = WindowFromPoint(ptDesktop);
            StringBuilder sb = new StringBuilder(256);
            GetClassName(hitDesktop, sb, 256);
            string clsDesktop = sb.ToString();
            GetWindowText(hitDesktop, sb, 256);
            string titleDesktop = sb.ToString();

            Console.WriteLine(string.Format("[TEST 1 Desktop] Point ({0},{1}) -> HWND 0x{2}, Class: '{3}', Title: '{4}'", ptDesktop.X, ptDesktop.Y, hitDesktop.ToString("X"), clsDesktop, titleDesktop));
            bool desktopPass = (hitDesktop != tauriHwnd && !clsDesktop.Contains("Intermediate D3D"));
            Console.WriteLine(string.Format("[TEST 1 Desktop Result]: {0}", desktopPass ? "PASS (click-through active)" : "FAIL"));

            // Test B: Move cursor directly to center of charm (physical 960, 170)
            Console.WriteLine("\n[TEST 2: Move cursor directly to Charm Center (960, 170)]");
            SetCursorPos(960, 170);
            Thread.Sleep(200); // Allow 60Hz loop to detect

            POINT ptCharm = new POINT { X = 960, Y = 170 };
            IntPtr hitCharm = WindowFromPoint(ptCharm);
            IntPtr rootCharm = GetAncestor(hitCharm, GA_ROOT);
            GetClassName(hitCharm, sb, 256);
            string clsCharm = sb.ToString();

            Console.WriteLine(string.Format("Charm Pos (960,170) -> Hit HWND 0x{0}, Root 0x{1}, Class: '{2}'", hitCharm.ToString("X"), rootCharm.ToString("X"), clsCharm));
            bool isCharmInteractive = (hitCharm == tauriHwnd || rootCharm == tauriHwnd || clsCharm.Contains("Chrome") || clsCharm.Contains("Intermediate") || clsCharm.Contains("TAURI"));
            Console.WriteLine(string.Format("Charm Interactive Result: {0}", isCharmInteractive ? "PASS (Interactive)" : "FAIL (Ignored)"));

            // Test C: Move away back to desktop (200, 500)
            Console.WriteLine("\n[TEST 3: Move cursor away back to Desktop (200, 500)]");
            SetCursorPos(200, 500);
            Thread.Sleep(200);

            hitDesktop = WindowFromPoint(ptDesktop);
            GetClassName(hitDesktop, sb, 256);
            Console.WriteLine(string.Format("Desktop Pos (200,500) -> Hit HWND 0x{0}, Class: '{1}'", hitDesktop.ToString("X"), sb.ToString()));

            // Test C: Check reading temp log for state transitions
            string logPath = Path.Combine(Path.GetTempPath(), "lucky_charm_monitor.log");
            if (File.Exists(logPath)) {
                string[] lines = File.ReadAllLines(logPath);
                Console.WriteLine(string.Format("\nTotal Monitor Log lines: {0}", lines.Length));
                int showCount = Math.Min(15, lines.Length);
                Console.WriteLine(string.Format("--- Last {0} log lines ---", showCount));
                for (int i = lines.Length - showCount; i < lines.Length; i++) {
                    Console.WriteLine(lines[i]);
                }
            }

        } finally {
            if (!proc.HasExited) {
                proc.Kill();
            }
        }
    }
}
