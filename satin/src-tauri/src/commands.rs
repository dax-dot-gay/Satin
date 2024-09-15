use std::collections::HashMap;

use satin_types::{BuildingItem, DescriptionItem, RecipeItem, ResearchItem, SatinData, SatinItem};
use tauri::{AppHandle, Manager};

#[tauri::command]
#[specta::specta]
pub fn get_data(app: AppHandle) -> SatinData {
    let data = app.state::<SatinData>().inner().clone();
    data
}

#[tauri::command]
#[specta::specta]
pub fn get_research(app: AppHandle) -> HashMap<String, ResearchItem> {
    let data = app.state::<SatinData>().inner().clone();
    data.research
}

#[tauri::command]
#[specta::specta]
pub fn get_descriptions(app: AppHandle) -> HashMap<String, DescriptionItem> {
    let data = app.state::<SatinData>().inner().clone();
    data.descriptions
}

#[tauri::command]
#[specta::specta]
pub fn get_buildables(app: AppHandle) -> HashMap<String, BuildingItem> {
    let data = app.state::<SatinData>().inner().clone();
    data.buildables
}

#[tauri::command]
#[specta::specta]
pub fn get_recipes(app: AppHandle) -> HashMap<String, RecipeItem> {
    let data = app.state::<SatinData>().inner().clone();
    data.recipes
}

#[tauri::command]
#[specta::specta]
pub fn get_item(app: AppHandle, id: String) -> Option<SatinItem> {
    let data = app.state::<SatinData>().inner().clone();
    data.get_id(id)
}