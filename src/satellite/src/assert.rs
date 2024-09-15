use crate::types::MetadataData;
use ic_cdk::id;
use junobuild_satellite::{get_doc_store, AssertDeleteDocContext};
use junobuild_utils::decode_doc_data;

pub fn assert_metadata_exist(context: &AssertDeleteDocContext) -> Result<(), String> {
    let metadata = get_doc_store(id(), "metadata".to_string(), context.data.key.clone())?;

    if metadata.is_some() {
        return Err(
            "The document cannot not be deleted. The related metadata still exists.".to_string(),
        );
    }

    Ok(())
}

pub fn assert_metadata_status(context: &AssertDeleteDocContext) -> Result<(), String> {
    if let Some(doc) = &context.data.data.current {
        let data: MetadataData = decode_doc_data(&doc.data)?;

        if data.status != "draft" {
            return Err("Only draft of proposals can be deleted.".to_string());
        }
    }

    Ok(())
}
