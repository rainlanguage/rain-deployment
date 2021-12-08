import { HardhatUserConfig, task } from "hardhat/config";
import { getSigner, deploy } from "./utils";

const Verify = require("../../dist/artifacts/contracts/verify/Verify.sol/Verify.json")
const VerifyTier = require("../../dist/artifacts/contracts/tier/VerifyTier.sol/VerifyTier.json")
const VerifyFactoryJson = require("../../dist/artifacts/contracts/verify/VerifyFactory.sol/VerifyFactory.json")

import type { VerifyFactory } from "../../dist/typechain/VerifyFactory";

task(
    "deploy-verify-tier", 
    "Deploy the verify tier contracts with an `admin address`. Need to set a --network to work", 
    async function (taskArguments:any, hre, runSuper) {
        const signers = await getSigner(hre);
        const signer = signers[0];

        // Deploying VerifyFactory
        const VerifyFactoryAddress = await deploy(VerifyFactoryJson, signer, [], hre);
        console.log('- Verify factory deployed to: ', VerifyFactoryAddress);

        const Vfactory = (
            new hre.ethers.Contract(VerifyFactoryAddress , VerifyFactoryJson.abi , signers[0] )
        ) as VerifyFactory;
        console.log(taskArguments.adminAddress);
        const tx = await Vfactory["createChild(address)"](taskArguments.adminAddress);
        const receipt = await tx.wait();
        const topic = receipt.events?.filter((x) => x.event == "NewContract")[0].topics[1]!
        const VerifyAddress = hre.ethers.utils.getAddress(
            hre.ethers.utils.hexZeroPad(
                hre.ethers.utils.hexStripZeros(topic), 20
            )
        );
        console.log("- Verify child deployed to: ", VerifyAddress);

        const VerifyTierAddress = await deploy(VerifyTier, signer, [VerifyAddress], hre);
        console.log('- VerifyTier deployed to: ', VerifyTierAddress);
        
    }
).addParam("adminAddress", "The admin address to the verify child");
