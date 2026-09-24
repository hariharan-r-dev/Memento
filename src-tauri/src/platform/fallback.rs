use std::sync::Arc;
use tauri::{Runtime, WebviewWindow};

pub fn setup_window<R: Runtime>(window: &WebviewWindow<R>, _state: Arc<crate::platform::HitTestState>) {
  let _ = window.set_always_on_top(true);
  let _ = window.set_shadow(false);
  let _ = window.set_decorations(false);
}

pub fn position_at_top<R: Runtime>(_window: &WebviewWindow<R>) {}

pub fn set_click_through<R: Runtime>(window: &WebviewWindow<R>, ignore: bool) {
  let _ = window.set_ignore_cursor_events(ignore);
}

pub fn stop_monitor() {}

