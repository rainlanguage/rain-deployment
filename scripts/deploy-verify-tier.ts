import { ethers } from "hardhat";
import {deploy} from "./utils";

// const Verify = require("@beehiveinnovation/rain-protocol/dist/e07af1be5703ebddd8faf546df1e98f23164c253/artifacts/Verify.json")
// const VerifyTier = require("@beehiveinnovation/rain-protocol/dist/e07af1be5703ebddd8faf546df1e98f23164c253/artifacts/VerifyTier.json")
const Verify = require("../dist/artifacts/contracts/verify/Verify.sol/Verify.json")
const VerifyTier = require("../dist/artifacts/contracts/tier/VerifyTier.sol/VerifyTier.json")
const VerifyFactoryJson = require("../dist/artifacts/contracts/verify/VerifyFactory.sol/VerifyFactory.json")


// import type { VerifyFactory } from "../dist/typechain/VerifyFactory";
import type { VerifyFactory } from "../typechain/VerifyFactory";

   
async function main() {
    const signers = await ethers.getSigners();
    const signer = signers[0];

    // Deploying VerifyFactory
    const VerifyFactoryAddress = await deploy(VerifyFactoryJson, signer, []);
    console.log('- Verify factory deployed to: ', VerifyFactoryAddress);

    const admin = "0x085a958427aaA3Ac8Be6174F630a96641538E280";
    const Vfactory = (new ethers.Contract(VerifyFactoryAddress , VerifyFactoryJson.abi , signers[0] )) as VerifyFactory;
    const tx = await Vfactory["createChild(address)"](admin);
    const receipt = await tx.wait();
    const topic = receipt.events?.filter((x) => x.event == "NewContract")[0].topics[1]!
    const VerifyAddress = ethers.utils.getAddress(
        ethers.utils.hexZeroPad(
            ethers.utils.hexStripZeros(topic), 20
        )
    );
    console.log("- Verify child deployed to: ", VerifyAddress);

    // // Deploying Verify
    // console.log(signer.address)
    // const VerifyAddress = await deploy(Verify, signer, [signer.address]); // admin will be the deployer address
    // console.log('- Verify deployed to: ', VerifyAddress);

    // Deploying VerifyTier
    const VerifyTierAddress = await deploy(VerifyTier, signer, [VerifyAddress]);
    console.log('- VerifyTier deployed to: ', VerifyTierAddress);

}
main();
