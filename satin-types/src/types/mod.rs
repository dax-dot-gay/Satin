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
pub use utility::{Coercion, IconPath, NormalizedString};
pub use building::{BuildingFuelType, BuildingItem};
pub use recipe::RecipeItem;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SatinData {
    pub research: HashMap<String, ResearchItem>,
    pub descriptions: HashMap<String, DescriptionItem>,
    pub buildables: HashMap<String, BuildingItem>,
    pub recipes: HashMap<String, RecipeItem>,
}
