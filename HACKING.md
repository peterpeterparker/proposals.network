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
dfx extension install nns
```

Run following command to finally install all the NNS canisters.

```
dfx nns install
```

I suggest writing down the list of canisters and URLs printed out by the latest dfx command.
There is no way to print it again later on, so if you don't do so, you might never figure out where the NNS DApp is deployed locally.

Now that you've sorted the installation out, start the local development server of SvelteKit

```bash
npm run dev
```

Finally, open the dapp in your browser at [http://localhost:5173/](http://localhost:5173/).
