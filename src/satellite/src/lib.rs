mod proposal;

use crate::proposal::delete_proposal_doc;
use ic_cdk::id;
use junobuild_macros::{assert_delete_doc, on_delete_doc};
use junobuild_satellite::{
    get_doc_store, include_satellite, AssertDeleteDocContext, OnDeleteDocContext,
};

#[on_delete_doc(collections = ["metadata"])]
async fn on_delete_doc(context: OnDeleteDocContext) -> Result<(), String> {
    if context.data.data.is_none() {
        return Ok(());
    }

    let key = context.data.key;

    delete_proposal_doc(&"content".to_string(), &key)?;
    delete_proposal_doc(&"sns-parameters".to_string(), &key)?;
    delete_proposal_doc(&"sns-logo".to_string(), &key)?;

    Ok(())
}

#[assert_delete_doc(collections = ["content", "sns-parameters", "sns-logo"])]
fn assert_delete_doc(context: AssertDeleteDocContext) -> Result<(), String> {
    let metadata = get_doc_store(id(), "metadata".to_string(), context.data.key)?;

    if let Some(_) = metadata {
        return Err(
            "The document cannot not be deleted. The related metadata still exists.".to_string(),
        );
    }

    Ok(())
}

include_satellite!();
