using System;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Collections.Generic;

namespace LuckyTester {
    class Program {
        public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

        [DllImport("user32.dll")]
        public static extern bool SetProcessDPIAware();

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

        [DllImport("user32.dll")]
        public static extern bool GetCursorPos(out POINT lpPoint);

        [DllImport("user32.dll")]
        public static extern bool SetCursorPos(int X, int Y);

        [DllImport("user32.dll")]
        public static extern uint SendInput(uint nInputs, [MarshalAs(UnmanagedType.LPArray), In] INPUT[] pInputs, int cbSize);

        [DllImport("user32.dll")]
        public static extern uint GetDpiForWindow(IntPtr hWnd);

        [DllImport("user32.dll")]
        public static extern int GetSystemMetrics(int nIndex);

        public const int SM_CXSCREEN = 0;
        public const int SM_CYSCREEN = 1;

        public const int GWL_EXSTYLE = -20;
        public const long WS_EX_TRANSPARENT = 0x00000020L;

        public const int INPUT_MOUSE = 0;
        public const uint MOUSEEVENTF_MOVE = 0x0001;
        public const uint MOUSEEVENTF_LEFTDOWN = 0x0002;
        public const uint MOUSEEVENTF_LEFTUP   = 0x0004;
        public const uint MOUSEEVENTF_ABSOLUTE = 0x8000;

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

        [StructLayout(LayoutKind.Sequential)]
        public struct MOUSEINPUT {
            public int dx;
            public int dy;
            public uint mouseData;
            public uint dwFlags;
            public uint time;
            public IntPtr dwExtraInfo;
        }

        [StructLayout(LayoutKind.Explicit)]
        public struct INPUT {
            [FieldOffset(0)]
            public int type;
            [FieldOffset(8)]
            public MOUSEINPUT mi;
        }

        static IntPtr overlayHwnd = IntPtr.Zero;
        static double dpiScale = 1.25;
        static int screenW = 1920;
        static int screenH = 1080;
        static int passedCount = 0;
        static int totalCount = 0;

        static void MoveCursor(int physX, int physY) {
            SetCursorPos(physX, physY);
            int normX = (int)((physX * 65535.0) / (screenW - 1));
            int normY = (int)((physY * 65535.0) / (screenH - 1));

            INPUT[] inputs = new INPUT[1];
            inputs[0].type = INPUT_MOUSE;
            inputs[0].mi.dx = normX;
            inputs[0].mi.dy = normY;
            inputs[0].mi.dwFlags = MOUSEEVENTF_MOVE | MOUSEEVENTF_ABSOLUTE;
            SendInput(1, inputs, Marshal.SizeOf(typeof(INPUT)));
        }

        static bool IsTransparent(IntPtr hwnd) {
            long ex = GetWindowLongPtr(hwnd, GWL_EXSTYLE).ToInt64();
            return (ex & WS_EX_TRANSPARENT) != 0;
        }

        static void TestLocation(string testName, int physX, int physY, bool expectInteractive) {
            totalCount++;
            MoveCursor(physX, physY);
            Thread.Sleep(90); // Allow 60Hz monitor update (16ms * 5)

            POINT pt;
            GetCursorPos(out pt);

            bool trans = IsTransparent(overlayHwnd);
            bool isInteractive = !trans;

            bool pass = (isInteractive == expectInteractive);
            if (pass) passedCount++;

            string status = pass ? "[PASS]" : "[FAIL]";
            string behavior = trans ? "Click-Through Active (Empty Desktop)" : "Lucky Charm Capturing (Interactive)";

            Console.WriteLine(string.Format("{0,-8} | {1,-38} | Target: ({2,4},{3,4}) | {4}", 
                status, testName, physX, physY, behavior));
        }

        static void Main(string[] args) {
            SetProcessDPIAware();

            Console.WriteLine("================================================================================");
            Console.WriteLine("LUCKY CHARM PHYSICAL INPUT & HIT-TESTING VALIDATION SUITE");
            Console.WriteLine("================================================================================");

            screenW = GetSystemMetrics(SM_CXSCREEN);
            screenH = GetSystemMetrics(SM_CYSCREEN);

            // 1. Locate Lucky Charm overlay window
            EnumWindows((hWnd, lParam) => {
                if (IsWindowVisible(hWnd)) {
                    StringBuilder title = new StringBuilder(256);
                    GetWindowText(hWnd, title, 256);
                    StringBuilder cls = new StringBuilder(256);
                    GetClassName(hWnd, cls, 256);
                    RECT r;
                    GetWindowRect(hWnd, out r);
                    int w = r.Right - r.Left;
                    int h = r.Bottom - r.Top;

                    if ((title.ToString().Contains("Lucky Charm") || cls.ToString().Contains("tauri")) && w > 500 && h > 300) {
                        overlayHwnd = hWnd;
                        return false;
                    }
                }
                return true;
            }, IntPtr.Zero);

            if (overlayHwnd == IntPtr.Zero) {
                Console.WriteLine("ERROR: Could not locate Lucky Charm overlay window. Is Lucky-Charm.exe running?");
                return;
            }

            uint dpi = GetDpiForWindow(overlayHwnd);
            dpiScale = (dpi > 0) ? (dpi / 96.0) : 1.25;

            // Charm anchor in CSS space defaults to 960 (or window.innerWidth / 2 = 768)
            // Let's test both potential anchor positions or scan the interactive range
            int cssAnchorX = 768; // CSS center

            Console.WriteLine(string.Format("Target Window HWND: 0x{0:X} | Screen: {1}x{2} | DPI: {3} (Scale: {4:F2})",
                overlayHwnd.ToInt64(), screenW, screenH, dpi, dpiScale));
            Console.WriteLine("--------------------------------------------------------------------------------\n");

            Func<int, int, int> toPhysX = (cssX, cssY) => (int)(cssX * dpiScale);
            Func<int, int, int> toPhysY = (cssX, cssY) => (int)(cssY * dpiScale);

            // Scan for interactive regions
            Console.WriteLine("Scanning for interactive regions across physical screen...");
            for (int sy = 15; sy <= 300; sy += 50) {
                for (int sx = 50; sx < screenW; sx += 30) {
                    MoveCursor(sx, sy);
                    Thread.Sleep(20);
                    if (!IsTransparent(overlayHwnd)) {
                        Console.WriteLine(string.Format("FOUND INTERACTIVE REGION at Physical ({0}, {1}) -> CSS ({2:F0}, {3:F0})",
                            sx, sy, sx / dpiScale, sy / dpiScale));
                    }
                }
            }

            Console.WriteLine("\n=== SECTION 1: EMPTY DESKTOP CLICK-THROUGH (Must Pass Through) ===");
            TestLocation("Top-Left Empty Desktop", 80, 80, false);
            TestLocation("Top-Right Empty Desktop", screenW - 80, 80, false);
            TestLocation("Bottom-Left Empty Desktop", 80, screenH - 80, false);
            TestLocation("Bottom-Right Empty Desktop", screenW - 80, screenH - 80, false);
            TestLocation("250px Left of Charm", toPhysX(cssAnchorX - 250, 200), toPhysY(cssAnchorX - 250, 200), false);
            TestLocation("250px Right of Charm", toPhysX(cssAnchorX + 250, 200), toPhysY(cssAnchorX + 250, 200), false);
            TestLocation("300px Below Charm", toPhysX(cssAnchorX, 520), toPhysY(cssAnchorX, 520), false);

            Console.WriteLine("\n=== SECTION 2: TOP BRACKET & ROPE CORRIDOR (Must Capture) ===");
            TestLocation("Top Mounting Bracket", toPhysX(cssAnchorX, 10), toPhysY(cssAnchorX, 10), true);
            TestLocation("Braided Rope Corridor (Midpoint)", toPhysX(cssAnchorX, 65), toPhysY(cssAnchorX, 65), true);
            TestLocation("Braided Rope Corridor (Lower)", toPhysX(cssAnchorX, 110), toPhysY(cssAnchorX, 110), true);

            Console.WriteLine("\n=== SECTION 3: RED CAR CHARM BODY PARTS (Must Capture 100%) ===");
            TestLocation("Car Upper Attachment Ring", toPhysX(cssAnchorX, 142), toPhysY(cssAnchorX, 142), true);
            TestLocation("Car Center Hood / Body", toPhysX(cssAnchorX, 210), toPhysY(cssAnchorX, 210), true);
            TestLocation("Car Front Bumper (Lower-Left)", toPhysX(cssAnchorX - 35, 255), toPhysY(cssAnchorX - 35, 255), true);
            TestLocation("Car Rear Spoiler (Upper-Right)", toPhysX(cssAnchorX + 35, 185), toPhysY(cssAnchorX + 35, 185), true);
            TestLocation("Car Front Wheel Area", toPhysX(cssAnchorX - 42, 268), toPhysY(cssAnchorX - 42, 268), true);
            TestLocation("Car Rear Wheel Area", toPhysX(cssAnchorX + 38, 235), toPhysY(cssAnchorX + 38, 235), true);
            TestLocation("Car Windshield Area", toPhysX(cssAnchorX - 10, 195), toPhysY(cssAnchorX - 10, 195), true);
            TestLocation("Car Side Window / Mirror Area", toPhysX(cssAnchorX + 15, 212), toPhysY(cssAnchorX + 15, 212), true);

            Console.WriteLine("\n=== SECTION 4: HITBOX BOUNDARY RESOLUTION ===");
            TestLocation("120px Left of Car (Outside)", toPhysX(cssAnchorX - 120, 210), toPhysY(cssAnchorX - 120, 210), false);
            TestLocation("50px Left of Car (Inside Edge)", toPhysX(cssAnchorX - 50, 210), toPhysY(cssAnchorX - 50, 210), true);
            TestLocation("50px Right of Car (Inside Edge)", toPhysX(cssAnchorX + 50, 210), toPhysY(cssAnchorX + 50, 210), true);
            TestLocation("120px Right of Car (Outside)", toPhysX(cssAnchorX + 120, 210), toPhysY(cssAnchorX + 120, 210), false);

            Console.WriteLine("\n=== SECTION 5: DRAG & RELEASE LIFECYCLE ===");
            // Start drag on car
            int dragStartX = toPhysX(cssAnchorX, 210);
            int dragStartY = toPhysY(cssAnchorX, 210);
            MoveCursor(dragStartX, dragStartY);
            Thread.Sleep(80);

            INPUT[] downInput = new INPUT[1];
            downInput[0].type = INPUT_MOUSE;
            downInput[0].mi.dwFlags = MOUSEEVENTF_LEFTDOWN;
            SendInput(1, downInput, Marshal.SizeOf(typeof(INPUT)));
            Thread.Sleep(60);

            // Drag across screen
            for (int step = 0; step <= 8; step++) {
                int curX = dragStartX - (int)(step * 15 * dpiScale);
                int curY = dragStartY + (int)(step * 10 * dpiScale);
                MoveCursor(curX, curY);
                Thread.Sleep(20);
            }

            bool dragCaptured = !IsTransparent(overlayHwnd);
            totalCount++;
            if (dragCaptured) passedCount++;
            Console.WriteLine(string.Format("{0,-8} | {1,-38} | Drag state active",
                dragCaptured ? "[PASS]" : "[FAIL]", "During Active Drag: Window Capturing"));

            // Release
            INPUT[] upInput = new INPUT[1];
            upInput[0].type = INPUT_MOUSE;
            upInput[0].mi.dwFlags = MOUSEEVENTF_LEFTUP;
            SendInput(1, upInput, Marshal.SizeOf(typeof(INPUT)));
            Thread.Sleep(120);

            // Move to empty desktop
            MoveCursor(120, 120);
            Thread.Sleep(100);

            bool releasedClickThrough = IsTransparent(overlayHwnd);
            totalCount++;
            if (releasedClickThrough) passedCount++;
            Console.WriteLine(string.Format("{0,-8} | {1,-38} | Click-Through restored",
                releasedClickThrough ? "[PASS]" : "[FAIL]", "After Release: Return to Click-Through"));

            Console.WriteLine("\n================================================================================");
            Console.WriteLine(string.Format("VALIDATION RESULTS: {0} / {1} TESTS PASSED ({2:F1}%)", 
                passedCount, totalCount, (passedCount * 100.0 / totalCount)));
            Console.WriteLine("================================================================================");
        }
    }
}
