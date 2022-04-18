import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

import {
  estimateGasDeploy,
  linkBytecode,
  deployContract as deploy,
  save,
} from "../utils/utils";

// Balancer
import bFactoryArtifact from "@beehiveinnovation/balancer-core/artifacts/BFactory.json";
// CRP
import smartPoolManagerArtifact from "@beehiveinnovation/configurable-rights-pool/artifacts/SmartPoolManager.json";
import balancerSafeMathArtifact from "@beehiveinnovation/configurable-rights-pool/artifacts/BalancerSafeMath.json";
import rightsManagerArtifact from "@beehiveinnovation/configurable-rights-pool/artifacts/RightsManager.json";
import crpFactoryArtifact from "@beehiveinnovation/configurable-rights-pool/artifacts/CRPFactory.json";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // TODO: Get contract already deployed in same commit that package.json
  // TODO: Add type check to deployment. Wrap the function deploy and check the type to each deploy funcion (?)
  const { getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();

  await deploy("BFactory", {
    contract: bFactoryArtifact,
    from: deployer,
    gasLimit: await estimateGasDeploy(bFactoryArtifact),
    args: [],
  });

  const SmartPoolManager = await deploy("SmartPoolManager", {
    contract: smartPoolManagerArtifact,
    from: deployer,
    gasLimit: await estimateGasDeploy(smartPoolManagerArtifact),
    args: [],
  });

  const BalancerSafeMath = await deploy("BalancerSafeMath", {
    contract: balancerSafeMathArtifact,
    from: deployer,
    gasLimit: await estimateGasDeploy(balancerSafeMathArtifact),
    args: [],
  });

  const RightsManager = await deploy("RightsManager", {
    contract: rightsManagerArtifact,
    from: deployer,
    gasLimit: await estimateGasDeploy(rightsManagerArtifact),
    args: [],
  });

  const CRPFactoryLinked = linkBytecode(crpFactoryArtifact, {
    SmartPoolManager: SmartPoolManager.address,
    BalancerSafeMath: BalancerSafeMath.address,
    RightsManager: RightsManager.address,
  });

  await deploy("CRPFactory", {
    contract: CRPFactoryLinked,
    from: deployer,
    gasLimit: await estimateGasDeploy(CRPFactoryLinked),
    args: [],
  });

  // Rain protocol
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

  await deploy("CombineTierFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("CombineTierFactory"),
    args: [],
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
    gasLimit: await estimateGasDeploy("EmissionsERC20Factory"),
    args: [],
  });

  // Save all
  await save();
};
export default func;
