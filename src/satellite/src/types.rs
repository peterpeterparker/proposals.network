use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct MetadataData {
    pub status: String,
}
