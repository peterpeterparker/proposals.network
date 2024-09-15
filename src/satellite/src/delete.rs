use ic_cdk::id;
use junobuild_satellite::{
    delete_asset_store, delete_doc_store, get_asset_store, get_doc_store, DelDoc,
};

pub fn delete_proposal_doc(collection: &String, key: &str) -> Result<(), String> {
    let content = get_doc_store(id(), collection.to_string(), key.to_string())?;

    if let Some(content) = content {
        let del_doc = DelDoc {
            version: content.version,
        };

        let _ = delete_doc_store(id(), collection.to_string(), key.to_string(), del_doc)?;
    }

    Ok(())
}

pub fn delete_proposal_asset(
    collection: &String,
    key: &str,
    extension: &str,
) -> Result<(), String> {
    let full_path = format!("/{}/{}.{}", collection, key, extension);

    let asset = get_asset_store(id(), collection, full_path.clone())?;

    if asset.is_some() {
        let _ = delete_asset_store(id(), collection, full_path)?;
    }

    Ok(())
}
