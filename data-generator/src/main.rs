mod cli;
mod generator;

use std::{fs::{create_dir_all, write, File}, io::BufReader, path::PathBuf};

use clap::Parser;
use cli::GeneratorArgs;
use serde_json::Value;
use utf16_reader::read_to_string;
use generator::Generator;

fn normalize_source(source: PathBuf) -> Value {
    let file = File::open(source.clone())
        .expect(format!("Specified source path {:?} foes not exist", source.clone()).as_str());
    let reader = BufReader::new(file);
    let text = read_to_string(reader);
    serde_json::from_str::<Value>(text.as_str()).expect("Failed to parse JSON")
}

fn main() {
    let args = GeneratorArgs::parse();
    let data = normalize_source(args.source);
    let mut generator = Generator::new(data);
    let generated = generator.generate();
    create_dir_all(args.output.clone()).expect("Failed to create output directory");
    if args.pretty {
        write(args.output.clone().join("data.json"), serde_json::to_string_pretty(&generated).expect("Failed to serialize data")).expect("Failed to write to file");
    } else {
        write(args.output.clone().join("data.json"), serde_json::to_string(&generated).expect("Failed to serialize data")).expect("Failed to write to file");
    }
    
}
