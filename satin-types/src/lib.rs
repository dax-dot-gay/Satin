pub mod types;
pub use types::*;

#[cfg(test)]
mod tests {
    use std::{fs::File, io::Read};

    use super::*;

    #[test]
    fn test_re_deserialization() {
        let mut file = File::open("../data-generator/out.json").expect("Test file non-existent");
        let result = serde_json::from_reader::<_, SatinData>(file);
        println!("{result:?}");
        assert!(result.is_ok());
    }
}
