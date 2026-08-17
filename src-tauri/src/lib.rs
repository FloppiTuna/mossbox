mod commands;

use portable_pty::{native_pty_system, CommandBuilder, PtySize};
use serde::Serialize;
use std::{
    collections::HashMap,
    io::{Read, Write},
    sync::{Arc, Mutex},
};
use tauri::Emitter;
use uuid::Uuid;


struct TerminalSession {
    master: Mutex<Box<dyn portable_pty::MasterPty + Send>>,
    writer: Mutex<Box<dyn Write + Send>>,
    child: Mutex<Box<dyn portable_pty::Child + Send>>,
}

#[derive(Default)]
struct TerminalState {
    sessions: Mutex<HashMap<String, Arc<TerminalSession>>>,
}

#[derive(Clone, Serialize)]
struct TerminalOutputEvent {
    #[serde(rename = "sessionId")]
    session_id: String,
    data: String,
}

fn default_shell() -> String {
    std::env::var("SHELL").unwrap_or_else(|_| "/bin/zsh".to_string())
}

#[tauri::command]
fn start_terminal_session(
    app: tauri::AppHandle,
    state: tauri::State<'_, TerminalState>,
    cols: u16,
    rows: u16,
) -> Result<String, String> {
    let pty_system = native_pty_system();
    let pty_pair = pty_system
        .openpty(PtySize {
            rows,
            cols,
            pixel_width: 0,
            pixel_height: 0,
        })
        .map_err(|err| format!("failed to open pty: {err}"))?;

    let shell = default_shell();
    let mut cmd = CommandBuilder::new(shell);
    cmd.arg("-il");
    cmd.env("TERM", "xterm-256color");

    let child = pty_pair
        .slave
        .spawn_command(cmd)
        .map_err(|err| format!("failed to spawn shell: {err}"))?;

    let mut reader = pty_pair
        .master
        .try_clone_reader()
        .map_err(|err| format!("failed to clone pty reader: {err}"))?;
    let writer = pty_pair
        .master
        .take_writer()
        .map_err(|err| format!("failed to acquire pty writer: {err}"))?;

    let session_id = Uuid::new_v4().to_string();
    let session = Arc::new(TerminalSession {
        master: Mutex::new(pty_pair.master),
        writer: Mutex::new(writer),
        child: Mutex::new(child),
    });

    {
        let mut sessions = state
            .sessions
            .lock()
            .map_err(|_| "terminal state lock poisoned".to_string())?;
        sessions.insert(session_id.clone(), Arc::clone(&session));
    }

    let app_handle = app.clone();
    let emit_session_id = session_id.clone();
    std::thread::spawn(move || {
        let mut buffer = [0_u8; 8192];
        loop {
            match reader.read(&mut buffer) {
                Ok(0) => break,
                Ok(n) => {
                    let data = String::from_utf8_lossy(&buffer[..n]).to_string();
                    let payload = TerminalOutputEvent {
                        session_id: emit_session_id.clone(),
                        data,
                    };
                    let _ = app_handle.emit("terminal-output", payload);
                }
                Err(_) => break,
            }
        }
    });

    Ok(session_id)
}

#[tauri::command]
fn write_terminal_input(
    state: tauri::State<'_, TerminalState>,
    session_id: String,
    data: String,
) -> Result<(), String> {
    let session = {
        let sessions = state
            .sessions
            .lock()
            .map_err(|_| "terminal state lock poisoned".to_string())?;
        sessions
            .get(&session_id)
            .cloned()
            .ok_or_else(|| format!("session not found: {session_id}"))?
    };

    let mut writer = session
        .writer
        .lock()
        .map_err(|_| "terminal writer lock poisoned".to_string())?;
    writer
        .write_all(data.as_bytes())
        .map_err(|err| format!("failed to write terminal input: {err}"))?;
    writer
        .flush()
        .map_err(|err| format!("failed to flush terminal input: {err}"))?;

    Ok(())
}

#[tauri::command]
fn resize_terminal_session(
    state: tauri::State<'_, TerminalState>,
    session_id: String,
    cols: u16,
    rows: u16,
) -> Result<(), String> {
    let session = {
        let sessions = state
            .sessions
            .lock()
            .map_err(|_| "terminal state lock poisoned".to_string())?;
        sessions
            .get(&session_id)
            .cloned()
            .ok_or_else(|| format!("session not found: {session_id}"))?
    };

    let master = session
        .master
        .lock()
        .map_err(|_| "terminal master lock poisoned".to_string())?;
    master
        .resize(PtySize {
            rows,
            cols,
            pixel_width: 0,
            pixel_height: 0,
        })
        .map_err(|err| format!("failed to resize terminal: {err}"))?;

    Ok(())
}

#[tauri::command]
fn stop_terminal_session(
    state: tauri::State<'_, TerminalState>,
    session_id: String,
) -> Result<(), String> {
    let session = {
        let mut sessions = state
            .sessions
            .lock()
            .map_err(|_| "terminal state lock poisoned".to_string())?;
        sessions
            .remove(&session_id)
            .ok_or_else(|| format!("session not found: {session_id}"))?
    };

    let mut child = session
        .child
        .lock()
        .map_err(|_| "terminal child lock poisoned".to_string())?;
    child
        .kill()
        .map_err(|err| format!("failed to stop terminal session: {err}"))?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_network::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_device_info::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .manage(TerminalState::default())
        .invoke_handler(tauri::generate_handler![
            start_terminal_session,
            write_terminal_input,
            resize_terminal_session,
            stop_terminal_session,
            commands::storage::get_disks
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
