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

#[tauri::command]
fn open_settings_window(app: tauri::AppHandle, tab: Option<String>) -> Result<(), String> {
  let tab_name = tab.unwrap_or_else(|| "general".to_string());
  if let Some(win) = app.get_webview_window("settings") {
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
  let quit_item = MenuItemBuilder::with_id("quit", "Quit Lucky Charm").build(&app).map_err(|e| e.to_string())?;

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

static LOCK_FILE: std::sync::OnceLock<std::fs::File> = std::sync::OnceLock::new();

fn is_single_instance() -> bool {
  if let Ok(local_app_data) = std::env::var("LOCALAPPDATA") {
    let dir = std::path::Path::new(&local_app_data).join("com.luckycharm.desktop");
    let _ = std::fs::create_dir_all(&dir);
    let lock_path = dir.join("instance.lock");
    match std::fs::OpenOptions::new()
      .read(true)
      .write(true)
      .create(true)
      .truncate(false)
      .open(&lock_path)
    {
      Ok(file) => {
        let _ = LOCK_FILE.set(file);
        true
      }
      Err(_) => false,
    }
  } else {
    true
  }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  std::panic::set_hook(Box::new(|panic_info| {
    let temp_dir = std::env::temp_dir();
    let panic_log = temp_dir.join("lucky_charm_panic.log");
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
  let log_file = temp_dir.join("lucky_charm_boot.log");
  let write_log = move |msg: &str| {
    use std::io::Write;
    if let Ok(mut f) = std::fs::OpenOptions::new().create(true).append(true).open(&log_file) {
      let _ = writeln!(f, "{}", msg);
    }
  };

  write_log("--- NEW BOOT SESSION ---");
  write_log("1. run() started");

  if !is_single_instance() {
    write_log("Another instance of Lucky Charm is already running. Exiting cleanly.");
    return;
  }

  // Clean stale lockfile if left behind by crashed/killed instances
  #[cfg(target_os = "windows")]
  {
    if let Ok(local_app_data) = std::env::var("LOCALAPPDATA") {
      let lock_path = std::path::Path::new(&local_app_data)
        .join("com.luckycharm.desktop")
        .join("EBWebView")
        .join("lockfile");
      let _ = std::fs::remove_file(lock_path);
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
          let _ = app.emit("open-charm-picker", ());
        }
        "open_pet_picker" => {
          let _ = app.emit("open-pet-picker", ());
        }
        "open_rope_appearance" => {
          let _ = open_settings_window(app.clone(), Some("appearance".to_string()));
        }
        "open_physics" => {
          let _ = open_settings_window(app.clone(), Some("physics".to_string()));
        }
        "open_settings" | "settings" => {
          let _ = open_settings_window(app.clone(), Some("general".to_string()));
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

      // 1. Setup Main Window with HitTestState
      if let Some(window) = app.get_webview_window("main") {
        append_log("3. setup_window main");
        platform::setup_window(&window, hit_test_state);
      }

      // 2. Setup System Tray Menu
      append_log("4. building tray menu items");
      if let (Ok(show_hide_item), Ok(ritual_item), Ok(choose_charm_item), Ok(reset_item), Ok(settings_item), Ok(quit_item)) = (
        MenuItemBuilder::with_id("show_hide", "Show / Hide").build(app),
        MenuItemBuilder::with_id("ritual", "Lucky Ritual").build(app),
        MenuItemBuilder::with_id("choose_charm", "Choose Charm").build(app),
        MenuItemBuilder::with_id("reset", "Reset Position").build(app),
        MenuItemBuilder::with_id("settings", "Settings").build(app),
        MenuItemBuilder::with_id("quit", "Quit Lucky Charm").build(app),
      ) {
        if let Ok(tray_menu) = MenuBuilder::new(app)
          .items(&[
            &show_hide_item,
            &ritual_item,
            &choose_charm_item,
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
            .tooltip("Lucky Charm")
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
        }
      }
      if let tauri::WindowEvent::CloseRequested { api, .. } = event {
        if window.label() == "main" {
          api.prevent_close();
        } else if window.label() == "settings" {
          api.prevent_close();
          let _ = window.hide();
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
