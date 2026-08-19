use rdd::Dd;
use tauri::AppHandle;

use crate::commands::data_folder::get_subfolder_path;


fn get_image_path(app: &AppHandle, image_name: &str) -> Option<String> {
    let data_folder = get_subfolder_path(app, "images").unwrap_or_default();
    let image_path = data_folder.join(image_name);
    if image_path.exists() {
        Some(image_path.to_string_lossy().to_string())
    } else {
        None
    }
}

fn get_device_path(device_name: &str) -> Option<String> {
    let device_path = std::path::Path::new("/dev").join(device_name);
    if device_path.exists() {
        Some(device_path.to_string_lossy().to_string())
    } else {
        None
    }
}



#[tauri::command]
pub async fn flash_image_to_device(app: AppHandle, image_name: String, device_name: String) -> Result<(), String> {
    let image_path = get_image_path(&app, &image_name)
        .ok_or_else(|| format!("Image '{}' not found in the data folder.", image_name))?;

    let device_path = get_device_path(&device_name).ok_or_else(|| {
        format!(
            "Device '{}' not found. Please ensure it is connected.",
            device_name
        )
    })?;

    // Use the rdd crate to flash the image to the device
    Dd::new("dd")
        .input(&image_path)
        .output(&device_path)
        .bs("4M") // 4MB block size for faster flashing
        .spawn()
        .map_err(|e| format!("Failed to flash image: {e}"))?;
    Ok(())
}
