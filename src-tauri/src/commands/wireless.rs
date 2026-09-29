#[cfg(not(target_os = "macos"))]
use wifiscanner::{self, Wifi};
// pub struct Network {
//     pub ssid: String,
//     // pub signal_strength: i32,
//     // pub security: String,
// }

#[tauri::command]
pub async fn scan_wireless_networks() -> Result<Vec<SerializableWifi>, String> {
    let networks = scan_networks()?;
    Ok(networks
        .into_iter()
        .map(|network| SerializableWifi {
            mac: network.mac,
            ssid: network.ssid,
            channel: network.channel,
            signal_level: network.signal_level,
            security: network.security,
        })
        .collect())
}

#[cfg(not(target_os = "macos"))]
fn scan_networks() -> Result<Vec<Wifi>, String> {
    wifiscanner::scan().map_err(|e| format!("Failed to scan wireless networks: {:?}", e))
}

#[cfg(target_os = "macos")]
fn scan_networks() -> Result<Vec<MacWifi>, String> {
    use std::process::Command;

    let hardware_ports = Command::new("/usr/sbin/networksetup")
        .arg("-listallhardwareports")
        .output()
        .map_err(|error| format!("Failed to find wireless interface: {error}"))?;
    let hardware_ports = String::from_utf8_lossy(&hardware_ports.stdout);
    let device = hardware_ports
        .lines()
        .collect::<Vec<_>>()
        .windows(2)
        .find(|lines| lines[0].trim() == "Hardware Port: Wi-Fi")
        .and_then(|lines| lines[1].strip_prefix("Device: "))
        .map(str::trim)
        .ok_or_else(|| "No Wi-Fi interface found".to_string())?;

    let preferred_networks = Command::new("/usr/sbin/networksetup")
        .args(["-listpreferredwirelessnetworks", device])
        .output()
        .map_err(|error| format!("Failed to list wireless networks: {error}"))?;
    if !preferred_networks.status.success() {
        return Err(String::from_utf8_lossy(&preferred_networks.stderr)
            .trim()
            .to_string());
    }

    Ok(String::from_utf8_lossy(&preferred_networks.stdout)
        .lines()
        .skip(1)
        .map(str::trim)
        .filter(|ssid| !ssid.is_empty())
        .map(|ssid| MacWifi {
            ssid: ssid.to_string(),
            mac: String::new(),
            channel: String::new(),
            signal_level: String::new(),
            security: String::new(),
        })
        .collect())
}

#[cfg(target_os = "macos")]
struct MacWifi {
    mac: String,
    ssid: String,
    channel: String,
    signal_level: String,
    security: String,
}

#[derive(serde::Serialize)]
pub struct SerializableWifi {
    pub mac: String,
    pub ssid: String,
    pub channel: String,
    pub signal_level: String,
    pub security: String,
}
