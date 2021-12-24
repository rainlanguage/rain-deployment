import { ethers } from "hardhat";
import { getSigner, deploy } from "./utils";
import type { VerifyFactory } from "../dist/typechain/VerifyFactory";

const VerifyTier = require("../dist/artifacts/contracts/tier/VerifyTier.sol/VerifyTier.json");
const VerifyFactoryJson = require("../dist/artifacts/contracts/verify/VerifyFactory.sol/VerifyFactory.json");

const adminAddress: any = process.env.AdminAddress;

async function main() {
  const signers = await getSigner();
  const signer = signers[0];

  // Deploying VerifyFactory
  const VerifyFactoryAddress = await deploy(VerifyFactoryJson, signer, []);
  console.log("- Verify factory deployed to: ", VerifyFactoryAddress);

  const Vfactory = new ethers.Contract(
    VerifyFactoryAddress,
    VerifyFactoryJson.abi,
    signers[0]
  ) as VerifyFactory;
  const tx = await Vfactory["createChild(address)"](adminAddress);
  const receipt = await tx.wait();
  const topic = receipt.events?.filter((x) => x.event === "NewContract")[0]
    .topics[1]!;
  const VerifyAddress = ethers.utils.getAddress(
    ethers.utils.hexZeroPad(ethers.utils.hexStripZeros(topic), 20)
  );
  console.log("- Verify child deployed to: ", VerifyAddress);

  // Deploying VerifyTier
  const VerifyTierAddress = await deploy(VerifyTier, signer, [VerifyAddress]);
  console.log("- VerifyTier deployed to: ", VerifyTierAddress);
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
