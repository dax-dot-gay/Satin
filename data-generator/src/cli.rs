use std::path::PathBuf;

use clap::Parser;

#[derive(Parser, Debug, Clone)]
#[command(version, about, long_about = None)]
pub struct GeneratorArgs {
    #[arg(short, long, help = "Source Docs.json file")]
    pub source: PathBuf
}