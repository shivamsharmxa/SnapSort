
use tauri::Manager;
use tauri_plugin_shell::ShellExt;
use std::path::PathBuf;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .setup(|app| {
      // Setup logging
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }

      // Auto-start NestJS backend
      let app_handle = app.handle().clone();
      tauri::async_runtime::spawn(async move {
        if let Err(e) = start_backend(&app_handle).await {
          log::error!("Failed to start backend: {}", e);
        }
      });

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

async fn start_backend(app: &tauri::AppHandle) -> Result<(), String> {
  // Get the resource path where backend is bundled
  let backend_path = get_backend_path(app)?;
  
  log::info!("Starting NestJS backend from: {:?}", backend_path);

  // Get node executable path
  let node_path = get_node_path()?;
  
  log::info!("Using Node.js from: {:?}", node_path);

  // Spawn the backend process
  let shell = app.shell();
  let (_rx, child) = shell.command(&node_path)
    .args([backend_path.to_str().unwrap()])
    .spawn()
    .map_err(|e| format!("Failed to spawn backend: {}", e))?;

  log::info!("Backend process started with PID: {:?}", child.pid());

  Ok(())
}

fn get_backend_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
  let backend_main = if cfg!(debug_assertions) {
    // Dev mode: Navigate up from src-tauri to project root
    let current_dir = std::env::current_dir()
      .map_err(|e| format!("Failed to get current dir: {}", e))?;
    
    // If we're in src-tauri, go up one level
    let project_root = if current_dir.ends_with("src-tauri") {
      current_dir.parent().unwrap().to_path_buf()
    } else {
      current_dir
    };
    
    project_root.join("backend").join("dist").join("main.js")
  } else {
    // Production: Use bundled resources
    let resource_path = app
      .path()
      .resource_dir()
      .map_err(|e| format!("Failed to get resource dir: {}", e))?;
    resource_path.join("backend").join("dist").join("main.js")
  };

  if !backend_main.exists() {
    return Err(format!(
      "Backend main.js not found at: {:?}. Make sure backend is built with 'npm run build --prefix backend'",
      backend_main
    ));
  }

  log::info!("Backend path resolved: {:?}", backend_main);
  Ok(backend_main)
}

fn get_node_path() -> Result<String, String> {
  // In production, use system Node.js
  // Users must have Node.js installed (requirement)
  
  #[cfg(target_os = "macos")]
  {
    // Common Node.js paths on macOS
    let paths = vec![
      "/opt/homebrew/bin/node",      // Homebrew ARM (M1/M2)
      "/usr/local/bin/node",          // Homebrew Intel
      "/usr/bin/node",                // System
    ];

    for path in paths {
      if std::path::Path::new(path).exists() {
        return Ok(path.to_string());
      }
    }

    // Fallback: use "node" from PATH
    Ok("node".to_string())
  }

  #[cfg(not(target_os = "macos"))]
  {
    Ok("node".to_string())
  }
}
