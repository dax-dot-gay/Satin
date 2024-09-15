mod cli;
mod generator;

use std::{
    error::Error,
    fs::{create_dir_all, write, File},
    io::{BufReader, Cursor},
    path::PathBuf,
};

use clap::Parser;
use cli::GeneratorArgs;
use generator::{Generated, Generator};
use serde_json::Value;
use utf16_reader::read_to_string;

fn normalize_source(source: PathBuf) -> Value {
    let file = File::open(source.clone())
        .expect(format!("Specified source path {:?} foes not exist", source.clone()).as_str());
    let reader = BufReader::new(file);
    let text = read_to_string(reader);
    serde_json::from_str::<Value>(text.as_str()).expect("Failed to parse JSON")
}

async fn download_files(
    generated: Generated,
    output_directory: PathBuf,
) -> Result<(), Box<dyn Error>> {
    let img_directory = output_directory.clone().join("assets");
    create_dir_all(img_directory.clone())?;
    for (key, val) in generated.descriptions {
        if let Some(icon) = val.icon {
            if icon.as_ref().len() == 0 {
                continue;
            }
            println!("Downloading icon for {key} ({}.png)...", icon.as_ref());
            let url = format!(
                "https://static.satisfactory-calculator.com/img/gameStable1.0/{}.png",
                icon.as_ref()
            );
            let response = reqwest::get(url).await?;
            if response.status().is_success() {
                let mut file =
                    File::create(img_directory.clone().join(format!("{}.png", icon.as_ref())))?;
                let mut content = Cursor::new(response.bytes().await?);
                std::io::copy(&mut content, &mut file)?;
            } else {
                let url = format!(
                    "https://static.satisfactory-calculator.com/img/gameStable1.0/IconDesc_{}.png",
                    icon.as_ref()
                );
                let response = reqwest::get(url).await?;

                if response.status().is_success() {
                    let mut file =
                        File::create(img_directory.clone().join(format!("{}.png", icon.as_ref())))?;
                    let mut content = Cursor::new(response.bytes().await?);
                    std::io::copy(&mut content, &mut file)?;
                } else {
                    if let Some((_, data)) = icon.as_ref().split_once("_") {
                        let url = format!(
                            "https://static.satisfactory-calculator.com/img/gameStable1.0/{}.png",
                            data
                        );
                        let response = reqwest::get(url).await?;

                        if response.status().is_success() {
                            let mut file = File::create(
                                img_directory.clone().join(format!("{}.png", icon.as_ref())),
                            )?;
                            let mut content = Cursor::new(response.bytes().await?);
                            std::io::copy(&mut content, &mut file)?;
                        } else {
                            println!("FAILED");
                        }
                    } else {
                        println!("FAILED");
                    }
                }
            }
        }
    }
    Ok(())
}

#[tokio::main]
async fn main() {
    let args = GeneratorArgs::parse();
    let data = normalize_source(args.source);
    let mut generator = Generator::new(data);
    let generated = generator.generate();
    create_dir_all(args.output.clone()).expect("Failed to create output directory");
    if args.pretty {
        write(
            args.output.clone().join("data.json"),
            serde_json::to_string_pretty(&generated).expect("Failed to serialize data"),
        )
        .expect("Failed to write to file");
    } else {
        write(
            args.output.clone().join("data.json"),
            serde_json::to_string(&generated).expect("Failed to serialize data"),
        )
        .expect("Failed to write to file");
    }

    if args.icons {
        download_files(generated.clone(), args.output.clone())
            .await
            .expect("Download failed.");
    }
}
