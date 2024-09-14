use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use serde_json::{Map, Value};

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Generated {
    pub research: HashMap<String, Value>,
    pub descriptions: HashMap<String, Value>,
    pub buildables: HashMap<String, Value>,
    pub recipes: HashMap<String, Value>
}

#[derive(Debug, Clone)]
pub struct Generator {
    data: Generated,
    raw: Value,
}

/*
Generate data from:
- Research
- Desc + BP
- Build
- Recipe
*/
impl Generator {
    pub fn new(data: Value) -> Self {
        Generator {
            data: Generated {
                research: HashMap::new(),
                recipes: HashMap::new(),
                descriptions: HashMap::new(),
                buildables: HashMap::new()
            },
            raw: data.clone(),
        }
    }

    fn handle_research(&mut self, data: Map<String, Value>) {

    }

    fn handle_recipe(&mut self, data: Map<String, Value>) {
        
    }

    fn handle_description(&mut self, data: Map<String, Value>) {
        
    }

    fn handle_buildable(&mut self, data: Map<String, Value>) {
        
    }

    pub fn generate(&mut self) {
        for category in self
            .clone()
            .raw
            .as_array()
            .expect("Expected array at docs root")
            .iter()
            .map(|v| {
                v.as_object()
                    .expect("Expected object in root array")
                    .clone()
            })
        {
            let classes = category
                .get("Classes")
                .expect("Expected Classes key")
                .as_array()
                .expect("Expected array of classes")
                .iter()
                .map(|v| v.as_object().expect("Expected array of objects").clone())
                .collect::<Vec<Map<String, Value>>>();

            
            for class in classes {
                let ctype = class.get("ClassName").expect("Expected ClassName").as_str().expect("Expected string").split_once("_").expect("Expected _").0;
                match ctype {
                    "Desc" => self.handle_description(class.clone()),
                    "BP" => self.handle_description(class.clone()),
                    "Research" => self.handle_research(class.clone()),
                    "Recipe" => self.handle_recipe(class.clone()),
                    "Buildable" => self.handle_buildable(class.clone()),
                    _ => ()
                }
            }
        }
    }
}
