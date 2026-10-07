// PortaPXE rust-side commands.

use systemctl::SystemCtl;

pub struct DnsmasqPxeConfiguration {
    interface: String,
}

#[tauri::command]
pub fn write_dnsmasq_configuration(config: DnsmasqPxeConfiguration) -> Result<(), String> {
    let config_content = format!(
        "interface={}\ndhcp-range={},{},120",
        config.interface,
        "192.168.1.100",
        "192.168.1.200"
    );
    // write config to /tmp/mossbox-dnsmasq.conf
    std::fs::write("/tmp/mossbox-dnsmasq.conf", config_content).map_err(|e| format!("Failed to write dnsmasq configuration: {}", e))?;
    Ok(())
}

#[tauri::command]
pub fn read_dnsmasq_configuration() -> Result<DnsmasqPxeConfiguration, String> {
    let config_content = std::fs::read_to_string("/tmp/mossbox-dnsmasq.conf")
        .map_err(|e| format!("Failed to read dnsmasq configuration: {}", e))?;
    let interface_line = config_content
        .lines()
        .find(|line| line.starts_with("interface="))
        .ok_or_else(|| "No interface found in dnsmasq configuration".to_string())?;
    let interface = interface_line
        .strip_prefix("interface=")
        .ok_or_else(|| "Failed to parse interface from dnsmasq configuration".to_string())?
        .to_string();
    Ok(DnsmasqPxeConfiguration { interface })
}

// Check if the mossbox-dnsmasq service is active.
#[tauri::command]
pub fn is_dnsmasq_active() -> Result<bool, String> {
    let systemctl = SystemCtl::default();
    match systemctl.is_active("mossbox-dnsmasq.service") {
        Ok(active) => Ok(active),
        Err(_) => Err("Failed to check if dnsmasq is active".into()),
    }
}

#[tauri::command]
pub fn start_dnsmasq_service() -> Result<(), String> {
    let systemctl = SystemCtl::default();
    systemctl
        .start("mossbox-dnsmasq.service")
        .map_err(|e| format!("Failed to start dnsmasq service: {}", e))?;
    Ok(())
}