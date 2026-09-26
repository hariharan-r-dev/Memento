pub mod platform;

use platform::HitTestState;
use std::sync::atomic::Ordering;
use std::sync::Arc;
use tauri::{
  menu::{CheckMenuItemBuilder, ContextMenu, MenuBuilder, MenuItemBuilder, PredefinedMenuItem, SubmenuBuilder},
  tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
  Emitter, Manager, State,
};
use tauri_plugin_global_shortcut::{GlobalShortcutExt, Shortcut, ShortcutState};

#[tauri::command]
fn set_ignore_cursor_events(app: tauri::AppHandle, ignore: bool) {
  if let Some(window) = app.get_webview_window("main") {
    platform::set_click_through(&window, ignore);
  }
}

#[tauri::command]
fn update_hit_test_state(
  state: State<'_, Arc<HitTestState>>,
  anchor_x: Option<i32>,
  rope_length: Option<i32>,
  charm_x: Option<i32>,
  charm_y: Option<i32>,
  charm_min_x: Option<i32>,
  charm_max_x: Option<i32>,
  charm_min_y: Option<i32>,
  charm_max_y: Option<i32>,
  pet_x: Option<i32>,
  pet_y: Option<i32>,
  has_pet: Option<bool>,
  is_dragging: Option<bool>,
  is_modal_open: Option<bool>,
) {
  if let Some(x) = anchor_x {
    state.anchor_x.store(x, Ordering::Relaxed);
  }
  if let Some(len) = rope_length {
    state.rope_length.store(len, Ordering::Relaxed);
  }
  if let Some(cx) = charm_x {
    state.charm_x.store(cx, Ordering::Relaxed);
  }
  if let Some(cy) = charm_y {
    state.charm_y.store(cy, Ordering::Relaxed);
  }
  if let Some(min_x) = charm_min_x {
    state.charm_min_x.store(min_x, Ordering::Relaxed);
  }
  if let Some(max_x) = charm_max_x {
    state.charm_max_x.store(max_x, Ordering::Relaxed);
  }
  if let Some(min_y) = charm_min_y {
    state.charm_min_y.store(min_y, Ordering::Relaxed);
  }
  if let Some(max_y) = charm_max_y {
    state.charm_max_y.store(max_y, Ordering::Relaxed);
  }
  if let Some(px) = pet_x {
    state.pet_x.store(px, Ordering::Relaxed);
  }
  if let Some(py) = pet_y {
    state.pet_y.store(py, Ordering::Relaxed);
  }
  if let Some(pet_active) = has_pet {
    state.has_pet.store(pet_active, Ordering::Relaxed);
  }
  if let Some(dragging) = is_dragging {
    state.is_dragging.store(dragging, Ordering::Relaxed);
  }
  if let Some(modal) = is_modal_open {
    state.is_modal_open.store(modal, Ordering::Relaxed);
  }
}

#[tauri::command]
fn toggle_charm(app: tauri::AppHandle) {
  if let Some(window) = app.get_webview_window("main") {
    if window.is_visible().unwrap_or(true) {
      let _ = window.hide();
    } else {
      let _ = window.show();
      let _ = window.set_focus();
    }
  }
}

#[tauri::command]
fn reset_position(app: tauri::AppHandle) {
  if let Some(window) = app.get_webview_window("main") {
    platform::position_at_top(&window);
    let _ = window.emit("reset-position", ());
  }
}

#[tauri::command]
fn perform_ritual(app: tauri::AppHandle) {
  if let Some(window) = app.get_webview_window("main") {
    let _ = window.emit("lucky-ritual", ());
  }
}

#[derive(serde::Serialize, serde::Deserialize, Default, Clone, Debug)]
pub struct StoredLicense {
  pub is_activated: bool,
  pub license_key: Option<String>,
  pub plan: Option<String>,
  pub plan_name: Option<String>,
  pub activated_at: Option<String>,
}

fn get_license_file_path() -> Option<std::path::PathBuf> {
  std::env::var("LOCALAPPDATA").ok().map(|p| {
    std::path::Path::new(&p)
      .join("com.memento.desktop")
      .join("license.json")
  })
}

pub fn is_app_activated() -> bool {
  if let Some(path) = get_license_file_path() {
    if path.exists() {
      if let Ok(content) = std::fs::read_to_string(&path) {
        if let Ok(data) = serde_json::from_str::<StoredLicense>(&content) {
          return data.is_activated && data.license_key.is_some();
        }
      }
    }
  }
  false
}

fn save_license_file(license: &StoredLicense) -> Result<(), String> {
  if let Some(path) = get_license_file_path() {
    if let Some(parent) = path.parent() {
      let _ = std::fs::create_dir_all(parent);
    }
    let json = serde_json::to_string_pretty(license).map_err(|e| e.to_string())?;
    std::fs::write(path, json).map_err(|e| e.to_string())?;
  }
  Ok(())
}

#[tauri::command]
fn deactivate_license() -> Result<(), String> {
  if let Some(path) = get_license_file_path() {
    if path.exists() {
      let _ = std::fs::remove_file(path);
    }
  }
  Ok(())
}

#[tauri::command]
fn open_activation_window(app: tauri::AppHandle) -> Result<(), String> {
  // Ensure license file on disk is removed so startup checks stay synchronized with deactivation state
  if let Some(path) = get_license_file_path() {
    if path.exists() {
      let _ = std::fs::remove_file(path);
    }
  }

  // Ensure main transparent window is completely hidden and not on top
  if let Some(main_win) = app.get_webview_window("main") {
    let _ = main_win.hide();
    let _ = main_win.set_always_on_top(false);
  }

  // Ensure settings window is closed/hidden so it does not stay open behind activation window
  if let Some(settings_win) = app.get_webview_window("settings") {
    let _ = settings_win.hide();
    if let Some(state) = app.try_state::<Arc<HitTestState>>() {
      state.settings_hwnd.store(0, Ordering::SeqCst);
    }
  }

  if let Some(win) = app.get_webview_window("activation") {
    if let Some(state) = app.try_state::<Arc<HitTestState>>() {
      if let Ok(raw_hwnd) = win.hwnd() {
        state.activation_hwnd.store(raw_hwnd.0 as isize, Ordering::SeqCst);
      }
    }
    let _ = win.show();
    let _ = win.unminimize();
    let _ = win.set_focus();
    return Ok(());
  }

  let url = tauri::WebviewUrl::App("index.html?window=activation".into());
  let win = tauri::WebviewWindowBuilder::new(&app, "activation", url)
    .title("Memento Activation")
    .initialization_script("window.__MEMENTO_WINDOW_MODE__ = 'activation';")
    .inner_size(520.0, 600.0)
    .min_inner_size(520.0, 600.0)
    .max_inner_size(520.0, 600.0)
    .center()
    .resizable(false)
    .decorations(true)
    .transparent(false)
    .always_on_top(false)
    .skip_taskbar(false)
    .build()
    .map_err(|e| e.to_string())?;

  if let Some(state) = app.try_state::<Arc<HitTestState>>() {
    if let Ok(raw_hwnd) = win.hwnd() {
      state.activation_hwnd.store(raw_hwnd.0 as isize, Ordering::SeqCst);
    }
  }

  let _ = win.set_focus();
  Ok(())
}

#[tauri::command]
fn close_activation_window(app: tauri::AppHandle) -> Result<(), String> {
  if let Some(state) = app.try_state::<Arc<HitTestState>>() {
    state.activation_hwnd.store(0, Ordering::SeqCst);
  }
  if let Some(win) = app.get_webview_window("activation") {
    let _ = win.close();
  }
  Ok(())
}

#[tauri::command]
fn show_main_window(app: tauri::AppHandle) -> Result<(), String> {
  if let Some(win) = app.get_webview_window("main") {
    let _ = win.show();
    let _ = win.unminimize();
    let _ = win.set_always_on_top(true);
  }
  Ok(())
}

#[tauri::command]
fn hide_main_window(app: tauri::AppHandle) -> Result<(), String> {
  if let Some(win) = app.get_webview_window("main") {
    let _ = win.hide();
    let _ = win.set_always_on_top(false);
  }
  Ok(())
}

#[tauri::command]
fn complete_activation(app: tauri::AppHandle, license: Option<StoredLicense>) -> Result<(), String> {
  if let Some(state) = app.try_state::<Arc<HitTestState>>() {
    state.activation_hwnd.store(0, Ordering::SeqCst);
  }
  if let Some(lic) = license {
    let _ = save_license_file(&lic);
  } else {
    let lic = StoredLicense {
      is_activated: true,
      license_key: Some("ACTIVATED".to_string()),
      plan: Some("memento_single".to_string()),
      plan_name: Some("Memento".to_string()),
      activated_at: None,
    };
    let _ = save_license_file(&lic);
  }

  if let Some(act_win) = app.get_webview_window("activation") {
    let _ = act_win.close();
  }
  if let Some(main_win) = app.get_webview_window("main") {
    let _ = main_win.show();
    let _ = main_win.unminimize();
    let _ = main_win.set_always_on_top(true);
    let _ = main_win.emit("activation-completed", ());
  }
  Ok(())
}

#[tauri::command]
fn open_settings_window(app: tauri::AppHandle, tab: Option<String>) -> Result<(), String> {
  let tab_name = tab.unwrap_or_else(|| "general".to_string());
  if let Some(win) = app.get_webview_window("settings") {
    if let Some(state) = app.try_state::<Arc<HitTestState>>() {
      if let Ok(raw_hwnd) = win.hwnd() {
        state.settings_hwnd.store(raw_hwnd.0 as isize, Ordering::SeqCst);
      }
    }
    let _ = win.show();
    let _ = win.unminimize();
    let _ = win.set_always_on_top(true);
    let _ = win.set_focus();
    let _ = win.emit("navigate-tab", tab_name);
    return Ok(());
  }

  let url = tauri::WebviewUrl::App(format!("index.html?window=settings&tab={}", tab_name).into());
  let win = tauri::WebviewWindowBuilder::new(&app, "settings", url)
    .title("Lucky Charm Preferences")
    .initialization_script("window.__MEMENTO_WINDOW_MODE__ = 'settings';")
    .inner_size(860.0, 600.0)
    .min_inner_size(780.0, 520.0)
    .center()
    .resizable(true)
    .decorations(true)
    .transparent(false)
    .always_on_top(true)
    .skip_taskbar(false)
    .build()
    .map_err(|e| e.to_string())?;

  if let Some(state) = app.try_state::<Arc<HitTestState>>() {
    if let Ok(raw_hwnd) = win.hwnd() {
      state.settings_hwnd.store(raw_hwnd.0 as isize, Ordering::SeqCst);
    }
  }

  let _ = win.set_focus();

  Ok(())
}

#[tauri::command]
fn open_settings(app: tauri::AppHandle, tab: Option<String>) {
  let _ = open_settings_window(app, tab);
}

#[tauri::command]
fn quit_app(app: tauri::AppHandle) {
  platform::stop_monitor();
  app.exit(0);
}


#[tauri::command]
fn show_context_menu(
  app: tauri::AppHandle,
  window: tauri::Window,
  target: Option<String>,
  _selected_charm: Option<String>,
  _selected_pet: Option<String>,
  _show_pet: Option<bool>,
  behavior_intensity: Option<f64>,
) -> Result<(), String> {
  let target_name = target.unwrap_or_else(|| "charm".to_string());

  let choose_charm_item = MenuItemBuilder::with_id("open_charm_picker", "Choose Charm").build(&app).map_err(|e| e.to_string())?;
  let choose_pet_item = MenuItemBuilder::with_id("open_pet_picker", "Choose Pet").build(&app).map_err(|e| e.to_string())?;
  let settings_item = MenuItemBuilder::with_id("open_settings", "Settings").build(&app).map_err(|e| e.to_string())?;
  let quit_item = MenuItemBuilder::with_id("quit", "Quit Memento").build(&app).map_err(|e| e.to_string())?;

  if target_name == "pet" {
    let cur_intensity = behavior_intensity.unwrap_or(1.0);
    let mut behavior_submenu_builder = SubmenuBuilder::new(&app, "Pet Behavior");
    let calm_item = CheckMenuItemBuilder::with_id("pet_behavior:calm", "Calm (0.6x)")
      .checked(cur_intensity <= 0.7)
      .build(&app)
      .map_err(|e| e.to_string())?;
    let normal_item = CheckMenuItemBuilder::with_id("pet_behavior:normal", "Normal (1.0x)")
      .checked(cur_intensity > 0.7 && cur_intensity < 1.3)
      .build(&app)
      .map_err(|e| e.to_string())?;
    let active_item = CheckMenuItemBuilder::with_id("pet_behavior:active", "Active (1.4x)")
      .checked(cur_intensity >= 1.3)
      .build(&app)
      .map_err(|e| e.to_string())?;
    behavior_submenu_builder = behavior_submenu_builder
      .item(&calm_item)
      .item(&normal_item)
      .item(&active_item);
    let behavior_submenu = behavior_submenu_builder.build().map_err(|e| e.to_string())?;

    let hide_pet_item = MenuItemBuilder::with_id("hide_pet", "Hide Pet").build(&app).map_err(|e| e.to_string())?;
    let sep1 = PredefinedMenuItem::separator(&app).map_err(|e| e.to_string())?;
    let sep2 = PredefinedMenuItem::separator(&app).map_err(|e| e.to_string())?;
    let sep3 = PredefinedMenuItem::separator(&app).map_err(|e| e.to_string())?;
    let sep4 = PredefinedMenuItem::separator(&app).map_err(|e| e.to_string())?;

    let menu = MenuBuilder::new(&app)
      .item(&choose_pet_item)
      .item(&choose_charm_item)
      .item(&sep1)
      .item(&behavior_submenu)
      .item(&sep2)
      .item(&hide_pet_item)
      .item(&sep3)
      .item(&settings_item)
      .item(&sep4)
      .item(&quit_item)
      .build()
      .map_err(|e| e.to_string())?;

    let _ = window.set_focus();
    menu.popup(window).map_err(|e| e.to_string())?;
  } else {
    // Charm context menu
    let ritual_item = MenuItemBuilder::with_id("ritual", "Lucky Ritual").build(&app).map_err(|e| e.to_string())?;
    let rope_appearance_item = MenuItemBuilder::with_id("open_rope_appearance", "Rope & Appearance").build(&app).map_err(|e| e.to_string())?;
    let physics_item = MenuItemBuilder::with_id("open_physics", "Physics").build(&app).map_err(|e| e.to_string())?;
    let reset_item = MenuItemBuilder::with_id("reset_pos", "Reset Position").build(&app).map_err(|e| e.to_string())?;
    let hide_item = MenuItemBuilder::with_id("hide_charm", "Hide").build(&app).map_err(|e| e.to_string())?;
    let sep1 = PredefinedMenuItem::separator(&app).map_err(|e| e.to_string())?;
    let sep2 = PredefinedMenuItem::separator(&app).map_err(|e| e.to_string())?;
    let sep3 = PredefinedMenuItem::separator(&app).map_err(|e| e.to_string())?;

    let menu = MenuBuilder::new(&app)
      .item(&ritual_item)
      .item(&choose_charm_item)
      .item(&choose_pet_item)
      .item(&sep1)
      .item(&rope_appearance_item)
      .item(&physics_item)
      .item(&settings_item)
      .item(&sep2)
      .item(&reset_item)
      .item(&hide_item)
      .item(&sep3)
      .item(&quit_item)
      .build()
      .map_err(|e| e.to_string())?;

    let _ = window.set_focus();
    menu.popup(window).map_err(|e| e.to_string())?;
  }

  Ok(())
}

#[cfg(windows)]
static MUTEX_HANDLE: std::sync::atomic::AtomicIsize = std::sync::atomic::AtomicIsize::new(0);

fn is_single_instance() -> bool {
  #[cfg(windows)]
  {
    use windows_sys::Win32::Foundation::{CloseHandle, GetLastError, ERROR_ALREADY_EXISTS, HANDLE};

    #[link(name = "kernel32")]
    extern "system" {
      fn CreateMutexW(lpMutexAttributes: *const std::ffi::c_void, bInitialOwner: i32, lpName: *const u16) -> HANDLE;
    }

    let mutex_name: Vec<u16> = "Global\\Memento_SingleInstance_Mutex_v1\0".encode_utf16().collect();
    let handle = unsafe { CreateMutexW(std::ptr::null(), 1, mutex_name.as_ptr()) };
    if handle.is_null() || handle == (-1isize as HANDLE) {
      return true;
    }
    if unsafe { GetLastError() } == ERROR_ALREADY_EXISTS {
      unsafe { CloseHandle(handle) };
      return false;
    }
    MUTEX_HANDLE.store(handle as isize, Ordering::SeqCst);
    true
  }
  #[cfg(not(windows))]
  {
    true
  }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  std::panic::set_hook(Box::new(|panic_info| {
    let temp_dir = std::env::temp_dir();
    let panic_log = temp_dir.join("memento_panic.log");
    let msg = match panic_info.payload().downcast_ref::<&'static str>() {
      Some(s) => (*s).to_string(),
      None => match panic_info.payload().downcast_ref::<String>() {
        Some(s) => s.clone(),
        None => format!("{:?}", panic_info),
      },
    };
    let loc = panic_info.location().map(|l| format!("{}:{}:{}", l.file(), l.line(), l.column())).unwrap_or_default();
    let _ = std::fs::write(panic_log, format!("PANIC: {} at {}\nDetails: {:?}", msg, loc, panic_info));
  }));

  let temp_dir = std::env::temp_dir();
  let log_file = temp_dir.join("memento_boot.log");
  let write_log = move |msg: &str| {
    use std::io::Write;
    if let Ok(mut f) = std::fs::OpenOptions::new().create(true).append(true).open(&log_file) {
      let _ = writeln!(f, "{}", msg);
    }
  };

  write_log("--- NEW BOOT SESSION ---");
  write_log("1. run() started");

  if !is_single_instance() {
    write_log("Another instance of Memento is already running. Bringing existing window to front and exiting cleanly.");
    #[cfg(windows)]
    {
      use windows_sys::Win32::UI::WindowsAndMessaging::{FindWindowW, SetForegroundWindow, ShowWindow, SW_RESTORE};
      let act_title: Vec<u16> = "Memento\0".encode_utf16().collect();
      let act_hwnd = unsafe { FindWindowW(std::ptr::null(), act_title.as_ptr()) };
      if !act_hwnd.is_null() {
        unsafe {
          ShowWindow(act_hwnd, SW_RESTORE);
          SetForegroundWindow(act_hwnd);
        }
      }
    }
    return;
  }

  // Clean stale lockfile if left behind by crashed/killed instances
  #[cfg(target_os = "windows")]
  {
    if let Ok(local_app_data) = std::env::var("LOCALAPPDATA") {
      let memento_lock = std::path::Path::new(&local_app_data)
        .join("com.memento.desktop")
        .join("EBWebView")
        .join("lockfile");
      let _ = std::fs::remove_file(memento_lock);

      let legacy_lock = std::path::Path::new(&local_app_data)
        .join("com.luckycharm.desktop")
        .join("EBWebView")
        .join("lockfile");
      let _ = std::fs::remove_file(legacy_lock);
    }
  }

  let hit_test_state = Arc::new(HitTestState::default());

  write_log("1.1. building tauri::Builder");
  let mut builder = tauri::Builder::default();

  write_log("1.2. adding log plugin");
  builder = builder.plugin(tauri_plugin_log::Builder::default().build());

  write_log("1.3. adding autostart plugin");
  builder = builder.plugin(tauri_plugin_autostart::init(
    tauri_plugin_autostart::MacosLauncher::LaunchAgent,
    Some(vec!["--autostart"]),
  ));

  write_log("1.4. adding global shortcut plugin");
  builder = builder.plugin(tauri_plugin_global_shortcut::Builder::new().build());

  write_log("1.5. adding state and handlers");
  let builder = builder
    .manage(hit_test_state.clone())
    .invoke_handler(tauri::generate_handler![
      set_ignore_cursor_events,
      update_hit_test_state,
      toggle_charm,
      reset_position,
      perform_ritual,
      open_settings,
      open_settings_window,
      open_activation_window,
      close_activation_window,
      show_main_window,
      hide_main_window,
      complete_activation,
      deactivate_license,
      quit_app,
      show_context_menu,
    ])
    .on_menu_event(|app, event| {
      let event_id = event.id().as_ref();
      match event_id {
        "ritual" => {
          let _ = app.emit("lucky-ritual", ());
        }
        "reset_pos" | "reset" => {
          reset_position(app.clone());
        }
        "hide_charm" | "show_hide" => {
          toggle_charm(app.clone());
        }
        "hide_pet" => {
          let _ = app.emit("set-show-pet", false);
        }
        "open_charm_picker" | "choose_charm" => {
          let _ = open_settings_window(app.clone(), Some("charms".to_string()));
        }
        "open_pet_picker" => {
          let _ = open_settings_window(app.clone(), Some("pets".to_string()));
        }
        "open_rope_appearance" => {
          let _ = open_settings_window(app.clone(), Some("rope".to_string()));
        }
        "open_physics" => {
          let _ = open_settings_window(app.clone(), Some("physics".to_string()));
        }
        "open_settings" | "settings" => {
          let _ = open_settings_window(app.clone(), Some("general".to_string()));
        }
        "activate" => {
          let _ = open_activation_window(app.clone());
        }
        "quit" => {
          platform::stop_monitor();
          app.exit(0);
        }
        id if id.starts_with("charm:") => {
          let charm_id = id.trim_start_matches("charm:");
          let _ = app.emit("set-selected-charm", charm_id);
        }
        id if id.starts_with("pet:") => {
          let pet_id = id.trim_start_matches("pet:");
          if pet_id == "none" {
            let _ = app.emit("set-show-pet", false);
          } else {
            let _ = app.emit("set-selected-pet", pet_id);
          }
        }
        id if id.starts_with("pet_behavior:") => {
          let mode = id.trim_start_matches("pet_behavior:");
          let intensity: f64 = match mode {
            "calm" => 0.6,
            "active" => 1.4,
            _ => 1.0,
          };
          let _ = app.emit("set-pet-behavior", intensity);
        }
        _ => {}
      }
    })
    .setup(move |app| {
      let boot_log = std::env::temp_dir().join("lucky_charm_boot.log");
      let append_log = |msg: &str| {
        use std::io::Write;
        if let Ok(mut f) = std::fs::OpenOptions::new().create(true).append(true).open(&boot_log) {
          let _ = writeln!(f, "{}", msg);
        }
      };

      append_log("2. setup started");

      let handle = app.handle().clone();

      // 1. Setup Main Window with HitTestState & License Check
      let activated = is_app_activated();
      append_log(&format!("3. is_app_activated: {}", activated));

      if let Some(window) = app.get_webview_window("main") {
        append_log("3.1 setup_window main");
        platform::setup_window(&window, hit_test_state);
        if !activated {
          append_log("3.2 not activated: hiding main window and opening activation window");
          let _ = window.hide();
          let _ = window.set_always_on_top(false);
          let _ = open_activation_window(handle.clone());
        }
      }

      // 2. Setup System Tray Menu
      append_log("4. building tray menu items");
      if let (Ok(show_hide_item), Ok(ritual_item), Ok(choose_charm_item), Ok(activate_item), Ok(reset_item), Ok(settings_item), Ok(quit_item)) = (
        MenuItemBuilder::with_id("show_hide", "Show / Hide").build(app),
        MenuItemBuilder::with_id("ritual", "Lucky Ritual").build(app),
        MenuItemBuilder::with_id("choose_charm", "Choose Charm").build(app),
        MenuItemBuilder::with_id("activate", "Activate License").build(app),
        MenuItemBuilder::with_id("reset", "Reset Position").build(app),
        MenuItemBuilder::with_id("settings", "Settings").build(app),
        MenuItemBuilder::with_id("quit", "Quit Memento").build(app),
      ) {
        if let Ok(tray_menu) = MenuBuilder::new(app)
          .items(&[
            &show_hide_item,
            &ritual_item,
            &choose_charm_item,
            &activate_item,
            &reset_item,
            &settings_item,
            &quit_item,
          ])
          .build()
        {
          append_log("5. building tray icon");
          let mut tray_builder = TrayIconBuilder::new()
            .menu(&tray_menu)
            .show_menu_on_left_click(false)
            .tooltip("Memento")
            .on_tray_icon_event(|tray, event| {
              if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
              } = event
              {
                let app = tray.app_handle();
                toggle_charm(app.clone());
              }
            });

          let icon = match tauri::image::Image::from_bytes(include_bytes!("../icons/32x32.png")) {
            Ok(img) => img,
            Err(_) => app.default_window_icon().cloned().expect("tray icon"),
          };
          tray_builder = tray_builder.icon(icon);

          let _ = tray_builder.build(app);
        }
      }

      // 3. Register Global Shortcut (Ctrl+Shift+D on Windows, Cmd+Shift+D on macOS)
      append_log("6. registering shortcut");
      #[cfg(target_os = "macos")]
      let shortcut_str = "CommandOrControl+Shift+D";
      #[cfg(not(target_os = "macos"))]
      let shortcut_str = "Ctrl+Shift+D";

      if let Ok(shortcut) = shortcut_str.parse::<Shortcut>() {
        let app_handle = handle.clone();
        let _ = app.global_shortcut().on_shortcut(shortcut, move |_app, _shortcut, event| {
          if event.state() == ShortcutState::Pressed {
            toggle_charm(app_handle.clone());
          }
        });
      }

      append_log("7. setup completed successfully");
      Ok(())
    })
    .on_window_event(|window, event| {
      let boot_log = std::env::temp_dir().join("lucky_charm_boot.log");
      if let Ok(mut f) = std::fs::OpenOptions::new().create(true).append(true).open(&boot_log) {
        use std::io::Write;
        let _ = writeln!(f, "Window [{}] event: {:?}", window.label(), event);
      }
      if let tauri::WindowEvent::Destroyed = event {
        if window.label() == "main" {
          platform::stop_monitor();
        } else if window.label() == "activation" {
          if let Some(state) = window.try_state::<Arc<HitTestState>>() {
            state.activation_hwnd.store(0, Ordering::SeqCst);
          }
        } else if window.label() == "settings" {
          if let Some(state) = window.try_state::<Arc<HitTestState>>() {
            state.settings_hwnd.store(0, Ordering::SeqCst);
          }
        }
      }
      if let tauri::WindowEvent::CloseRequested { api, .. } = event {
        if window.label() == "main" {
          api.prevent_close();
        } else if window.label() == "settings" {
          api.prevent_close();
          if let Some(state) = window.try_state::<Arc<HitTestState>>() {
            state.settings_hwnd.store(0, Ordering::SeqCst);
          }
          let _ = window.hide();
        } else if window.label() == "activation" {
          let app = window.app_handle();
          platform::stop_monitor();
          app.exit(0);
        }
      }
    });


  write_log("1.6. building application context");
  let app = builder
    .build(tauri::generate_context!())
    .expect("error while building tauri application");

  write_log("1.7. running application event loop");
  app.run(|_app_handle, _event| {});
}
