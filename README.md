**Tools used in this repo**

- Yarn: `v1.22.10`
- Solt: `0.5.2`

Before start to deploy and run scrips, fill your own enviroment file - the repository provide a template which we STRICLY recommend use. To start, run the nix-shell which will check if you have all the dependencies installed: 
```shell
nix-shell
```
# Get contracts from commit
The repository use a sub-module that contain all the contracts and they update. To manage and deploy a specific commit of rain-protocol, you should provide the commit using the following script inside nix-shell"
```shell
cut-dist <COMMIT>
```
This is the first command that should be run to generate the dist files. This will copy the exact copy from rain-protocol to the deployment project. Also will be deleted all old files related with the contracts and will install all the dependencies again. This commit is update inside you `.env` file to make easy track and check the actual commit.

# Contract deployment
The repository provide two types of scripts which deploy several contracts. 
The main script is responsible for the deployment of the main contracts or factories contracts to create Trusts.
The other script deploy the verify factory and verify tiers.

# Contract factories deployment
To deploy to a network, make sure that you provide the account info on your enviroment file as correspond. Next, just run the following script inside `nix-shell`. Notice that you do not need to use the `--network` hardhat flag:
```shell
deploy-rain <NETWORK>
```
 - If the Balancer Contracts are already deployed to the `NETWORK` and stored on the `deployment-config.json` file, those contract will NOT be deployed and will be used again. This avoid waste the time.
 - If the Rain Contract are already deployed to the `NETWORK`, stored on the `Addresses.json` file AND have the same commit stored, those contract will NOT be deployed. This avoid waste time, and redeploy existing commits, take that on count.

# Contract verify tiers deployment
To deploy to a network, make sure that you provide the account info on your enviroment file as correspond. Next, just run the following script inside `nix-shell`. Notice that you need to provide an `ADMIN_ADDRESS` first and again you do not need to use any flag, just pass the arguments:
```shell
deploy-verify <ADMIN_ADDRESS> <NETWORK>
```
 - If the Rain Contract are already deployed to the `NETWORK`, stored on the `Addresses.json` file AND have the same commit stored, those contract will NOT be deployed. This avoid waste time, and redeploy existing commits, take that on count. In this case, just will create a new `Verify` contract from a `VerifyFactory` that already exist on the `NETWORK` that have the same commit that the project.

# Create a trust
You can create a trust with a basic config. Only is necesary provide a `TRUST_FACTORY_ADDRESS` and the `NETWORK` which correspond that factory. To create the trust, run the following script inside `nix-shell`:
```shell
create-trust <TRUST_FACTORY_ADDRESS> <NETWORK>
```
NOTE: You cannot change the config of the trust from the CLI. If you want to customize the trust, you should modified the `create-trust.ts` file. Generally, this script is just for test on testnets, so rarely you want to modify the file.
