import { ethers } from "hardhat";
const hre = require("hardhat");
import {deploy} from "./utils";

// const Verify = require("@beehiveinnovation/rain-protocol/artifacts/Verify.json")
// const VerifyTier = require("@beehiveinnovation/rain-protocol/artifacts/VerifyTier.json")
const Verify = require("./dist/artifacts/contracts/rain-protocol/contracts/verify/Verify.sol/Verify.json")
const VerifyTier = require("./dist/artifacts/contracts/rain-protocol/contracts/tier/VerifyTier.sol/VerifyTier.json")
   
async function main() {
    const signers = await ethers.getSigners();
    const signer = signers[0];
    
    // Deploying Verify
    const VerifyAddress = await deploy(Verify, signer, [signer.address]); // admin will be the deployer address
    console.log('- Verify deployed to: ', VerifyAddress);

    // Deploying VerifyTier
    const VerifyTierAddress = await deploy(VerifyTier, signer, [VerifyAddress]);
    console.log('- VerifyTier deployed to: ', VerifyTierAddress);

}
main();