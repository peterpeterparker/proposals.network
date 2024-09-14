use junobuild_macros::{assert_delete_doc};
use junobuild_satellite::{include_satellite, AssertDeleteDocContext};

#[assert_delete_doc]
fn assert_delete_doc(_context: AssertDeleteDocContext) -> Result<(), String> {
    Ok(())
}

include_satellite!();
