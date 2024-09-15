mod description;
mod research;
mod utility;
mod building;
mod recipe;
mod uestring;

use std::collections::HashMap;

pub use description::{
    DescriptionEquipmentSlot, DescriptionGasType, DescriptionItem, DescriptionStackSize,
    DescriptionType,
};
pub use research::{ResearchItem, ResearchType};
use serde::{Deserialize, Serialize};
use specta::Type;
pub use utility::{Coercion, IconPath, NormalizedString, ClassReference};
pub use building::{BuildingFuelType, BuildingItem};
pub use recipe::RecipeItem;

#[derive(Debug, Clone, Serialize, Deserialize, Type)]
pub struct SatinData {
    pub research: HashMap<String, ResearchItem>,
    pub descriptions: HashMap<String, DescriptionItem>,
    pub buildables: HashMap<String, BuildingItem>,
    pub recipes: HashMap<String, RecipeItem>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Type)]
#[serde(tag = "item_type")]
#[serde(rename_all = "snake_case")]
pub enum SatinItem {
    Research(ResearchItem),
    Description(DescriptionItem),
    Buildable(BuildingItem),
    Recipe(RecipeItem)
}

impl SatinData {
    pub fn get_id(&self, id: String) -> Option<SatinItem> {
        if let Some(item) = self.research.get(&id) {
            return Some(SatinItem::Research(item.clone()));
        }

        if let Some(item) = self.descriptions.get(&id) {
            return Some(SatinItem::Description(item.clone()));
        }

        if let Some(item) = self.buildables.get(&id) {
            return Some(SatinItem::Buildable(item.clone()));
        }

        if let Some(item) = self.recipes.get(&id) {
            return Some(SatinItem::Recipe(item.clone()));
        }

        None
    }
}
