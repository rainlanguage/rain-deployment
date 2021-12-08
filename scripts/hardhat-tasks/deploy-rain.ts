import { HardhatUserConfig, task } from "hardhat/config";
import { ethers } from "hardhat";
import {
    getSigner,
    deploy, 
    linkBytecode, 
    exportArgs,
    getDeployID
} from "./utils";

// Balancer
const BFactory = require(`@beehiveinnovation/balancer-core/artifacts/BFactory.json`);
// CRP
const CRPFactory = require(`@beehiveinnovation/configurable-rights-pool/artifacts/CRPFactory.json`); 
const RightsManager = require(`@beehiveinnovation/configurable-rights-pool/artifacts/RightsManager.json`);
const SmartPoolManager = require(`@beehiveinnovation/configurable-rights-pool/artifacts/SmartPoolManager.json`);
const BalancerSafeMath = require(`@beehiveinnovation/configurable-rights-pool/artifacts/BalancerSafeMath.json`);

// Rain protocol
const RedeemableERC20Factory = require("../../dist/artifacts/contracts/redeemableERC20/RedeemableERC20Factory.sol/RedeemableERC20Factory.json")
const RedeemableERC20PoolFactory = require("../../dist/artifacts/contracts/pool/RedeemableERC20PoolFactory.sol/RedeemableERC20PoolFactory.json")
const SeedERC20Factory = require("../../dist/artifacts/contracts/seed/SeedERC20Factory.sol/SeedERC20Factory.json")
const TrustFactory = require("../../dist/artifacts/contracts/trust/TrustFactory.sol/TrustFactory.json")

task(
    "deploy-rain", 
    "Deploy the rain contracts. Need to set a --network to work", 
    async function (taskArguments:any, hre, runSuper) {
        const deployId = await getDeployID(hre);
        const signers = await getSigner(hre);
        const signer = signers[0];

        // Deploying Balancer
        // const BFactoryAddress = "0xFf71fa175a83cc1754636e5626c52a9a2915e367"; //Mumbai
        // const BFactoryAddress = "0xe123e3Dc098D6E191C9B666253C90B71d85a2053"; //Reef
        const BFactoryAddress = await deploy(BFactory, signer, [], hre);
        console.log('- BFactory deployed to: ', BFactoryAddress);

        // Deploying CRP
        // const SmartPoolManagerAddress = "0xEa2D6d45e9Ed686cb5ab5819360E790091B44166"; //Mumbai
        // const SmartPoolManagerAddress = "0x5152A73E15E7ec18b242e940f98EeC569Dc7f977"; //Reef
        const SmartPoolManagerAddress = await deploy(SmartPoolManager, signer, [], hre);
        console.log('- SmartPoolManager deployed to: ', SmartPoolManagerAddress);

        // const BalancerSafeMathAddress = "0xdAEe2f0A34AbfB71ebe857915AD29911EE4eE7A1"; //Mumbai
        // const BalancerSafeMathAddress = "0xF9F3ef5562b3346def5dd71f3189095a1A124c1E"; //Reef
        const BalancerSafeMathAddress = await deploy(BalancerSafeMath, signer, [], hre);
        console.log('- BalancerSafeMath deployed to: ', BalancerSafeMathAddress);

        // const RightsManagerAddress = "0x332393AD329ee750C2EAa60F23287CCF65C12c93"; //Mumbai
        // const RightsManagerAddress = "0x8F1F54B321e1C67Af29867d0080F45a6617D4d7A"; //Reef
        const RightsManagerAddress = await deploy(RightsManager, signer, [], hre);
        console.log('- RightsManager deployed to: ', RightsManagerAddress);

        const libraries = {
            "SmartPoolManager" : SmartPoolManagerAddress,
            "BalancerSafeMath" : BalancerSafeMathAddress,
            "RightsManager" : RightsManagerAddress
        }
        let _CRPFactory = CRPFactory;
        _CRPFactory.bytecode = linkBytecode(_CRPFactory.bytecode, libraries);
        // const CRPFactoryAddress = "0x052406398009CCF24e6D7EC5933743e63F6CBA15"; //Mumbai
        // const CRPFactoryAddress = "0x4b591Edd0cB14c4f806442384a167f7D87e3152a"; //Reef
        const CRPFactoryAddress = await deploy(_CRPFactory, signer, [], hre);
        console.log('- CRPFactory deployed to: ', CRPFactoryAddress);

        // // Deploying Rain Protocol
        const RedeemableERC20FactoryAddress = await deploy(RedeemableERC20Factory, signer, [], hre);
        console.log('- RedeemableERC20Factory deployed to: ', RedeemableERC20FactoryAddress);

        const ReedERC20PoolFactArgs = [
            CRPFactoryAddress, 
            BFactoryAddress
        ];
        const RedeemableERC20PoolFactoryAddress = (
            await deploy(RedeemableERC20PoolFactory, signer, [ReedERC20PoolFactArgs], hre)
        );
        console.log('- RedeemableERC20PoolFactory deployed to: ', RedeemableERC20PoolFactoryAddress);
        exportArgs(RedeemableERC20PoolFactory, ReedERC20PoolFactArgs, deployId);

        const SeedERC20FactoryAddress = await deploy(SeedERC20Factory, signer, [], hre);
        console.log('- SeedERC20Factory deployed to: ', SeedERC20FactoryAddress);

        const TrustFactoryArgs = [
            RedeemableERC20FactoryAddress,
            RedeemableERC20PoolFactoryAddress,
            SeedERC20FactoryAddress
        ];
        const TrustFactoryAddress = await deploy(TrustFactory, signer, [TrustFactoryArgs], hre);
        console.log('- Trust factory deployed to: ', TrustFactoryAddress);
        exportArgs(TrustFactory, TrustFactoryArgs, deployId);
    }
).addOptionalParam("balancerFactory", "Provide an existing Balancer Factory address on the chain")
.addOptionalParam("smartpoolManager", "Provide an existing Smartpool Manager address on the chain")
.addOptionalParam("balancerSafemath", "Provide an existing Balancer Safemath address on the chain")
.addOptionalParam("rightsManager", "Provide an existing Rights Manager address on the chain")
.addOptionalParam("crpFactory", "Provide an existing CRP Factory address on the chain");