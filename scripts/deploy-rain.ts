import { ethers } from "hardhat";
import {
    deploy, 
    linkBytecode, 
    generateJSONWithLibAddr,
    exportArgs,
    getDeployID
} from "./utils";

// Balancer
const BFactory = require(`./dist/artifacts/contracts/balancer-core/contracts/BFactory.sol/BFactory.json`);
// CRP
const CRPFactory = require(`./dist/artifacts/contracts/configurable-rights-pool/contracts/CRPFactory.sol/CRPFactory.json`); 
const RightsManager = require(`./dist/artifacts/contracts/configurable-rights-pool/libraries/RightsManager.sol/RightsManager.json`);
// const SmartPoolManager = require(`./dist/artifacts/contracts/configurable-rights-pool/libraries/SmartPoolManager.sol/SmartPoolManager.json`);
const BalancerSafeMath = require(`./dist/artifacts/contracts/configurable-rights-pool/libraries/BalancerSafeMath.sol/BalancerSafeMath.json`);
// Rain protocol
const RedeemableERC20Factory = require("./dist/artifacts/contracts/rain-protocol/contracts/redeemableERC20/RedeemableERC20Factory.sol/RedeemableERC20Factory.json")
const RedeemableERC20PoolFactory = require("./dist/artifacts/contracts/rain-protocol/contracts/pool/RedeemableERC20PoolFactory.sol/RedeemableERC20PoolFactory.json")
const SeedERC20Factory = require("./dist/artifacts/contracts/rain-protocol/contracts/seed/SeedERC20Factory.sol/SeedERC20Factory.json")
const TrustFactory = require("./dist/artifacts/contracts/rain-protocol/contracts/trust/TrustFactory.sol/TrustFactory.json")

const SmartPoolManager = require(`../artifacts/contracts/configurable-rights-pool/libraries/SmartPoolManager.sol/SmartPoolManager.json`);

async function main() {
    const signers = await ethers.getSigners();
    const signer = signers[0];
    const deployId = getDeployID();

    // // Deploying Balancer
    // const BFactoryAddress = await deploy(BFactory, signer, []);
    // console.log('- BFactory deployed to: ', BFactoryAddress);

    // Deploying CRP
    const SmartPoolManagerAddress = await deploy(SmartPoolManager, signer, []);
    console.log('- SmartPoolManager deployed to: ', SmartPoolManagerAddress);

    // const BalancerSafeMathAddress = await deploy(BalancerSafeMath, signer, []);
    // console.log('- BalancerSafeMath deployed to: ', BalancerSafeMathAddress);

    // const RightsManagerAddress = await deploy(RightsManager, signer, []);
    // console.log('- RightsManager deployed to: ', RightsManagerAddress);

    // const libraries = {
    //     "SmartPoolManager" : SmartPoolManagerAddress,
    //     "BalancerSafeMath" : BalancerSafeMathAddress,
    //     "RightsManager" : RightsManagerAddress
    // }
    // let _CRPFactory = CRPFactory;
    // _CRPFactory.bytecode = linkBytecode(_CRPFactory.bytecode, libraries);
    // const CRPFactoryAddress = await deploy(_CRPFactory, signer, []);
    // console.log('- CRPFactory deployed to: ', CRPFactoryAddress);
    // generateJSONWithLibAddr(libraries, deployId);

    // // Deploying Rain Protocol
    // const RedeemableERC20FactoryAddress = await deploy(RedeemableERC20Factory, signer, []);
    // console.log('- RedeemableERC20Factory deployed to: ', RedeemableERC20FactoryAddress);

    // const ReedERC20PoolFactArgs = [
    //     CRPFactoryAddress, 
    //     BFactoryAddress
    // ];
    // const RedeemableERC20PoolFactoryAddress = (
    //     await deploy(RedeemableERC20PoolFactory, signer, ReedERC20PoolFactArgs)
    // );
    // console.log('- RedeemableERC20PoolFactory deployed to: ', RedeemableERC20PoolFactoryAddress);
    // exportArgs(RedeemableERC20PoolFactory, ReedERC20PoolFactArgs, deployId);

    // const SeedERC20FactoryAddress = await deploy(SeedERC20Factory, signer, []);
    // console.log('- SeedERC20Factory deployed to: ', SeedERC20FactoryAddress);

    // const TrustFactoryArgs = [
    //     RedeemableERC20FactoryAddress,
    //     RedeemableERC20PoolFactoryAddress,
    //     SeedERC20FactoryAddress
    // ];
    // const TrustFactoryAddress = await deploy(TrustFactory, signer, TrustFactoryArgs);
    // console.log('- Trust factory deployed to: ', TrustFactoryAddress);
    // exportArgs(TrustFactory, TrustFactoryArgs, deployId);
}
main();