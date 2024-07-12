# Hacking

This document explains how to run locally [proposals.network](https://proposals.network).

Start by cloning the repository and install dependencies:

```
git clone https://github.com/peterpeterparker/proposals.network
cd proposals.network
npm ci
```

Start dfx v0.20.0 from the root directory:

```bash
dfx start
```

> It will crash some errors but, it's expected. See this [thread](https://forum.dfinity.org/t/dfx-nns-install-unusable/32802) for context.

Deploy Internet Identity and a Satellite:

```
./junolator deploy
```

Proceed with the configuration of the Satellite datastore:

```
./junolator config
```

At this point, you are good to go except that you need the NNS governance canister.

Uninstall (if you previously installed the extension) and install the NNS extension which will spin the Governance and NNS dapp:

```
dfx extension uninstall nns
dfx extension install nns --version 0.4.2
```

Run following command to finally install all the NNS canisters.

```
dfx nns install
```

I suggest writing down the list of canisters and URLs printed out by the latest dfx command.
There is no way to print it again later on, so if you don't do so, you might never figure out where the NNS DApp is deployed locally.

At this point you are almost good but, if you want to test SNS proposal locally you need to top up the SNS-W canister that was spin with previous script as it is not deployed with enough resources. Don't ask why.

> Here was assume nns-sns-wasm was deployed with qaa6y-5yaaa-aaaaa-aaafa-cai. Double check it's the case.

```
dfx canister deposit-cycles 50000000000000 qaa6y-5yaaa-aaaaa-aaafa-cai
```

In addition you will need to patch the ICRC-1 Index canister Wasm uploaded in the SNS-Wasm canister because `dfx nns install` is buggy.

```
./scripts/download.icrc.sh
./scripts/upload.icrc.mjs
```

Now that you've sorted the installation out, start the local development server of SvelteKit.

```bash
npm run dev
```

Finally, open the dapp in your browser at [http://localhost:5173/](http://localhost:5173/).

## Additional tips for SNS Proposals

### Decentralizing a dApp

If you would like to test the proposal of SNS locally that is linked to `dappCanisters`, proceed as following:

First, temporary copy the `satellite` entry in `dfx.json` and copy it to `satellite_2`.

Then run the following command:

```
dfx canister create satellite_2
dfx canister update-settings --add-controller r7inp-6aaaa-aaaaa-aaabq-cai satellite_2
```

Finally revert your change in `dfx.json` and use the canister ID that was created for the dapp you would like to decentralize locally.

### Neuron Fund

To create a SNS proposal for a SNS.yaml file that specify `neurons_fund_participation: true` you need to do two things.

1. In NNS dapp, select the neuron that you have created and enable `Participate in neuron's fund`.

2. Then open your terminal run following command to provide that particular neuron maturity by running following script:

```
./scripts/update.neuron.mjs
```

> Note that you will need a hotkey. The script is hardcoded to use my dfx PEM file, so you will need to update the path to the file in the `dfx.identity.mjs` script and then add the principal that is printed out as a hotkey for the neuron.
