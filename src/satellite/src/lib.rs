mod assert;
mod delete;
mod types;

use crate::assert::{assert_metadata_exist, assert_metadata_status};
use crate::delete::{delete_proposal_asset, delete_proposal_doc};
use junobuild_macros::{assert_delete_doc, on_delete_doc};
use junobuild_satellite::{include_satellite, AssertDeleteDocContext, OnDeleteDocContext};

#[on_delete_doc(collections = ["metadata"])]
async fn on_delete_doc(context: OnDeleteDocContext) -> Result<(), String> {
    if context.data.data.is_none() {
        return Ok(());
    }

    let key = context.data.key;

    delete_proposal_doc(&"content".to_string(), &key)?;
    delete_proposal_asset(&"sns-parameters".to_string(), &key, "yaml")?;
    delete_proposal_asset(&"sns-logo".to_string(), &key, "png")?;

    Ok(())
}

#[assert_delete_doc]
fn assert_delete_doc(context: AssertDeleteDocContext) -> Result<(), String> {
    match context.data.collection.as_str() {
        "metadata" => assert_metadata_status(&context),
        _ => assert_metadata_exist(&context),
    }
}

include_satellite!();
