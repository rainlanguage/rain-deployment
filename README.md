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

This will install all the dependencies and files needed. We encourage to work and run scripts under nix-shell, and you can easy run nix command
from outside the shell with `nix-shell --run <YOUR-COMMAND>`

## Contract deployment

### Enviroment information

Before start to deploy and run scrips, fill your own enviroment file - the repository provide a template which we STRICLY recommend use (.env.example). You can easy change if you want to use a private key or your mnemonic in `hardhat.config.ts` for each network.

### Deployment configuration

The deployment process support EIP-1559 transactions and legacies (No EIP-1559).

- The EIP-1559 transactions are those transactions that use `maxPriorityFeePerGas` and `maxFeePerGas` when send the TX.
- The NON-EIP-1559 transactions are those transactions that just use the `gasPrice` when send the TX.

In the `deployment-config.json` file, you can specify the estimation of the gas cost that will be use in the deployment. This is calculate with the last 10 blocks in the chain, where you can define:

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

To deploy to a network, make sure that you provide the account info on your enviroment file as correspond. Also check if your network is already added to the `hardhat.config.ts`. If you dont know how to add a new network, please check the [hardhat documentation](https://hardhat.org/config/#configuration).

Next, just run the following command inside `nix-shell`. Notice that you do not need to use the `--network` hardhat flag:

```shell
deploy-rain <NETWORK>
```
Once the process if finished, you will see an output in your console showing the folder where the deployment info was save:
```shell
Save it to "deployments/<CONTRACT-COMMITS>/<NETWORK-DEPLOYED>"
```

This process take advantage of `hardhat-deploy` to save all the relevant information. Also, the proccess save the deployments by commits. Take the current commit in the `package.json` and use it to save the information.

