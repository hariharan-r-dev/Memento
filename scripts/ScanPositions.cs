using System;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;

public class ScanPositions {
    [DllImport("user32.dll")]
    public static extern bool SetCursorPos(int X, int Y);

    [DllImport("user32.dll", EntryPoint = "GetWindowLongPtr")]
    public static extern IntPtr GetWindowLongPtr(IntPtr hWnd, int nIndex);

    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

    [DllImport("user32.dll")]
    public static extern bool IsWindowVisible(IntPtr hWnd);

    static IntPtr targetHwnd = IntPtr.Zero;

    public static void Main() {
        EnumWindows((hWnd, lParam) => {
            if (IsWindowVisible(hWnd)) {
                StringBuilder title = new StringBuilder(256);
                GetWindowText(hWnd, title, 256);
                if (title.ToString() == "Lucky Charm") {
                    targetHwnd = hWnd;
                    return false;
                }
            }
            return true;
        }, IntPtr.Zero);

        if (targetHwnd == IntPtr.Zero) {
            Console.WriteLine("Could not find window");
            return;
        }

        Console.WriteLine("Scanning X from 500 to 1400 at Y=200...");
        for (int x = 500; x <= 1400; x += 30) {
            SetCursorPos(x, 200);
            Thread.Sleep(40);
            long ex = GetWindowLongPtr(targetHwnd, -20).ToInt64();
            bool isTrans = (ex & 0x20) != 0;
            Console.WriteLine(string.Format("X={0,4} | ExStyle=0x{1:X} | State={2}",
                x, ex, isTrans ? "CLICK-THROUGH" : "INTERACTIVE CAPTURING"));
        }
    }
}
