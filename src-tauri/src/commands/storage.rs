use serde::Serialize;
use sysinfo::Disks;

#[derive(Serialize)]
pub struct DiskInfo {
    mount_point: String,
    total_space: u64,
    available_space: u64,
    file_system: String,
}

#[tauri::command]
pub async fn get_disks() -> Result<Vec<DiskInfo>, String> {
    let disks = Disks::new_with_refreshed_list();

    let disk_info = disks
        .iter()
        .map(|disk| DiskInfo {
            mount_point: disk.mount_point().to_string_lossy().to_string(),
            total_space: disk.total_space(),
            available_space: disk.available_space(),
            file_system: disk.file_system().to_string_lossy().to_string(),
        })
        .collect();

    Ok(disk_info)
}