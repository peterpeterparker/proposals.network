use junobuild_macros::{assert_delete_doc, assert_set_doc};
use junobuild_satellite::{include_satellite, AssertDeleteDocContext, AssertSetDocContext};

#[assert_set_doc]
fn assert_set_doc(_context: AssertSetDocContext) -> Result<(), String> {
    Ok(())
}

#[assert_delete_doc]
fn assert_delete_doc(_context: AssertDeleteDocContext) -> Result<(), String> {
    Ok(())
}

include_satellite!();
