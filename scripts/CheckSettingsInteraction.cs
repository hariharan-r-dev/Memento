using System;
using System.Diagnostics;
using System.IO;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;

class CheckSettingsInteraction {
    [DllImport("user32.dll")]
    static extern bool SetCursorPos(int X, int Y);

    [DllImport("user32.dll")]
    static extern IntPtr WindowFromPoint(POINT Point);

    [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
    static extern int GetClassName(IntPtr hWnd, StringBuilder lpClassName, int nMaxCount);

    [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
    static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

    [DllImport("user32.dll")]
    static extern IntPtr FindWindow(string lpClassName, string lpWindowName);

    [DllImport("user32.dll")]
    static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);

    [DllImport("user32.dll")]
    static extern IntPtr GetAncestor(IntPtr hwnd, uint gaFlags);

    [DllImport("user32.dll")]
    static extern bool IsWindowVisible(IntPtr hWnd);

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
        Console.WriteLine("=== Starting CheckSettingsInteraction ===");

        // Kill old instances
        foreach (Process p in Process.GetProcessesByName("lucky_charm")) {
            try { p.Kill(); } catch { }
        }
        foreach (Process p in Process.GetProcessesByName("Lucky-Charm")) {
            try { p.Kill(); } catch { }
        }
        Thread.Sleep(1000);

        string exePath = @"D:\Hariharan R\Lucky charm\release-bin\Lucky-Charm.exe";
        Process proc = Process.Start(exePath);
        Thread.Sleep(3500);

        try {
            // Find main overlay window
            IntPtr mainHwnd = IntPtr.Zero;
            foreach (Process p in Process.GetProcessesByName("lucky_charm")) {
                if (p.MainWindowHandle != IntPtr.Zero) {
                    mainHwnd = p.MainWindowHandle;
                    break;
                }
            }
            if (mainHwnd == IntPtr.Zero) {
                foreach (Process p in Process.GetProcessesByName("Lucky-Charm")) {
                    if (p.MainWindowHandle != IntPtr.Zero) {
                        mainHwnd = p.MainWindowHandle;
                        break;
                    }
                }
            }
            Console.WriteLine(string.Format("Main Overlay HWND: 0x{0}", mainHwnd.ToString("X")));

            // TEST 1: Check Desktop Click-Through on Main Overlay
            POINT ptDesktop = new POINT { X = 200, Y = 500 };
            SetCursorPos(ptDesktop.X, ptDesktop.Y);
            Thread.Sleep(200);

            IntPtr hitDesktop = WindowFromPoint(ptDesktop);
            StringBuilder sb = new StringBuilder(256);
            GetClassName(hitDesktop, sb, 256);
            string clsDesktop = sb.ToString();

            Console.WriteLine(string.Format("[TEST 1 Desktop] Point (200,500) -> HWND 0x{0}, Class: '{1}'", hitDesktop.ToString("X"), clsDesktop));
            bool desktopPass = (hitDesktop != mainHwnd);
            Console.WriteLine(string.Format("[TEST 1 Result]: {0}", desktopPass ? "PASS (Click-through active)" : "FAIL"));

            // TEST 2: Check Monitor Log to verify Settings HWND handling
            string logPath = Path.Combine(Path.GetTempPath(), "lucky_charm_monitor.log");
            if (File.Exists(logPath)) {
                string[] lines = File.ReadAllLines(logPath);
                int showCount = Math.Min(10, lines.Length);
                Console.WriteLine(string.Format("\n--- Last {0} Monitor Log lines ---", showCount));
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
