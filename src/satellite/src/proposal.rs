use ic_cdk::id;
use junobuild_satellite::{delete_doc_store, get_doc_store, DelDoc};

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
