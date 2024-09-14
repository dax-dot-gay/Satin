use convert_case::{Case, Casing};
use serde::{Deserialize, Serialize};
use serde_json::Value;

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
        let deserialized = Value::deserialize(deserializer)?;
        if let Some(raw) = deserialized.clone().as_str() {
            Ok(match raw {
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
        } else {
            match deserialized {
                Value::Bool(v) => Ok(Coercion::Boolean(v)),
                Value::Number(v) => if v.is_f64() {
                    Ok(Coercion::Float(v.as_f64().unwrap()))
                } else if v.is_i64() {
                    Ok(Coercion::Integer(v.as_i64().unwrap()))
                } else {
                    Ok(Coercion::Integer(v.as_u64().unwrap() as i64))
                },
                Value::String(v) => Ok(Coercion::String(Some(v))),
                Value::Null => Ok(Coercion::String(None)),
                _ => Ok(Coercion::String(None))
            }
        }
        
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
        if !raw.contains("/") && raw.ends_with("256") {
            Ok(IconPath(Some(raw)))
        } else {
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
}

impl Into<String> for IconPath {
    fn into(self) -> String {
        self.0.or(Some(String::new())).unwrap()
    }
}

impl AsRef<str> for IconPath {
    fn as_ref(&self) -> &str {
        match &self.0 {
            Some(v) => v.as_str(),
            None => ""
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

impl Into<String> for NormalizedString {
    fn into(self) -> String {
        self.0
    }
}

impl AsRef<str> for NormalizedString {
    fn as_ref(&self) -> &str {
        self.0.as_str()
    }
}

#[derive(Serialize, Clone, Debug, PartialEq)]
pub struct ClassReference(String);

impl<'de> Deserialize<'de> for ClassReference {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let raw = String::deserialize(deserializer)?;
        if raw.contains("/") {
            if let Some((_, name)) = raw.rsplit_once(".") {
                Ok(ClassReference(name.to_case(Case::Pascal).trim_end_matches("'\"").to_string()))
            } else {
                Ok(ClassReference(raw))
            }
        } else {
            Ok(ClassReference(raw))
        }
    }
}

impl Into<String> for ClassReference {
    fn into(self) -> String {
        self.0
    }
}

impl AsRef<str> for ClassReference {
    fn as_ref(&self) -> &str {
        self.0.as_str()
    }
}