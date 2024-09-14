use convert_case::{Case, Casing};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Clone, Debug, PartialEq)]
#[serde(untagged)]
pub enum Coercion {
    Float(f64),
    Integer(i64),
    Boolean(bool),
    String(Option<String>),
}

impl<'de> Deserialize<'de> for Coercion {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let raw = String::deserialize(deserializer)?;
        Ok(match raw.as_str() {
            "True" => Coercion::Boolean(true),
            "False" => Coercion::Boolean(false),
            "None" => Coercion::String(None),
            v => {
                if let Ok(valid_num) = v.parse::<f64>() {
                    if valid_num.ceil() == valid_num {
                        Coercion::Integer(valid_num as i64)
                    } else {
                        Coercion::Float(valid_num)
                    }
                } else {
                    Coercion::String(Some(v.to_string()))
                }
            }
        })
    }
}

impl Into<f64> for Coercion {
    fn into(self) -> f64 {
        if let Coercion::Float(v) = self {
            v
        } else {
            0.0
        }
    }
}

impl Into<i64> for Coercion {
    fn into(self) -> i64 {
        if let Coercion::Integer(v) = self {
            v
        } else {
            0
        }
    }
}

impl Into<bool> for Coercion {
    fn into(self) -> bool {
        if let Coercion::Boolean(v) = self {
            v
        } else {
            false
        }
    }
}

impl Into<Option<String>> for Coercion {
    fn into(self) -> Option<String> {
        if let Coercion::String(v) = self {
            v
        } else {
            None
        }
    }
}

impl Into<String> for Coercion {
    fn into(self) -> String {
        if let Coercion::String(v) = self {
            v.unwrap_or(String::new())
        } else {
            String::new()
        }
    }
}

#[derive(Serialize, Clone, Debug, PartialEq)]
pub struct IconPath(Option<String>);

impl<'de> Deserialize<'de> for IconPath {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let raw = String::deserialize(deserializer)?;
        if let Some((_, name)) = raw.rsplit_once(".") {
            if let Some((unsize, _)) = name.rsplit_once("_") {
                Ok(IconPath(Some(format!("{unsize}_256"))))
            } else {
                Ok(IconPath(None))
            }
        } else {
            Ok(IconPath(None))
        }
    }
}

#[derive(Serialize, Clone, Debug, PartialEq)]
pub struct NormalizedString(String);

impl<'de> Deserialize<'de> for NormalizedString {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let raw = String::deserialize(deserializer)?;
        Ok(NormalizedString(raw.to_case(Case::Pascal)))
    }
}
