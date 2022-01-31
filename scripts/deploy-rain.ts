import {
  getSigner,
  deploy,
  linkBytecode,
  exportArgs,
  getDeployID,
} from "./utils";

// Balancer
import BFactory from "@beehiveinnovation/balancer-core/artifacts/BFactory.json";
// CRP
import CRPFactory from "@beehiveinnovation/configurable-rights-pool/artifacts/CRPFactory.json";
import RightsManager from "@beehiveinnovation/configurable-rights-pool/artifacts/RightsManager.json";
import SmartPoolManager from "@beehiveinnovation/configurable-rights-pool/artifacts/SmartPoolManager.json";
import BalancerSafeMath from "@beehiveinnovation/configurable-rights-pool/artifacts/BalancerSafeMath.json";

// Rain protocol
import RedeemableERC20Factory from "@beehiveinnovation/rain-protocol/artifacts/contracts/redeemableERC20/RedeemableERC20Factory.sol/RedeemableERC20Factory.json";
import SeedERC20Factory from "@beehiveinnovation/rain-protocol/artifacts/contracts/seed/SeedERC20Factory.sol/SeedERC20Factory.json";
import TrustFactory from "@beehiveinnovation/rain-protocol/artifacts/contracts/trust/TrustFactory.sol/TrustFactory.json";
import VerifyFactoryJson from "@beehiveinnovation/rain-protocol/artifacts/contracts/verify/VerifyFactory.sol/VerifyFactory.json";
import VerifyTierFactoryJson from "@beehiveinnovation/rain-protocol/artifacts/contracts/tier/VerifyTierFactory.sol/VerifyTierFactory.json";

async function main() {
  const deployId = await getDeployID();
  const signers = await getSigner();
  const signer = signers[0];
  const creatorFundsReleaseTimeout = 100;
  const maxRaiseDuration = 100;

  // Deploying Balancer
  const BFactoryAddress = await deploy(BFactory, signer, []);
  console.log("- BFactory deployed to: ", BFactoryAddress);

  // Deploying CRP
  const SmartPoolManagerAddress = await deploy(SmartPoolManager, signer, []);
  console.log("- SmartPoolManager deployed to: ", SmartPoolManagerAddress);

  const BalancerSafeMathAddress = await deploy(BalancerSafeMath, signer, []);
  console.log("- BalancerSafeMath deployed to: ", BalancerSafeMathAddress);

  const RightsManagerAddress = await deploy(RightsManager, signer, []);
  console.log("- RightsManager deployed to: ", RightsManagerAddress);

  const libraries = {
    SmartPoolManager: SmartPoolManagerAddress,
    BalancerSafeMath: BalancerSafeMathAddress,
    RightsManager: RightsManagerAddress,
  };
  const _CRPFactory = CRPFactory;
  _CRPFactory.bytecode = linkBytecode(_CRPFactory.bytecode, libraries);
  const CRPFactoryAddress = await deploy(_CRPFactory, signer, []);
  console.log("- CRPFactory deployed to: ", CRPFactoryAddress);

  // Deploying Rain Protocol
  const RedeemableERC20FactoryAddress = await deploy(
    RedeemableERC20Factory,
    signer,
    []
  );
  console.log(
    "- RedeemableERC20Factory deployed to: ",
    RedeemableERC20FactoryAddress
  );

  const SeedERC20FactoryAddress = await deploy(SeedERC20Factory, signer, []);
  console.log("- SeedERC20Factory deployed to: ", SeedERC20FactoryAddress);

  const TrustFactoryArgs = [
    RedeemableERC20FactoryAddress,
    SeedERC20FactoryAddress,
    CRPFactoryAddress,
    BFactoryAddress,
    creatorFundsReleaseTimeout,
    maxRaiseDuration
  ];
  const TrustFactoryAddress = await deploy(TrustFactory, signer, [
    TrustFactoryArgs,
  ]);
  console.log("- Trust factory deployed to: ", TrustFactoryAddress);
  exportArgs(TrustFactory, TrustFactoryArgs, deployId);

  // Deploying VerifyFactory
  const VerifyFactoryAddress = await deploy(VerifyFactoryJson, signer, []);
  console.log("- Verify factory deployed to: ", VerifyFactoryAddress);

  // Deploying VerifyTierFactory
  const VerifyTierAddress = await deploy(VerifyTierFactoryJson, signer, []);
  console.log("- VerifyTierFactory deployed to: ", VerifyTierAddress);
}

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
