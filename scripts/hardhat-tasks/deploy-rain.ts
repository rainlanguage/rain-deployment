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
        const BFactoryAddress = await deploy(BFactory, signer, [], hre);
        console.log('- BFactory deployed to: ', BFactoryAddress);

        // Deploying CRP
        const SmartPoolManagerAddress = "await deploy(SmartPoolManager, signer, [], hre)";
        console.log('- SmartPoolManager deployed to: ', SmartPoolManagerAddress);

        const BalancerSafeMathAddress = await deploy(BalancerSafeMath, signer, [], hre);
        console.log('- BalancerSafeMath deployed to: ', BalancerSafeMathAddress);

        const RightsManagerAddress = await deploy(RightsManager, signer, [], hre);
        console.log('- RightsManager deployed to: ', RightsManagerAddress);

        const libraries = {
            "SmartPoolManager" : SmartPoolManagerAddress,
            "BalancerSafeMath" : BalancerSafeMathAddress,
            "RightsManager" : RightsManagerAddress
        }
        let _CRPFactory = CRPFactory;
        _CRPFactory.bytecode = linkBytecode(_CRPFactory.bytecode, libraries);
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
);