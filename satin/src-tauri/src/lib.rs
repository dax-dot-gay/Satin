use serde::{Deserialize, Serialize};
use specta_typescript::Typescript;
use tauri_specta::{collect_commands, collect_events, Builder};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = Builder::<tauri::Wry>::new()
        // Then register them (separated by a comma)
        .commands(collect_commands![])
        .events(collect_events![]);
    tauri::Builder::default()
        .invoke_handler(builder.invoke_handler())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_persisted_scope::init())
        .plugin(tauri_plugin_polodb::init())
        .setup(move |app| {
            builder.mount_events(app);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
