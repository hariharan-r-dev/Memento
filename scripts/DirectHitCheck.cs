using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;

public class DirectHitCheck {
    [DllImport("user32.dll")]
    public static extern bool SetProcessDPIAware();

    [DllImport("user32.dll")]
    public static extern bool SetCursorPos(int X, int Y);

    [DllImport("user32.dll", EntryPoint = "GetWindowLongPtr")]
    public static extern IntPtr GetWindowLongPtr(IntPtr hWnd, int nIndex);

    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

    [DllImport("user32.dll")]
    public static extern bool IsWindowVisible(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);

    [StructLayout(LayoutKind.Sequential)]
    public struct RECT {
        public int Left;
        public int Top;
        public int Right;
        public int Bottom;
    }

    static IntPtr targetHwnd = IntPtr.Zero;

    static void Check(int x, int y, string desc) {
        SetCursorPos(x, y);
        Thread.Sleep(100);
        long ex = GetWindowLongPtr(targetHwnd, -20).ToInt64();
        bool isTrans = (ex & 0x20) != 0;
        Console.WriteLine(string.Format("Pos: ({0,4},{1,4}) | ExStyle: 0x{2:X} | State: {3,-33} | {4}",
            x, y, ex, isTrans ? "CLICK-THROUGH (WS_EX_TRANSPARENT=1)" : "CAPTURING (WS_EX_TRANSPARENT=0)", desc));
    }

    public static void Main() {
        SetProcessDPIAware();

        EnumWindows((hWnd, lParam) => {
            if (IsWindowVisible(hWnd)) {
                RECT r;
                GetWindowRect(hWnd, out r);
                int w = r.Right - r.Left;
                int h = r.Bottom - r.Top;
                if (w >= 500 && h >= 300) {
                    uint pid;
                    GetWindowThreadProcessId(hWnd, out pid);
                    try {
                        Process p = Process.GetProcessById((int)pid);
                        if (p.ProcessName.IndexOf("Lucky", StringComparison.OrdinalIgnoreCase) >= 0) {
                            targetHwnd = hWnd;
                            Console.WriteLine(string.Format("Found Lucky Charm HWND: 0x{0:X} | PID: {1} | Rect: ({2},{3},{4},{5})",
                                hWnd.ToInt64(), pid, r.Left, r.Top, r.Right, r.Bottom));
                            return false;
                        }
                    } catch {}
                }
            }
            return true;
        }, IntPtr.Zero);

        if (targetHwnd == IntPtr.Zero) {
            Console.WriteLine("Could not find window");
            return;
        }

        Console.WriteLine("\n--- EMPTY DESKTOP POSITIONS ---");
        Check(80, 80, "Top-Left");
        Check(1840, 80, "Top-Right");
        Check(685, 250, "Left of Charm");
        Check(1235, 250, "Right of Charm");
        Check(960, 600, "Below Charm");

        Console.WriteLine("\n--- CHARM POSITIONS (Scale 1.25, Anchor=960) ---");
        Check(960, 18, "Top Bracket");
        Check(960, 75, "Rope Upper");
        Check(960, 137, "Rope Lower");
        Check(960, 177, "Upper Attachment");
        Check(960, 262, "Center Hood");
        Check(916, 318, "Front Bumper");
        Check(928, 300, "Left/Front Body");
        Check(947, 243, "Windshield");
        Check(978, 265, "Side Window");
        Check(922, 256, "Side Mirror");
        Check(907, 335, "Front Wheel");
        Check(1007, 293, "Rear Wheel");
        Check(1003, 231, "Rear Spoiler");
        Check(991, 250, "Rear Body");

        Console.WriteLine("\n--- BOUNDARY POSITIONS ---");
        Check(772, 262, "150px Left Outside");
        Check(885, 262, "Inside Left Edge");
        Check(1035, 262, "Inside Right Edge");
        Check(1147, 262, "150px Right Outside");
    }
}
