#!/bin/bash

./junolator deploy

dfx nns install

dfx ledger fabricate-cycles --canister qaa6y-5yaaa-aaaaa-aaafa-cai --t 100000

./scripts/download.icrc.sh
./scripts/upload.icrc.mjs

