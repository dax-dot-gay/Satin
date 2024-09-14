use serde::{Deserialize, Serialize};

use super::{Coercion, NormalizedString};

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct RecipeItem {
    #[serde(alias = "ClassName")]
    pub id: NormalizedString,

    #[serde(alias = "mDisplayName")]
    pub display_name: String,

    #[serde(alias = "mIngredients")]
    pub ingredients: String,

    #[serde(alias = "mProduct")]
    pub product: String,

    #[serde(alias = "mManufactoringDuration")]
    #[serde(alias = "mManufacturingDuration")]
    pub duration: Coercion,

    #[serde(alias = "mProducedIn")]
    pub machine: String
}