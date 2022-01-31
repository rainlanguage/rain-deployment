import { ethers } from "hardhat";
import { getSigner, deploy, getEventArgs } from "./utils";
import type { VerifyFactory } from "@beehiveinnovation/rain-protocol/typechain/VerifyFactory";

import VerifyFactoryJson from "@beehiveinnovation/rain-protocol/artifacts/contracts/verify/VerifyFactory.sol/VerifyFactory.json";
import VerifyTierFactoryJson from "@beehiveinnovation/rain-protocol/artifacts/contracts/tier/VerifyTierFactory.sol/VerifyTierFactory.json";

const adminAddress: any = process.env.AdminAddress;

async function main() {
  const signers = await getSigner();
  const signer = signers[0];
  // TODO: Get actual commit and network and run tx
  // Deploying VerifyFactory
  const VerifyFactoryAddress = await deploy(VerifyFactoryJson, signer, []);
  console.log("- Verify factory deployed to: ", VerifyFactoryAddress);

  const Vfactory = new ethers.Contract(
    VerifyFactoryAddress,
    VerifyFactoryJson.abi,
    signer
  ) as VerifyFactory;
  const tx = await Vfactory.createChildTyped(adminAddress);
  const VerifyAddress = (await getEventArgs(tx, "NewChild", Vfactory)).child;
  console.log("- Verify child deployed to: ", VerifyAddress);

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
