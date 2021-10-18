import { ethers } from "hardhat";
const hre = require("hardhat");
import {deploy,  linkBytecode, factoriesDeploy} from "./utils";

import Verify from "@beehiveinnovation/rain-protocol/artifacts/Verify.json"
import VerifyTier from "@beehiveinnovation/rain-protocol/artifacts/VerifyTier.json"
   
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