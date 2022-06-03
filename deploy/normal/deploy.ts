import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

import {
  estimateGasDeploy,
  deployContract as deploy,
  createAlwayTier,
  save,
} from "../utils/utils";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // TODO: Get contract already deploysed in same commit that package.json
  // TODO: Add type check to deployment. Wrap the function deploy and check the type to each deploy funcion (?)
  const { getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();

  // Rain protocol
  // Deploying AllStandardOpsStateBuilder
  const AllStandardOpsStateBuilder = await deploy(
    "AllStandardOpsStateBuilder",
    {
      from: deployer,
      gasLimit: await estimateGasDeploy("AllStandardOpsStateBuilder"),
      args: [],
    }
  );

  const RedeemableERC20Factory = await deploy("RedeemableERC20Factory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("RedeemableERC20Factory"),
    args: [],
  });

  await deploy("VerifyFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("VerifyFactory"),
    args: [],
  });

  await deploy("VerifyTierFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("VerifyTierFactory"),
    args: [],
  });

  await deploy("ERC20BalanceTierFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("ERC20BalanceTierFactory"),
    args: [],
  });

  await deploy("ERC20TransferTierFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("ERC20TransferTierFactory"),
    args: [],
  });

  const CombineTier = await deploy("CombineTierFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("CombineTierFactory", [
      AllStandardOpsStateBuilder.address,
    ]),
    args: [AllStandardOpsStateBuilder.address],
  });

  await deploy("ERC721BalanceTierFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("ERC721BalanceTierFactory"),
    args: [],
  });

  const SaleFactoryArgs = {
    maximumSaleTimeout: 10000,
    maximumCooldownDuration: 1000,
    redeemableERC20Factory: RedeemableERC20Factory.address,
    vmStateBuilder: AllStandardOpsStateBuilder.address,
  };
  await deploy("SaleFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("SaleFactory", [SaleFactoryArgs]),
    args: [SaleFactoryArgs],
  });

  await deploy("GatedNFTFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("GatedNFTFactory"),
    args: [],
  });

  await deploy("RedeemableERC20ClaimEscrow", {
    from: deployer,
    gasLimit: await estimateGasDeploy("RedeemableERC20ClaimEscrow"),
    args: [],
  });

  await deploy("NoticeBoard", {
    from: deployer,
    gasLimit: await estimateGasDeploy("NoticeBoard"),
    args: [],
  });

  await deploy("EmissionsERC20Factory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("EmissionsERC20Factory", [
      AllStandardOpsStateBuilder.address,
    ]),
    args: [AllStandardOpsStateBuilder.address],
  });

  // Deploy AlwayTier
  await createAlwayTier(CombineTier, deployer);

  // Deploy OrderBook
  const OrderBookStateBuilder = await deploy("OrderBookStateBuilder", {
    from: deployer,
    gasLimit: await estimateGasDeploy("OrderBookStateBuilder"),
    args: [],
  });

  await deploy("OrderBook", {
    from: deployer,
    gasLimit: await estimateGasDeploy("OrderBook", [
      OrderBookStateBuilder.address,
    ]),
    args: [OrderBookStateBuilder.address],
  });

  // Deployt StakeFactory
  await deploy("StakeFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("StakeFactory"),
    args: [],
  });

  // Save all
  await save();
};
export default func;
