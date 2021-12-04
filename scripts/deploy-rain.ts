import { ethers } from "hardhat";
import {
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
// const RedeemableERC20Factory = require("@beehiveinnovation/rain-protocol/dist/e07af1be5703ebddd8faf546df1e98f23164c253/artifacts/contracts/redeemableERC20/RedeemableERC20Factory.sol/RedeemableERC20Factory.json")
// const RedeemableERC20PoolFactory = require("@beehiveinnovation/rain-protocol/dist/e07af1be5703ebddd8faf546df1e98f23164c253/artifacts/contracts/pool/RedeemableERC20PoolFactory.sol/RedeemableERC20PoolFactory.json")
// const SeedERC20Factory = require("@beehiveinnovation/rain-protocol/dist/e07af1be5703ebddd8faf546df1e98f23164c253/artifacts/contracts/seed/SeedERC20Factory.sol/SeedERC20Factory.json")
// const TrustFactory = require("@beehiveinnovation/rain-protocol/dist/e07af1be5703ebddd8faf546df1e98f23164c253/artifacts/contracts/trust/TrustFactory.sol/TrustFactory.json")
const RedeemableERC20Factory = require("../dist/artifacts/contracts/redeemableERC20/RedeemableERC20Factory.sol/RedeemableERC20Factory.json")
const RedeemableERC20PoolFactory = require("../dist/artifacts/contracts/pool/RedeemableERC20PoolFactory.sol/RedeemableERC20PoolFactory.json")
const SeedERC20Factory = require("../dist/artifacts/contracts/seed/SeedERC20Factory.sol/SeedERC20Factory.json")
const TrustFactory = require("../dist/artifacts/contracts/trust/TrustFactory.sol/TrustFactory.json")

async function main() {
    const signers = await ethers.getSigners();
    const signer = signers[0];
    const deployId = getDeployID();

    // Deploying Balancer
    // const BFactoryAddress = await deploy(BFactory, signer, []);
    const BFactoryAddress = "0xAF57a2eDEB0cFC20306E2B59Ed973fc10262d0c5";
    console.log('- BFactory deployed to: ', BFactoryAddress);

    // Deploying CRP
    // const SmartPoolManagerAddress = await deploy(SmartPoolManager, signer, []);
    const SmartPoolManagerAddress = "0x6705200B867DE5E41164c5DFeE68D0F2B53Babef";
    console.log('- SmartPoolManager deployed to: ', SmartPoolManagerAddress);

    // const BalancerSafeMathAddress = await deploy(BalancerSafeMath, signer, []);
    const BalancerSafeMathAddress = "0xF5A46454f64180e68F84df28F3798d2eB9089DA0";
    console.log('- BalancerSafeMath deployed to: ', BalancerSafeMathAddress);

    // const RightsManagerAddress = await deploy(RightsManager, signer, []);
    const RightsManagerAddress = "0x8A66Cc8A831A6ac783E5a0cf3A4943bd6C0ab334";
    console.log('- RightsManager deployed to: ', RightsManagerAddress);

    // const libraries = {
    //     "SmartPoolManager" : SmartPoolManagerAddress,
    //     "BalancerSafeMath" : BalancerSafeMathAddress,
    //     "RightsManager" : RightsManagerAddress
    // }
    // let _CRPFactory = CRPFactory;
    // _CRPFactory.bytecode = linkBytecode(_CRPFactory.bytecode, libraries);
    // const CRPFactoryAddress = await deploy(_CRPFactory, signer, []);
    const CRPFactoryAddress = "0x10d237b7263A052Ec0e2B4a8BF3454E5E7006446";
    console.log('- CRPFactory deployed to: ', CRPFactoryAddress);

    // Deploying Rain Protocol
    // const RedeemableERC20FactoryAddress = await deploy(RedeemableERC20Factory, signer, []);
    const RedeemableERC20FactoryAddress = "0x31aa5951100e11b8A34Bc9D98a44De152Dc5d3a2";
    console.log('- RedeemableERC20Factory deployed to: ', RedeemableERC20FactoryAddress);

    const ReedERC20PoolFactArgs = [
        CRPFactoryAddress, 
        BFactoryAddress
    ];
    // const RedeemableERC20PoolFactoryAddress = (
    //     await deploy(RedeemableERC20PoolFactory, signer, ReedERC20PoolFactArgs)
    // );
    const RedeemableERC20PoolFactoryAddress = "0xd5d4373f3ac5846acede555debd9a13d318c0678";
    console.log('- RedeemableERC20PoolFactory deployed to: ', RedeemableERC20PoolFactoryAddress);
    exportArgs(RedeemableERC20PoolFactory, ReedERC20PoolFactArgs, deployId);

    // const SeedERC20FactoryAddress = await deploy(SeedERC20Factory, signer, []);
    const SeedERC20FactoryAddress = "0xA102dd20ABD37F519e26Bbec9987BEE000cb86CF";
    console.log('- SeedERC20Factory deployed to: ', SeedERC20FactoryAddress);

    const TrustFactoryArgs = [
        RedeemableERC20FactoryAddress,
        RedeemableERC20PoolFactoryAddress,
        SeedERC20FactoryAddress
    ];
    const TrustFactoryAddress = await deploy(TrustFactory, signer, TrustFactoryArgs);
    console.log('- Trust factory deployed to: ', TrustFactoryAddress);
    exportArgs(TrustFactory, TrustFactoryArgs, deployId);
}
main();