import {
  deploy,
  getAccount,
  estimateGasDeploy,
  // linkBytecode,
} from "../utils/reefUtils";
import hre from "hardhat";

import { linkBytecode } from "../utils/utils";

// Balancer
import bFactoryArtifact from "@beehiveinnovation/balancer-core/artifacts/BFactory.json";
// CRP
import smartPoolManagerArtifact from "@beehiveinnovation/configurable-rights-pool/artifacts/SmartPoolManager.json";
import balancerSafeMathArtifact from "@beehiveinnovation/configurable-rights-pool/artifacts/BalancerSafeMath.json";
import rightsManagerArtifact from "@beehiveinnovation/configurable-rights-pool/artifacts/RightsManager.json";
import crpFactoryArtifact from "@beehiveinnovation/configurable-rights-pool/artifacts/CRPFactory.json";

const main = async function () {
  // TODO: Get contract already deployed in same commit that package.json
  // TODO: Add type check to deployment. Wrap the function deploy and check the type to each funcion
  const deployer = await getAccount("deployer");
  console.log("deployer:", await deployer.getAddress());

  // Balancer contracts
  const BFactory = await deploy("BFactory", {
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

  const CRPFactory = await deploy("CRPFactory", {
    contract: CRPFactoryLinked,
    from: deployer,
    gasLimit: await estimateGasDeploy(CRPFactoryLinked),
    args: [],
  });

  // Rain protocol contracts
  const RedeemableERC20Factory = await deploy("RedeemableERC20Factory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("RedeemableERC20Factory"),
    args: [],
  });

  const SeedERC20Factory = await deploy("SeedERC20Factory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("SeedERC20Factory"),
    args: [],
  });

  const TrustFactoryArgs = {
    crpFactory: CRPFactory.address,
    balancerFactory: BFactory.address,
    redeemableERC20Factory: RedeemableERC20Factory.address,
    seedERC20Factory: SeedERC20Factory.address,
    creatorFundsReleaseTimeout: 100,
    maxRaiseDuration: 100,
  };
  const TrustFactory = await deploy("TrustFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("TrustFactory", [TrustFactoryArgs]),
    args: [TrustFactoryArgs],
  });

  const VerifyFactory = await deploy("VerifyFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("VerifyFactory"),
    args: [],
  });

  const VerifyTierFactory = await deploy("VerifyTierFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("VerifyTierFactory"),
    args: [],
  });

  const ERC20BalanceTierFactory = await deploy("ERC20BalanceTierFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("ERC20BalanceTierFactory"),
    args: [],
  });

  const ERC20TransferTierFactory = await deploy("ERC20TransferTierFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("ERC20TransferTierFactory"),
    args: [],
  });

  const CombineTierFactory = await deploy("CombineTierFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("CombineTierFactory"),
    args: [],
  });

  const ERC721BalanceTierFactory = await deploy("ERC721BalanceTierFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("ERC721BalanceTierFactory"),
    args: [],
  });

  const SaleFactoryArgs = {
    maximumSaleTimeout: 10000,
    maximumCooldownDuration: 1000,
    redeemableERC20Factory: RedeemableERC20Factory.address,
  };
  const SaleFactory = await deploy("SaleFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("SaleFactory", [SaleFactoryArgs]),
    args: [SaleFactoryArgs],
  });

  const GatedNFTFactory = await deploy("GatedNFTFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("GatedNFTFactory"),
    args: [],
  });

  const RedeemableERC20ClaimEscrow = await deploy(
    "RedeemableERC20ClaimEscrow",
    {
      from: deployer,
      gasLimit: await estimateGasDeploy("RedeemableERC20ClaimEscrow"),
      args: [],
    }
  );

  const NoticeBoard = await deploy("NoticeBoard", {
    from: deployer,
    gasLimit: await estimateGasDeploy("NoticeBoard"),
    args: [],
  });

  const EmissionsERC20Factory = await deploy("EmissionsERC20Factory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("EmissionsERC20Factory"),
    args: [],
  });
};

main()
  .then(() => {
    const exit = process.exit;
    exit(0);
  })
  .catch((error) => {
    console.error(error);
    const exit = process.exit;
    exit(1);
  });
