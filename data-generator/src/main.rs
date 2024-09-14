mod cli;
mod generator;

use std::{fs::File, io::BufReader, path::PathBuf};

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
    generator.generate();
}
