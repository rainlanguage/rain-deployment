// import { getSigner, deploy, linkBytecode, exportArgs } from "./utils";

import hre, { ethers } from "hardhat";
import * as path from "path";
import fs from "fs";

const commit: string = process.env.COMMIT;
let newEntity: string;

// Balancer
import BFactory from "@beehiveinnovation/balancer-core/artifacts/BFactory.json";
// CRP
import CRPFactory from "@beehiveinnovation/configurable-rights-pool/artifacts/CRPFactory.json";
import RightsManager from "@beehiveinnovation/configurable-rights-pool/artifacts/RightsManager.json";
import SmartPoolManager from "@beehiveinnovation/configurable-rights-pool/artifacts/SmartPoolManager.json";
import BalancerSafeMath from "@beehiveinnovation/configurable-rights-pool/artifacts/BalancerSafeMath.json";

// Rain protocol
import RedeemableERC20Factory from "../artifacts/contracts/redeemableERC20/RedeemableERC20Factory.sol/RedeemableERC20Factory.json";
import SeedERC20Factory from "../artifacts/contracts/seed/SeedERC20Factory.sol/SeedERC20Factory.json";
import TrustFactory from "../artifacts/contracts/trust/TrustFactory.sol/TrustFactory.json";
import redeemableERC20ClaimEscrowJson from "../artifacts/contracts/escrow/RedeemableERC20ClaimEscrow.sol/RedeemableERC20ClaimEscrow.json";

//
import verifyFactoryJson from "../artifacts/contracts/verify/VerifyFactory.sol/VerifyFactory.json";
import verifyTierFactoryJson from "../artifacts/contracts/tier/VerifyTierFactory.sol/VerifyTierFactory.json";
import erc20BalanceTierFactoryJson from "../artifacts/contracts/tier/ERC20BalanceTierFactory.sol/ERC20BalanceTierFactory.json";
import erc20TransferTierFactoryJson from "../artifacts/contracts/tier/ERC20TransferTierFactory.sol/ERC20TransferTierFactory.json";
import combineTierFactoryJson from "../artifacts/contracts/tier/CombineTierFactory.sol/CombineTierFactory.json";
import saleFactoryJson from "../artifacts/contracts/sale/SaleFactory.sol/SaleFactory.json";
import noticeBoardJson from "../artifacts/contracts/noticeboard/NoticeBoard.sol/NoticeBoard.json";
import emissionsERC20FactoryJson from "../artifacts/contracts/claim/EmissionsERC20Factory.sol/EmissionsERC20Factory.json";
// Should be changed later
import erc721BalanceTierFactoryJson from "../artifacts/contracts/tier/ERC721BalanceTierFactory.sol/ERC721BalanceTierFactory.json";

// import gatedNFTFactory
import gatedNFTFactoryJson from "../artifacts/contracts/rain-statusfi/GatedNFTFactory.sol/GatedNFTFactory.json";

const fetchFile = (_path: string) => {
  try {
    return JSON.parse(fs.readFileSync(_path).toString());
  } catch (error) {
    console.log(error);
    return {};
  }
};

const writeFile = (_path: string, file: any) => {
  try {
    fs.writeFileSync(_path, file);
  } catch (error) {
    console.log(error);
  }
};

const getDeployID = async () => {
  const networkName = hre.network.name ? hre.network.name : "networkName";
  const addressesPath = path.join(__dirname, "Addresses.json");
  const content = fs.existsSync(addressesPath) ? fetchFile(addressesPath) : {};
  if (Object.prototype.hasOwnProperty.call(content, commit)) {
    let name = networkName;
    let num = 2;
    while (Object.prototype.hasOwnProperty.call(content[commit], name)) {
      name = `${networkName}-${num}`;
      num += 1;
    }
    newEntity = name;
  } else {
    newEntity = networkName;
  }
  const date = new Date(Date.now())
    .toLocaleString("en-GB", { timeStyle: "medium", dateStyle: "medium" })
    .replace(", ", "-")
    .replace(/ /g, "")
    .replace(/:/g, "");
  return `${networkName}-${date}`;
};

async function main() {
  const signers = await hre.reef.getSigners();
  console.log(await signers[0].getAddress());
  const deployId = await getDeployID();
  console.log(deployId);
  // const signers = await ethers.getSigners();
  // const signers = await hre.reef.getSigners();
  // console.log(await signers[0].getAddress());
  // const signers2 = await getSigner();
  // console.log(await signers2[0].getAddress());
  // const signer = signers[0];
  // const creatorFundsReleaseTimeout = 100;
  // const maxRaiseDuration = 100;

  // // Deploying Balancer
  // const BFactoryAddress = await deploy(BFactory, signer, []);
  // console.log("- BFactory deployed to: ", BFactoryAddress);

  // // Deploying CRP
  // const SmartPoolManagerAddress = await deploy(SmartPoolManager, signer, []);
  // console.log("- SmartPoolManager deployed to: ", SmartPoolManagerAddress);

  // const BalancerSafeMathAddress = await deploy(BalancerSafeMath, signer, []);
  // console.log("- BalancerSafeMath deployed to: ", BalancerSafeMathAddress);

  // const RightsManagerAddress = await deploy(RightsManager, signer, []);
  // console.log("- RightsManager deployed to: ", RightsManagerAddress);

  // const libraries = {
  //   SmartPoolManager: SmartPoolManagerAddress,
  //   BalancerSafeMath: BalancerSafeMathAddress,
  //   RightsManager: RightsManagerAddress,
  // };
  // const _CRPFactory = CRPFactory;
  // _CRPFactory.bytecode = linkBytecode(_CRPFactory.bytecode, libraries);
  // const CRPFactoryAddress = await deploy(_CRPFactory, signer, []);
  // console.log("- CRPFactory deployed to: ", CRPFactoryAddress);

  // // Deploying Rain Protocol
  // const RedeemableERC20FactoryAddress = await deploy(
  //   RedeemableERC20Factory,
  //   signer,
  //   []
  // );
  // console.log(
  //   "- RedeemableERC20Factory deployed to: ",
  //   RedeemableERC20FactoryAddress
  // );

  // const SeedERC20FactoryAddress = await deploy(SeedERC20Factory, signer, []);
  // console.log("- SeedERC20Factory deployed to: ", SeedERC20FactoryAddress);

  // const TrustFactoryArgs = [
  //   RedeemableERC20FactoryAddress,
  //   SeedERC20FactoryAddress,
  //   CRPFactoryAddress,
  //   BFactoryAddress,
  //   creatorFundsReleaseTimeout,
  //   maxRaiseDuration,
  // ];
  // const TrustFactoryAddress = await deploy(TrustFactory, signer, [
  //   TrustFactoryArgs,
  // ]);
  // console.log("- Trust factory deployed to: ", TrustFactoryAddress);
  // exportArgs(TrustFactory, TrustFactoryArgs, deployId);

  // // Deploying VerifyFactory
  // const VerifyFactoryAddress = await deploy(verifyFactoryJson, signer, []);
  // console.log("- Verify factory deployed to: ", VerifyFactoryAddress);

  // // Deploying Tiers Factores
  // const VerifyTierAddress = await deploy(verifyTierFactoryJson, signer, []);
  // console.log("- VerifyTierFactory deployed to: ", VerifyTierAddress);

  // const ERC20BalanceTierFactoryAddress = await deploy(
  //   erc20BalanceTierFactoryJson,
  //   signer,
  //   []
  // );
  // console.log(
  //   "- ERC20BalanceTierFactory deployed to: ",
  //   ERC20BalanceTierFactoryAddress
  // );

  // const ERC20TransferTierFactoryAddress = await deploy(
  //   erc20TransferTierFactoryJson,
  //   signer,
  //   []
  // );
  // console.log(
  //   "- ERC20TransferTierFactory deployed to: ",
  //   ERC20TransferTierFactoryAddress
  // );

  // const CombineTierFactoryAddress = await deploy(
  //   combineTierFactoryJson,
  //   signer,
  //   []
  // );
  // console.log("- CombineTierFactory deployed to: ", CombineTierFactoryAddress);

  // const ERC721BalanceTierFactoryAddress = await deploy(
  //   erc721BalanceTierFactoryJson,
  //   signer,
  //   []
  // );
  // console.log(
  //   "- ERC721BalanceTierFactory deployed to: ",
  //   ERC721BalanceTierFactoryAddress
  // );

  // // Deploying Sale Factory
  // const saleConstructorConfig = {
  //   maximumCooldownDuration: 1000,
  //   redeemableERC20Factory: RedeemableERC20FactoryAddress,
  // };
  // const SaleFactoryAddress = await deploy(saleFactoryJson, signer, [
  //   saleConstructorConfig,
  // ]);
  // console.log("- SaleFactory deployed to: ", SaleFactoryAddress);
  // exportArgs(saleFactoryJson, Object.values(saleConstructorConfig), deployId);

  // // Deploying GatedNFTFactory
  // const GatedNFTFactoryAddress = await deploy(gatedNFTFactoryJson, signer, []);
  // console.log("- GatedNFT factory deployed to: ", GatedNFTFactoryAddress);

  // // Deploying RedeemableERC20ClaimEscrow
  // const redeemableERC20ClaimEscrowAddress = await deploy(
  //   redeemableERC20ClaimEscrowJson,
  //   signer,
  //   []
  // );
  // console.log(
  //   "- RedeemableERC20ClaimEscrow deployed to: ",
  //   redeemableERC20ClaimEscrowAddress
  // );

  // // Notice Board
  // const noticeBoardAddress = await deploy(noticeBoardJson, signer, []);
  // console.log("- NoticeBoard deployed to: ", noticeBoardAddress);

  // console.log(await signer.getTransactionCount());

  // // EmissionsERC20Factory
  // const emissionsERC20FactoryAddress = await deploy(
  //   emissionsERC20FactoryJson,
  //   signer,
  //   []
  // );
  // console.log(
  //   "- EmissionsERC20Factory deployed to: ",
  //   emissionsERC20FactoryAddress
  // );
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
