use std::sync::atomic::{AtomicBool, AtomicI32, Ordering};
use std::sync::Arc;
use tauri::{PhysicalPosition, PhysicalSize, Position, Runtime, Size, WebviewWindow};
use windows_sys::Win32::Foundation::{HWND, POINT, RECT};
use windows_sys::Win32::UI::HiDpi::GetDpiForWindow;
use windows_sys::Win32::UI::WindowsAndMessaging::{
    GetCursorPos, GetWindowLongPtrW, GetWindowRect, IsIconic, IsWindow, IsWindowVisible,
    SetWindowLongPtrW, GWL_EXSTYLE, WS_EX_TRANSPARENT,
};

pub struct HitTestState {
    pub anchor_x: AtomicI32,
    pub rope_length: AtomicI32,
    pub charm_x: AtomicI32,
    pub charm_y: AtomicI32,
    pub charm_min_x: AtomicI32,
    pub charm_max_x: AtomicI32,
    pub charm_min_y: AtomicI32,
    pub charm_max_y: AtomicI32,
    pub pet_x: AtomicI32,
    pub pet_y: AtomicI32,
    pub has_pet: AtomicBool,
    pub is_dragging: AtomicBool,
    pub is_modal_open: AtomicBool,
    pub activation_hwnd: std::sync::atomic::AtomicIsize,
    pub settings_hwnd: std::sync::atomic::AtomicIsize,
}

impl Default for HitTestState {
    fn default() -> Self {
        Self {
            anchor_x: AtomicI32::new(768),
            rope_length: AtomicI32::new(135),
            charm_x: AtomicI32::new(768),
            charm_y: AtomicI32::new(135),
            charm_min_x: AtomicI32::new(680),
            charm_max_x: AtomicI32::new(856),
            charm_min_y: AtomicI32::new(110),
            charm_max_y: AtomicI32::new(315),
            pet_x: AtomicI32::new(350),
            pet_y: AtomicI32::new(880),
            has_pet: AtomicBool::new(false),
            is_dragging: AtomicBool::new(false),
            is_modal_open: AtomicBool::new(false),
            activation_hwnd: std::sync::atomic::AtomicIsize::new(0),
            settings_hwnd: std::sync::atomic::AtomicIsize::new(0),
        }
    }
}

static MONITOR_RUNNING: AtomicBool = AtomicBool::new(false);

pub fn stop_monitor() {
    MONITOR_RUNNING.store(false, Ordering::SeqCst);
}

pub fn set_click_through_native(hwnd: HWND, ignore: bool) {
    unsafe {
        let ex_style = GetWindowLongPtrW(hwnd, GWL_EXSTYLE);
        let new_style = if ignore {
            ex_style | (WS_EX_TRANSPARENT as isize)
        } else {
            ex_style & !(WS_EX_TRANSPARENT as isize)
        };
        if new_style != ex_style {
            SetWindowLongPtrW(hwnd, GWL_EXSTYLE, new_style);
        }
    }
}

pub fn set_click_through<R: Runtime>(window: &WebviewWindow<R>, ignore: bool) {
    let _ = window.set_ignore_cursor_events(ignore);
    if let Ok(raw_hwnd) = window.hwnd() {
        set_click_through_native(raw_hwnd.0 as HWND, ignore);
    }
}

pub fn setup_window<R: Runtime>(window: &WebviewWindow<R>, state: Arc<HitTestState>) {
    let _ = window.set_always_on_top(true);
    let _ = window.set_shadow(false);
    let _ = window.set_decorations(false);
    let _ = window.set_skip_taskbar(true);

    position_at_top(window);

    let _ = window.show();
    let _ = window.unminimize();

    if let Ok(raw_hwnd) = window.hwnd() {
        let hwnd_val = raw_hwnd.0 as isize;

        // Start as click-through immediately on launch
        let hwnd = hwnd_val as HWND;
        let _ = window.set_ignore_cursor_events(true);
        set_click_through_native(hwnd, true);

        MONITOR_RUNNING.store(true, Ordering::SeqCst);

        std::thread::spawn(move || {
            let log_path = std::env::temp_dir().join("memento_monitor.log");
            let append_log = |msg: &str| {
                use std::io::Write;
                if let Ok(mut f) = std::fs::OpenOptions::new().create(true).append(true).open(&log_path) {
                    let _ = writeln!(f, "{}", msg);
                    let _ = f.flush();
                }
            };

            let hwnd = hwnd_val as HWND;
            let mut currently_interactive = false;
            let mut loop_ticks = 0u64;

            unsafe {
                #[link(name = "user32")]
                extern "system" {
                    fn OpenInputDesktop(dwFlags: u32, fInherit: i32, dwDesiredAccess: u32) -> *mut std::ffi::c_void;
                    fn SetThreadDesktop(hDesktop: *mut std::ffi::c_void) -> i32;
                }
                let desk = OpenInputDesktop(0, 0, 0x02000000 | 0x00000040 | 0x00000001); // MAXIMUM_ALLOWED | DESKTOP_READOBJECTS
                if !desk.is_null() {
                    let set_res = SetThreadDesktop(desk);
                    append_log(&format!("OpenInputDesktop success, SetThreadDesktop={}", set_res));
                } else {
                    let err = windows_sys::Win32::Foundation::GetLastError();
                    append_log(&format!("OpenInputDesktop returned null, err={}", err));
                }
            }

            append_log(&format!("Monitor thread entering loop. raw_hwnd=0x{:X}", hwnd_val));

            while MONITOR_RUNNING.load(Ordering::SeqCst) {
                std::thread::sleep(std::time::Duration::from_millis(16)); // ~60Hz polling

                if !MONITOR_RUNNING.load(Ordering::SeqCst) {
                    append_log("Monitor thread stopping because MONITOR_RUNNING=false");
                    break;
                }

                let mut pt = POINT { x: 0, y: 0 };
                let mut got_cursor = unsafe { GetCursorPos(&mut pt) } != 0;
                if !got_cursor {
                    unsafe {
                        #[link(name = "user32")]
                        extern "system" {
                            fn GetPhysicalCursorPos(lpPoint: *mut POINT) -> i32;
                        }
                        got_cursor = GetPhysicalCursorPos(&mut pt) != 0;
                    }
                }

                if !got_cursor {
                    let err = unsafe { windows_sys::Win32::Foundation::GetLastError() };
                    append_log(&format!("GetCursorPos returned false, err={}", err));
                    std::thread::sleep(std::time::Duration::from_millis(200));
                    continue;
                }

                let mut win_rect = RECT { left: 0, top: 0, right: 0, bottom: 0 };
                let got_rect = unsafe { GetWindowRect(hwnd, &mut win_rect) } != 0;
                if !got_rect {
                    append_log(&format!("GetWindowRect failed for HWND 0x{:X}", hwnd_val));
                    break;
                }

                let dpi = unsafe { GetDpiForWindow(hwnd) };
                let dpi_scale = if dpi > 0 { (dpi as f64) / 96.0 } else { 1.0 };
                let local_x = (pt.x - win_rect.left) as f64 / dpi_scale;
                let local_y = (pt.y - win_rect.top) as f64 / dpi_scale;

                loop_ticks += 1;
                if loop_ticks <= 5 || loop_ticks % 60 == 0 {
                    let ex = unsafe { GetWindowLongPtrW(hwnd, GWL_EXSTYLE) };
                    append_log(&format!(
                        "Tick #{}. pt=({},{}), local=({:.1},{:.1}), dpi={}, ex=0x{:X}, cur_inter={}, anchor_x={}, charm=({},{}) [{}-{}, {}-{}]",
                        loop_ticks, pt.x, pt.y, local_x, local_y, dpi,
                        ex, currently_interactive,
                        state.anchor_x.load(Ordering::Relaxed),
                        state.charm_x.load(Ordering::Relaxed),
                        state.charm_y.load(Ordering::Relaxed),
                        state.charm_min_x.load(Ordering::Relaxed),
                        state.charm_max_x.load(Ordering::Relaxed),
                        state.charm_min_y.load(Ordering::Relaxed),
                        state.charm_max_y.load(Ordering::Relaxed)
                    ));
                }

                // Check if main window itself is hidden
                if unsafe { IsWindowVisible(hwnd) } == 0 {
                    if currently_interactive {
                        currently_interactive = false;
                        set_click_through_native(hwnd, true);
                    }
                    continue;
                }

                // Check if cursor is over the native Activation window (obtained directly via Tauri WebviewWindow HWND)
                let act_hwnd_val = state.activation_hwnd.load(Ordering::Relaxed);
                if act_hwnd_val != 0 && act_hwnd_val != hwnd_val {
                    let act_hwnd = act_hwnd_val as HWND;
                    if unsafe { IsWindow(act_hwnd) != 0 && IsWindowVisible(act_hwnd) != 0 && IsIconic(act_hwnd) == 0 } {
                        let mut act_rect = RECT { left: 0, top: 0, right: 0, bottom: 0 };
                        if unsafe { GetWindowRect(act_hwnd, &mut act_rect) } != 0 {
                            if pt.x >= act_rect.left
                                && pt.x < act_rect.right
                                && pt.y >= act_rect.top
                                && pt.y < act_rect.bottom
                            {
                                if currently_interactive {
                                    currently_interactive = false;
                                    set_click_through_native(hwnd, true);
                                }
                                continue;
                            }
                        }
                    }
                }

                // Check if cursor is over the native Settings window (obtained directly via Tauri WebviewWindow HWND)
                let set_hwnd_val = state.settings_hwnd.load(Ordering::Relaxed);
                if set_hwnd_val != 0 && set_hwnd_val != hwnd_val {
                    let set_hwnd = set_hwnd_val as HWND;
                    if unsafe { IsWindow(set_hwnd) != 0 && IsWindowVisible(set_hwnd) != 0 && IsIconic(set_hwnd) == 0 } {
                        let mut settings_rect = RECT { left: 0, top: 0, right: 0, bottom: 0 };
                        if unsafe { GetWindowRect(set_hwnd, &mut settings_rect) } != 0 {
                            if pt.x >= settings_rect.left
                                && pt.x < settings_rect.right
                                && pt.y >= settings_rect.top
                                && pt.y < settings_rect.bottom
                            {
                                if currently_interactive {
                                    currently_interactive = false;
                                    set_click_through_native(hwnd, true);
                                }
                                continue;
                            }
                        }
                    }
                }

                let anchor_x = state.anchor_x.load(Ordering::Relaxed) as f64;
                let charm_x = state.charm_x.load(Ordering::Relaxed) as f64;
                let charm_y = state.charm_y.load(Ordering::Relaxed) as f64;
                let is_dragging = state.is_dragging.load(Ordering::Relaxed);
                let is_modal_open = state.is_modal_open.load(Ordering::Relaxed);

                // 1. If actively dragging: stay interactive
                let mut should_be_interactive = is_dragging;

                if !should_be_interactive {
                    // 2. Top Bracket: local_y in [0, 26], local_x in [anchor_x - 32, anchor_x + 32]
                    let over_bracket = local_y >= 0.0 && local_y <= 26.0
                        && local_x >= (anchor_x - 32.0) && local_x <= (anchor_x + 32.0);

                    // 3. Braided Rope Corridor: distance to linear segment <= 20px
                    let over_rope = if local_y >= 0.0 && local_y <= (charm_y + 12.0) {
                        let t = (local_y / charm_y.max(1.0)).clamp(0.0, 1.0);
                        let expected_rope_x = anchor_x + (charm_x - anchor_x) * t;
                        (local_x - expected_rope_x).abs() <= 20.0
                    } else {
                        false
                    };

                    // 4. Hanging Talisman Charm body (Dynamic rotated & scaled bounds from React)
                    let c_min_x = state.charm_min_x.load(Ordering::Relaxed) as f64;
                    let c_max_x = state.charm_max_x.load(Ordering::Relaxed) as f64;
                    let c_min_y = state.charm_min_y.load(Ordering::Relaxed) as f64;
                    let c_max_y = state.charm_max_y.load(Ordering::Relaxed) as f64;

                    let over_charm = if c_min_x < c_max_x && c_min_y < c_max_y {
                        local_x >= c_min_x && local_x <= c_max_x
                            && local_y >= c_min_y && local_y <= c_max_y
                    } else {
                        // Safe fallback before first React bounding box sync
                        local_x >= (charm_x - 75.0) && local_x <= (charm_x + 75.0)
                            && local_y >= (charm_y - 20.0) && local_y <= (charm_y + 160.0)
                    };

                    // 5. Roaming Desktop Pet Companion (Centered at pet_x, pet_y)
                    let has_pet = state.has_pet.load(Ordering::Relaxed);
                    let pet_x = state.pet_x.load(Ordering::Relaxed) as f64;
                    let pet_y = state.pet_y.load(Ordering::Relaxed) as f64;
                    let over_pet = has_pet
                        && local_x >= (pet_x - 50.0) && local_x <= (pet_x + 50.0)
                        && local_y >= (pet_y - 50.0) && local_y <= (pet_y + 50.0);

                    // 6. In-Overlay Popovers (CharmPicker / PetPicker / Onboarding card: center 680x540)
                    let win_w = (win_rect.right - win_rect.left) as f64;
                    let win_h = (win_rect.bottom - win_rect.top) as f64;
                    let center_x = win_w / 2.0;
                    let center_y = win_h / 2.0;
                    let over_modal_card = is_modal_open
                        && local_x >= (center_x - 350.0) && local_x <= (center_x + 350.0)
                        && local_y >= (center_y - 280.0) && local_y <= (center_y + 280.0);

                    should_be_interactive = over_bracket || over_rope || over_charm || over_pet || over_modal_card;
                }

                if should_be_interactive != currently_interactive {
                    currently_interactive = should_be_interactive;
                    append_log(&format!("State change -> currently_interactive={}, setting click_through={}", currently_interactive, !currently_interactive));
                    set_click_through_native(hwnd, !currently_interactive);
                }
            }
        });
    }
}

pub fn position_at_top<R: Runtime>(window: &WebviewWindow<R>) {
    let monitor_opt = window.current_monitor().ok().flatten().or_else(|| window.primary_monitor().ok().flatten());
    if let Some(monitor) = monitor_opt {
        let screen_size = monitor.size();
        let screen_pos = monitor.position();

        let _ = window.set_position(Position::Physical(PhysicalPosition {
            x: screen_pos.x,
            y: screen_pos.y,
        }));
        let _ = window.set_size(Size::Physical(PhysicalSize {
            width: screen_size.width,
            height: screen_size.height.saturating_sub(2),
        }));
        let _ = window.show();
        let _ = window.unminimize();
        let _ = window.set_always_on_top(true);
    }
}

