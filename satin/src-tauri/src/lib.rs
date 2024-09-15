mod commands;

use std::fs::File;

use satin_types::{SatinData, SatinItem};
use specta_typescript::Typescript;
use tauri::{path::BaseDirectory, Manager};
use tauri_specta::{collect_commands, collect_events, Builder};

use commands::*;


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = Builder::<tauri::Wry>::new()
        // Then register them (separated by a comma)
        .commands(collect_commands![get_data, get_research, get_descriptions, get_buildables, get_recipes, get_item])
        .events(collect_events![])
        .typ::<SatinData>()
        .typ::<SatinItem>();

    #[cfg(debug_assertions)] // <- Only export on non-release builds
    builder
        .export(Typescript::default(), "../src/types/backend/specta.ts")
        .expect("Failed to export typescript bindings");
    tauri::Builder::default()
        .invoke_handler(builder.invoke_handler())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_persisted_scope::init())
        .plugin(tauri_plugin_polodb::init())
        .setup(move |app| {
            builder.mount_events(app);

            // Load data
            let datapath = app.path().resolve("data/data.json", BaseDirectory::Resource)?;
            let datafile = File::open(datapath)?;
            let parsed = serde_json::from_reader::<_, SatinData>(datafile)?;
            app.manage(parsed);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
