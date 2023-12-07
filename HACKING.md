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

Start the emulator from the root directory:

```bash
./junolator start
```

Deploy Internet Identity and a Satellite:

```
./junolator deploy
```

**Here comes trouble**: At this point, you are good to go except that you need the NNS governance canister. You can install that canister by running `dfx nns install`. Unfortunately, I build stuff using dfx on port `:8000`, however, this command requires port `:8080`. So basically, you're going to have to stop/start the server and change manually the port in the dfx config. That sucks, I know.

1. Stop the emulator.
2. Open [dfx.json](./dfx.json).
3. Find `8000` and replace it with `8080`.
4. Restart the emulator.
5. Run `dfx nns install` to install all the NNS canisters.
6. Stop the server.
7. Open [dfx.json](./dfx.json).
8. Find `8080` and replace with `8000`.
9. Restart the emulator.

Note: You will need to perform the same mumbo jumbo if you want to create a neuron locally in the NNS DApp, as you would need one in the dapp to terminate the submission workflow.

Oh, and by the way, I suggest writing down the list of canisters and URLs printed out by the dfx command. There is no way to print it again later on, so if you don't, you might never figure out where the NNS DApp is deployed locally.

**Back to things that work**: Now that you've sorted that out, start the local development server of SvelteKit

```bash
npm run dev
```

Finally, open the dapp in your browser at [http://localhost:5173/](http://localhost:5173/).
