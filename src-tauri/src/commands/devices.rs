use serde::{de::Unexpected::Enum, Serialize};
use sysinfo::Disks;
use udev::Enumerator;

#[derive(Debug, Serialize)]
pub struct StorageDevice {
    pub devnode: Option<String>,
    pub syspath: String,
    pub model: Option<String>,
    pub serial: Option<String>,
    pub vendor: Option<String>,
    pub size: Option<u64>,
    pub removable: bool,
}

#[tauri::command]
pub async fn get_disks() -> Result<Vec<StorageDevice>, String> {
    let mut enumerator =
        Enumerator::new().map_err(|e| format!("Failed to create udev enumerator: {e}"))?;
    enumerator
        .match_subsystem("block")
        .map_err(|e| format!("Failed to match block subsystem: {e}"))?;

    let mut result: Vec<StorageDevice> = Vec::new();

    for device in enumerator
        .scan_devices()
        .map_err(|e| format!("Failed to scan devices: {e}"))?
    {
        if device.property_value("DEVTYPE").and_then(|v| v.to_str()) != Some("disk") {
            continue;
        }

        let storage_device = StorageDevice {
            devnode: device.devnode().map(|p| p.to_string_lossy().into_owned()),
            syspath: device.syspath().to_string_lossy().into_owned(),
            model: device.property_value("ID_MODEL").and_then(|v| v.to_str()).map(|s| s.to_string()),
            serial: device.property_value("ID_SERIAL").and_then(|v| v.to_str()).map(|s| s.to_string()),
            vendor: device.property_value("ID_VENDOR").and_then(|v| v.to_str()).map(|s| s.to_string()),
            size: device.property_value("ID_SIZE").and_then(|v| v.to_str()).and_then(|s| s.parse::<u64>().ok()),
            removable: device.property_value("ID_REMOVABLE").and_then(|v| v.to_str()) == Some("1"),
        };

        result.push(storage_device);
    }
    Ok(result)
}
