#[cfg(target_os = "windows")]
pub mod windows;
#[cfg(target_os = "windows")]
pub use windows as current;

#[cfg(target_os = "macos")]
pub mod macos;
#[cfg(target_os = "macos")]
pub use macos as current;

#[cfg(not(any(target_os = "windows", target_os = "macos")))]
pub mod fallback;
#[cfg(not(any(target_os = "windows", target_os = "macos")))]
pub use fallback as current;

pub use current::HitTestState;

use std::sync::Arc;
use tauri::{Runtime, WebviewWindow};

pub fn setup_window<R: Runtime>(window: &WebviewWindow<R>, state: Arc<HitTestState>) {
  current::setup_window(window, state);
}

pub fn position_at_top<R: Runtime>(window: &WebviewWindow<R>) {
  current::position_at_top(window);
}

pub fn set_click_through<R: Runtime>(window: &WebviewWindow<R>, ignore: bool) {
  current::set_click_through(window, ignore);
}

pub fn stop_monitor() {
  current::stop_monitor();
}

