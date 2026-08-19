use serde::Serialize;
use std::fs;
use std::path::{Component, PathBuf};
use tauri::{AppHandle, Manager};

const DATA_FOLDER_NAME: &str = "mossbox_data";

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FileInfo {
    pub name: String,
    pub path: String,
    pub is_directory: bool,
    pub size: Option<u64>,
}

fn get_data_path(app: &AppHandle) -> Result<PathBuf, String> {
    let base_path = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data directory: {e}"))?;

    Ok(base_path.join(DATA_FOLDER_NAME))
}

fn validate_subfolder(subfolder: &str) -> Result<(), String> {
    let path = std::path::Path::new(subfolder);

    // Empty paths are allowed; they refer to the root data folder.
    if subfolder.is_empty() {
        return Ok(());
    }

    // Only allow relative paths.
    if path.is_absolute() {
        return Err("Subfolder must be a relative path.".to_string());
    }

    // Prevent ".", "..", and platform-specific prefix/root components.
    for component in path.components() {
        match component {
            Component::Normal(_) => {}
            _ => {
                return Err("Invalid subfolder path.".to_string());
            }
        }
    }

    Ok(())
}

fn get_subfolder_path(app: &AppHandle, subfolder: &str) -> Result<PathBuf, String> {
    validate_subfolder(subfolder)?;

    let data_path = get_data_path(app)?;
    Ok(data_path.join(subfolder))
}

#[tauri::command]
pub fn create_data_folder(app: AppHandle) -> Result<FileInfo, String> {
    let data_path = get_data_path(&app)?;

    fs::create_dir_all(&data_path).map_err(|e| format!("Failed to create data folder: {e}"))?;

    let metadata = fs::metadata(&data_path)
        .map_err(|e| format!("Failed to read data folder metadata: {e}"))?;

    Ok(FileInfo {
        name: DATA_FOLDER_NAME.to_string(),
        path: data_path.to_string_lossy().into_owned(),
        is_directory: metadata.is_dir(),
        size: None,
    })
}

#[tauri::command]
pub fn list_files_in_data_folder(
    app: AppHandle,
    subfolder: String,
    create_if_missing: Option<bool>,
) -> Result<Vec<FileInfo>, String> {
    let folder_path = get_subfolder_path(&app, &subfolder)?;

    if !folder_path.exists() {
        if create_if_missing.unwrap_or(false) {
            fs::create_dir_all(&folder_path).map_err(|e| {
                format!(
                    "Failed to create data folder '{}': {e}",
                    folder_path.display()
                )
            })?;
        } else {
            return Err(format!(
                "Data folder does not exist: {}",
                folder_path.display()
            ));
        }
    }

    if !folder_path.is_dir() {
        return Err(format!(
            "Path is not a directory: {}",
            folder_path.display()
        ));
    }

    let entries = fs::read_dir(&folder_path).map_err(|e| {
        format!(
            "Failed to read data folder '{}': {e}",
            folder_path.display()
        )
    })?;

    let mut files = Vec::new();

    for entry in entries {
        let entry = entry.map_err(|e| format!("Failed to read directory entry: {e}"))?;

        let path = entry.path();

        let metadata = entry
            .metadata()
            .map_err(|e| format!("Failed to read metadata for '{}': {e}", path.display()))?;

        files.push(FileInfo {
            name: entry.file_name().to_string_lossy().into_owned(),
            path: path.to_string_lossy().into_owned(),
            is_directory: metadata.is_dir(),
            size: if metadata.is_file() {
                Some(metadata.len())
            } else {
                None
            },
        });
    }

    // Optional: make the UI ordering deterministic.
    files.sort_by(|a, b| a.name.to_lowercase().cmp(&b.name.to_lowercase()));

    Ok(files)
}
