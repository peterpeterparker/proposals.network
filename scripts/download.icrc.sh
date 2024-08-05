#!/bin/bash

DIR=.

IC_COMMIT="43f31c0a1b0d9f9ecbc4e2e5f142c56c7d9b0c7b"

curl -sSL https://download.dfinity.systems/ic/$IC_COMMIT/canisters/ic-icrc1-index-ng.wasm.gz -o "$DIR"/ic-icrc1-index-ng.wasm.gz

curl -sSL https://raw.githubusercontent.com/dfinity/ic/$IC_COMMIT/rs/rosetta-api/icrc1/index-ng/index-ng.did -o "$DIR"/ic-icrc1-index-ng.did
