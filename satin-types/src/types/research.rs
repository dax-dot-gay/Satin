use serde::{Deserialize, Serialize};
use serde_json::Value;

use super::Coercion;

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum ResearchType {
    #[serde(alias = "EST_MAM")]
    MamResearch,

    #[serde(alias = "EST_Milestone")]
    Milestone,

    #[serde(alias = "EST_Alternate")]
    #[serde(alias = "EST_Custom")]
    AlternateRecipe,

    #[serde(alias = "EST_ResourceSink")]
    ResourceSink
}

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq)]
pub struct ResearchItem {
    #[serde(alias = "ClassName")]
    pub id: String,

    #[serde(alias = "mDisplayName")]
    pub display_name: String,

    #[serde(alias = "mDescription")]
    pub description: String,

    #[serde(alias = "mType")]
    pub research_type: ResearchType,

    #[serde(alias = "mCost")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cost: Option<String>,

    #[serde(alias = "mUnlocks")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub unlocks: Option<Vec<Value>>,

    #[serde(alias = "mSubCategories")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub sub_categories: Option<String>,

    #[serde(alias = "mTechTier")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tier: Option<Coercion>,
}