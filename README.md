# TODO Add doc
# Tools used in this repo
Node: `v14.17.4`
Yarn: `v1.22.10`
Solt: `0.5.2`

Before start to deployments fill your own enviroment file, the repository provide a template. Next, check that you already installed all the dependencies to run the deployments scripts with yarn: 
``` yarn install```
# Deployment of rain contracts to EVM networks
The repository provide two types of scripts. One of them is fully compatible with networks availables in https://chainlist.org/ like Ethereum, Polygon, Avalanche, Binance, etc. To deploy the rain contracts to a network with this script, you should check that is added to your hardhat config correctly and run:
```shell
yarn deploy-rain --network <NETWORK_NAME>
```
This command will start the deployment, and will show on console the address of each contract. Ex:
```shell

- BFactory deployed to:  0x5b40ecEB5E63e392d7a7e900E0fB850E43D9e003
- SmartPoolManager deployed to:  0xCE5Ded96347fde5447b97036605e83Bb0Ca4412E
- BalancerSafeMath deployed to:  0xe34C092b84838241B302bf70506EB357AAd65555
- RightsManager deployed to:  0x3d7FbCf57Af825Bccc3990094b159aBF5349e410
- CRPFactory deployed to:  0xA35B482452062FC14F5f9eeEaFE892e7C6E171a9
- RedeemableERC20Factory deployed to:  0xE42e869743aaC201ABAd9dD6D3e14Fd6878f9F89
- RedeemableERC20PoolFactory deployed to:  0xC2363B6a0460C7dD0e1540778FcB65F35Ebda108
- SeedERC20Factory deployed to:  0x0c76ae02BCBb6e542c7Af60d53e0620BbdA13512
- Trust factory deployed to:  0x96f999f904f88EF394250B67A60F920F9CbC44b3
```
# Deployment of rain contracts to Reef Chain
The other script type that the repo provide is a specific script to deploy in the Reef mainnet and Reef testnet. To deploy in these networks the reposity have the default properties that Reef provide, you only should provide your deployment account. You can run the script with:
```shell
yarn deploy-rain-reef --network <NETWORK_NAME>
```
The deployment will start and show in the console the address of each contract as in the example above.
# Contract verification in Etherscan
This way will work in [Etherscan](https://etherscan.io/) and with others "Etherscan compatibles" like [Polygonscan](https://polygonscan.com/) (Polygon) or [Snowtrace](https://snowtrace.io/) (Avalanche)
