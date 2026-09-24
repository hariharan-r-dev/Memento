use std::sync::Arc;
use tauri::{PhysicalPosition, Position, Runtime, WebviewWindow};

#[cfg(not(target_os = "windows"))]
pub struct HitTestState {
    pub anchor_x: std::sync::atomic::AtomicI32,
    pub rope_length: std::sync::atomic::AtomicI32,
    pub charm_x: std::sync::atomic::AtomicI32,
    pub charm_y: std::sync::atomic::AtomicI32,
    pub is_dragging: std::sync::atomic::AtomicBool,
    pub is_modal_open: std::sync::atomic::AtomicBool,
}

#[cfg(not(target_os = "windows"))]
impl Default for HitTestState {
    fn default() -> Self {
        Self {
            anchor_x: std::sync::atomic::AtomicI32::new(130),
            rope_length: std::sync::atomic::AtomicI32::new(135),
            charm_x: std::sync::atomic::AtomicI32::new(130),
            charm_y: std::sync::atomic::AtomicI32::new(135),
            is_dragging: std::sync::atomic::AtomicBool::new(false),
            is_modal_open: std::sync::atomic::AtomicBool::new(false),
        }
    }
}

pub fn setup_window<R: Runtime>(window: &WebviewWindow<R>, _state: Arc<HitTestState>) {
  let _ = window.set_always_on_top(true);
  let _ = window.set_shadow(false);
  let _ = window.set_decorations(false);
  
  position_at_top(window);
}

pub fn position_at_top<R: Runtime>(window: &WebviewWindow<R>) {
  if let Ok(Some(monitor)) = window.primary_monitor() {
    let screen_size = monitor.size();
    let scale_factor = monitor.scale_factor();
    let win_width = 260.0 * scale_factor;
    let center_x = ((screen_size.width as f64 - win_width) / 2.0) as i32;

    let _ = window.set_position(Position::Physical(PhysicalPosition {
      x: center_x,
      y: 0,
    }));
  }
}

pub fn set_click_through<R: Runtime>(window: &WebviewWindow<R>, ignore: bool) {
  let _ = window.set_ignore_cursor_events(ignore);
}

pub fn stop_monitor() {}

