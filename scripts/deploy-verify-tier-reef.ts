import { ethers } from "hardhat";
const hre = require("hardhat");
import {deploy} from "./utils";

// const Verify = require("@beehiveinnovation/rain-protocol/dist/e07af1be5703ebddd8faf546df1e98f23164c253/artifacts/Verify.json")
// const VerifyTier = require("@beehiveinnovation/rain-protocol/dist/e07af1be5703ebddd8faf546df1e98f23164c253/artifacts/VerifyTier.json")
const Verify = require("../dist/artifacts/contracts/verify/Verify.sol/Verify.json")
const VerifyTier = require("../dist/artifacts/contracts/tier/VerifyTier.sol/VerifyTier.json")
const VerifyFactoryJson = require("../dist/artifacts/contracts/verify/VerifyFactory.sol/VerifyFactory.json");

// import type { VerifyFactory } from "../dist/typechain/VerifyFactory";
import type { VerifyFactory } from "../typechain/VerifyFactory";
   
async function main() {
    const signers = await hre.reef.getSigners();
    const signer = signers[0];
    const admin_address = await signer.getAddress();

    const admin = "0xa96Bf6d23694F9A11490F1Bb7e51cA08ca9157a2"; // addr: 5Hg4whs2ntWvnbsbzDVBGh5WRLDbgjngnqakeiz31g2LFSDP 

    // Deploying VerifyFactory
    // const VerifyFactoryAddress = await deploy(VerifyFactoryJson, signer, []);
    const VerifyFactoryAddress = "0x58001242EFdCe6b667af5889deE44eb65BaE825A";
    console.log('- Verify factory deployed to: ', VerifyFactoryAddress);

    const Vfactory = (
        await hre.reef.getContractAt(VerifyFactoryJson.abi, VerifyFactoryAddress, signer)
    ) as VerifyFactory;
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
    // const VerifyAddress = await deploy(Verify, signer, [admin_address]); // admin will be the deployer address
    // console.log('- Verify deployed to: ', VerifyAddress);

    // Deploying VerifyTier
    const VerifyTierAddress = await deploy(VerifyTier, signer, VerifyAddress);
    console.log('- VerifyTier deployed to: ', VerifyTierAddress);
}
main();