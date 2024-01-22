# Hacking

This document explains how to run locally [proposals.network](https://proposals.network).

## Table of contents

- [Introduction](#introduction)
- [Development](#development)

## Introduction

This repo utilizes the [Junolator](https://github.com/junobuild/emulator), a local emulator suite designed for building and testing [Juno](https://juno.build)'s satellites locally.

While it's unofficial and not the developer experience I envision for Juno's devs to work locally, it serves its purpose for now, as I haven't yet developed a better tool yet.

## Development

Clone the repository and install dependencies:

```
git clone https://github.com/peterpeterparker/proposals.network
cd proposals.network
npm ci
```

Start dfx v0.15.2 from the root directory:

```bash
dfx start
```

Deploy Internet Identity and a Satellite:

```
./junolator deploy
```

Proceed with the configuration of the Satellite datastore:

```
./junolator config
```

At this point, you are good to go except that you need the NNS governance canister.

Run following command to install all the NNS canisters.

```
dfx nns install
```

If the command throws an error `error: unrecognized subcommand 'nns'`, it means the extension is not yet installed for dfx.
To install it run `dfx extension install nns`.

I suggest writing down the list of canisters and URLs printed out by the latest dfx command.
There is no way to print it again later on, so if you don't do so, you might never figure out where the NNS DApp is deployed locally.

Now that you've sorted the installation out, start the local development server of SvelteKit

```bash
npm run dev
```

Finally, open the dapp in your browser at [http://localhost:5173/](http://localhost:5173/).
