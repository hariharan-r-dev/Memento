using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading;

public class DirectHWNDCheck {
    [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
    [DllImport("user32.dll")] public static extern bool SetCursorPos(int x, int y);
    [DllImport("user32.dll", EntryPoint = "GetWindowLongPtr")] public static extern IntPtr GetWindowLongPtr(IntPtr hWnd, int nIndex);
    [DllImport("user32.dll")] public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);

    [StructLayout(LayoutKind.Sequential)]
    public struct RECT { public int Left, Top, Right, Bottom; }

    public static void Main(string[] args) {
        SetProcessDPIAware();
        Process[] procs = Process.GetProcessesByName("Lucky-Charm");
        if (procs.Length == 0) procs = Process.GetProcessesByName("lucky_charm");
        if (procs.Length == 0) {
            Console.WriteLine("Process not found");
            return;
        }

        Process p = procs[0];
        IntPtr hwnd = p.MainWindowHandle;
        RECT r;
        GetWindowRect(hwnd, out r);
        Console.WriteLine(string.Format("Process PID: {0} | MainWindowHandle: 0x{1:X} | Rect: ({2},{3},{4},{5})",
            p.Id, hwnd.ToInt64(), r.Left, r.Top, r.Right, r.Bottom));

        int[] xs = new int[] { 80, 1840, 960, 960, 916, 928, 947, 978, 1007, 1003, 772, 885, 1035, 1147 };
        int[] ys = new int[] { 80,   80,  18, 262, 318, 300, 243, 265,  293,  231, 262, 262,  262,  262 };
        string[] labels = new string[] {
            "Empty Top-Left", "Empty Top-Right", "Top Bracket", "Center Hood",
            "Front Bumper", "Left/Front Body", "Windshield", "Side Window", "Rear Wheel", "Rear Spoiler",
            "150px Left Outside", "Left Inside Edge", "Right Inside Edge", "150px Right Outside"
        };

        for (int i = 0; i < xs.Length; i++) {
            SetCursorPos(xs[i], ys[i]);
            Thread.Sleep(120);
            long ex = GetWindowLongPtr(hwnd, -20).ToInt64();
            bool isTrans = (ex & 0x20) != 0;
            Console.WriteLine(string.Format("{0,-20} | Pos: ({1,4},{2,4}) | ExStyle: 0x{3:X} | {4}",
                labels[i], xs[i], ys[i], ex, isTrans ? "CLICK-THROUGH (WS_EX_TRANSPARENT=1)" : "CAPTURING (WS_EX_TRANSPARENT=0)"));
        }
    }
}
