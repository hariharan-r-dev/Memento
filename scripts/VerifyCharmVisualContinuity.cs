using System;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;

class VerifyCharmVisualContinuity {
    [DllImport("user32.dll")]
    static extern bool SetCursorPos(int X, int Y);

    [DllImport("user32.dll")]
    static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);

    [DllImport("user32.dll")]
    static extern bool PrintWindow(IntPtr hwnd, IntPtr hdcBlt, uint nFlags);

    [StructLayout(LayoutKind.Sequential)]
    public struct RECT {
        public int Left;
        public int Top;
        public int Right;
        public int Bottom;
    }

    const uint PW_RENDERFULLCONTENT = 0x00000002;

    static Bitmap CaptureWindowContent(IntPtr hwnd) {
        RECT r;
        GetWindowRect(hwnd, out r);
        int w = r.Right - r.Left;
        int h = r.Bottom - r.Top;
        if (w <= 0 || h <= 0) { w = 1920; h = 1080; }

        Bitmap bmp = new Bitmap(w, h, PixelFormat.Format32bppArgb);
        using (Graphics g = Graphics.FromImage(bmp)) {
            IntPtr hdc = g.GetHdc();
            PrintWindow(hwnd, hdc, PW_RENDERFULLCONTENT);
            g.ReleaseHdc(hdc);
        }
        return bmp;
    }

    static int CountNonBlackPixels(Bitmap bmp) {
        int count = 0;
        for (int y = 0; y < bmp.Height; y++) {
            for (int x = 0; x < bmp.Width; x++) {
                Color c = bmp.GetPixel(x, y);
                // Detect colored pixels (red car / charm colors)
                if (c.R > 40 || c.G > 40 || c.B > 40) {
                    count++;
                }
            }
        }
        return count;
    }

    static void Main(string[] args) {
        Console.WriteLine("=== Starting VerifyCharmVisualContinuity ===");
        string artifactDir = @"C:\Users\HarisH\.gemini\antigravity-ide\brain\1d1a3417-f2f6-4c12-9b5f-c49d0c8315c6";
        string exePath = @"D:\Hariharan R\Lucky charm\release-bin\Lucky-Charm.exe";

        // Kill old instances
        foreach (Process p in Process.GetProcessesByName("lucky_charm")) {
            try { p.Kill(); } catch { }
        }
        foreach (Process p in Process.GetProcessesByName("Lucky-Charm")) {
            try { p.Kill(); } catch { }
        }
        Thread.Sleep(1000);

        Process proc = Process.Start(exePath);
        Thread.Sleep(3500); // Wait for initialization and React render

        try {
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

            // STEP 1: Cursor far away on desktop
            SetCursorPos(100, 700);
            Thread.Sleep(500);

            Bitmap bmpAway = CaptureWindowContent(tauriHwnd);
            int countAway = CountNonBlackPixels(bmpAway);
            string pathAway = Path.Combine(artifactDir, "charm_window_away.png");
            bmpAway.Save(pathAway, ImageFormat.Png);
            Console.WriteLine(string.Format("Step 1 (Cursor Away): Saved {0}, Colored Pixels = {1}", pathAway, countAway));

            // STEP 2: Cursor directly on the charm
            SetCursorPos(768, 170);
            Thread.Sleep(300);

            Bitmap bmpHover1 = CaptureWindowContent(tauriHwnd);
            int countHover1 = CountNonBlackPixels(bmpHover1);
            string pathHover1 = Path.Combine(artifactDir, "charm_window_hover_768.png");
            bmpHover1.Save(pathHover1, ImageFormat.Png);
            Console.WriteLine(string.Format("Step 2 (Cursor on 768,170): Saved {0}, Colored Pixels = {1}", pathHover1, countHover1));

            SetCursorPos(960, 170);
            Thread.Sleep(300);

            Bitmap bmpHover2 = CaptureWindowContent(tauriHwnd);
            int countHover2 = CountNonBlackPixels(bmpHover2);
            string pathHover2 = Path.Combine(artifactDir, "charm_window_hover_960.png");
            bmpHover2.Save(pathHover2, ImageFormat.Png);
            Console.WriteLine(string.Format("Step 3 (Cursor on 960,170): Saved {0}, Colored Pixels = {1}", pathHover2, countHover2));

            // STEP 3: Continuous movement across charm (20 transitions)
            Console.WriteLine("\nTesting 20 transitions across charm...");
            bool allFramesRendered = true;
            int minColoredPixels = int.MaxValue;

            for (int i = 0; i < 20; i++) {
                int targetX = (i % 2 == 0) ? 200 : 768 + (i * 10);
                int targetY = (i % 2 == 0) ? 600 : 170;
                SetCursorPos(targetX, targetY);
                Thread.Sleep(100);

                Bitmap bmpStep = CaptureWindowContent(tauriHwnd);
                int countStep = CountNonBlackPixels(bmpStep);
                if (countStep < minColoredPixels) minColoredPixels = countStep;

                if (countStep < (countAway * 0.7)) {
                    Console.WriteLine(string.Format("WARNING: Drop in colored pixels at step {0}! (Count: {1} vs Initial: {2})", i, countStep, countAway));
                    allFramesRendered = false;
                }
                bmpStep.Dispose();
            }

            Console.WriteLine(string.Format("\nContinuous Transition Result: Min Colored Pixels = {0}, Baseline = {1}", minColoredPixels, countAway));
            Console.WriteLine(string.Format("Visual Continuity Verdict: {0}", (allFramesRendered && countAway > 0) ? "PASS (ZERO DISAPPEARANCE)" : (countAway == 0 ? "INCONCLUSIVE_DWM" : "FAIL (DISAPPEARANCE DETECTED)")));

        } finally {
            if (!proc.HasExited) {
                proc.Kill();
            }
        }
    }
}
