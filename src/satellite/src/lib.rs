use ic_cdk::id;
use junobuild_macros::{assert_delete_doc};
use junobuild_satellite::{include_satellite, AssertDeleteDocContext, get_doc_store};

#[assert_delete_doc(collections = ["content", "sns-parameters", "sns-logo"])]
fn assert_delete_doc(context: AssertDeleteDocContext) -> Result<(), String> {
    let metadata = get_doc_store(id(), "metadata".to_string(), context.data.key)?;

    if metadata.is_some() {
        return Err("The document cannot not be deleted. The related metadata still exists.".to_string());
    }

    Ok(())
}

include_satellite!();
