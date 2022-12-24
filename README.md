# Rain Protocol - Deployment

Easy way to deploy and track all the Rain Protocol deployments

## Development setup

### Nix Shell

Install the nix shell if you haven't already.

```
curl -L https://nixos.org/nix/install | sh
```

Drop into a nix-shell.

```
cd rain-deployment
nix-shell
```

This will install all the dependencies and files needed. It's a requirement work and run scripts under nix-shell. You can easy run nix command
from outside the shell with `nix-shell --run <COMMAND>`

## Environment requirements

Before start to work around the repository, it is necesarry fill your own environment file. The repository provide a `.env.example`, use it as
template to fill yours. Each section will show which variables are required for every action. Since this repository is mainly designed to deploy contracts,
the private keys or mnemonic seeds will be required. Be careful and NEVER share or push to GitHub the private variable enviroments.

## Contract deployment

Before start to deploy, it is necessary that the you provide your mnemonic seed to get the user to deploy. The private keys are not supported yet to be used directly from the enviroment file (lazy? :P), but you can put it directly to the HardhatConfig in the correspond network as the [Hardhat docs](https://hardhat.org/hardhat-runner/docs/config#available-config-options) show.

### Deployment configuration

The deployment process support EIP-1559 transactions and legacies (No EIP-1559).

- The EIP-1559 transactions are those transactions that use `maxPriorityFeePerGas` and `maxFeePerGas` when send the TX.
- The NON-EIP-1559 transactions are those transactions that just use the `gasPrice` when send the TX.

In the `deployment-config.json` file, you can specify the estimation of the gas cost that will be use in the deployment. This is calculate with values from the chain and you can define it into the file. It's really recommended just use **MARKET** prices (default), but the values availables are:

- **LOW**: Use -10% of the current market value calculated. Take in mind that this will make the deployment process longer if the network is busy, event the transaction can stuck as pending.
- **MARKET**: Use the current market value calculated. This is the normal way to use the deployment process, but also if the network is busy and will take time to be mined.
- **AGGRESSIVE**: Use +10% current market value calculated. This a great way to faster deployment if the network is busy and price are inestable. Take in mind that this is more expensive.

For example, to use the average price in market for deployment you should define in the `deployment-config.json:

```
{
  "estimationLevel": "MARKET"
}
```

If nothing is specified or it is out of the range, will use the Market estimation.

### Deployment

To deploy to a network, make sure that the account is added as mentioned early. Check if network desired to deploy is added to the `hardhat.config.ts`. The [hardhat documentation](https://hardhat.org/config/#configuration) show how the networks can be added.

Next, run the following command inside `nix-shell`. Notice that is not necessary use the `--network` hardhat flag, but is required pass the `<NETWORK>` directly:

```shell
deploy-rain <NETWORK>
```

Once the process if finished, an output will be displayed in the console showing the folder where the deployment info was save:

```shell
Save it to "deployments/<CONTRACT-COMMITS>/<NETWORK-DEPLOYED>"
```

This process take advantage of `hardhat-deploy` to save all the relevant information. Also, the proccess save the deployments by commits. Take the current commit in the `package.json` and use it to save the information.

## Contract verification - Etherscan

Here it is necessary to mention that this process supports any etherscan-like block explorer, such as polygonscan. Just as it was necessary to add private enviroments to deploy, the process to verification also need them. This process require the `API_KEY` from the account created on etherscan and also their API URL. The API URL's availables for etherscan are found in their documentation [here](https://docs.etherscan.io/getting-started/endpoint-urls), but each block explorer will have different ones (for polygon can be found [here](https://docs.polygonscan.com/getting-started/endpoint-urls)).

Whichever blocks explorer is used, the `API_URL` and `API_KEY` must be added to HardhatConfig as the following example:

```typescript
  solidity: {...},
  networks: {...},
  ...
  verificationApi: {
    mainnet: {
      apiUrl: "https://api.etherscan.io/api",
      apiKey: process.env.ETHERSCAN_API_KEY,
    },
    polygon: {
      apiUrl: "https://api.polygonscan.com/api",
      apiKey: process.env.POLYGON_MUMBAI_API_KEY,
    },
  },
  ...
```

### Verification

Run the following command inside `nix-shell`. Notice that is not necessary use the `--network` hardhat flag, but is required pass the `<NETWORK>` directly:

```shell
verify-contracts <NETWORK>
```

This proccess will use the CURRENT commit and the `<NETWORK>` to search into deployments folder for the matches, Later will be sending POST requests to the API and handle and show the results. Eg: if the current commit deployed is `3530dd6bde8554c341ef0de2ea649d763485db13` and the network is `mumbai`, the process will be using, searching and verifying the contract addresses into `deployments/3530dd6bde8554c341ef0de2ea649d763485db13/mumbai` using the `addresses.json` file as reference.

