use dirs::data_dir;
use std::path::{Path, PathBuf};
use tauri::path::{self, BaseDirectory};
use serde::Serialize;

static DATA_FOLDER_NAME: &str = "mossbox_data";

fn get_data_path() -> PathBuf {
    let base_path = data_dir().unwrap_or_else(|| PathBuf::from("."));
    let data_path = base_path.join(DATA_FOLDER_NAME);
    data_path
}

#[derive(Serialize)]
pub struct OperationResult {
    success: bool,
    message: String,
}

#[tauri::command]
pub async fn create_data_folder() -> Result<OperationResult, OperationResult> {
    let data_folder_path = get_data_path();

    if !Path::new(&data_folder_path).exists() {
        std::fs::create_dir_all(&data_folder_path)
            .map_err(|e| OperationResult {
                success: false,
                message: e.to_string(),
            })?;
    }

    Ok(OperationResult {
        success: true,
        message: format!(
            "Data folder created at: {}",
            data_folder_path.display()
        ),
    })
}