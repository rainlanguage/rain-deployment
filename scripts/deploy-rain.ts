import { ethers } from "hardhat";
import {deploy, linkBytecode, factoriesDeploy, editSolc, exportArguments} from "./utils";

const BFactory = require(`./dist/artifacts/contracts/balancer-core/contracts/BFactory.sol/BFactory.json`);
const CRPFactory = require(`./dist/artifacts/contracts/configurable-rights-pool/contracts/CRPFactory.sol/CRPFactory.json`); 
const RightsManager = require(`./dist/artifacts/contracts/configurable-rights-pool/libraries/RightsManager.sol/RightsManager.json`);
const SmartPoolManager = require(`./dist/artifacts/contracts/configurable-rights-pool/libraries/SmartPoolManager.sol/SmartPoolManager.json`);
const BalancerSafeMath = require(`./dist/artifacts/contracts/configurable-rights-pool/libraries/BalancerSafeMath.sol/BalancerSafeMath.json`);

async function main() {
    const signers = await ethers.getSigners();
    const signer = signers[0];

    // // Deploying balancer
    // const SmartPoolManagerAddress = await deploy(SmartPoolManager, signer, []);
    // console.log('- SmartPoolManager deployed to: ', SmartPoolManagerAddress);
    
    // const BalancerSafeMathAddress = await deploy(BalancerSafeMath, signer, []);
    // console.log('- BalancerSafeMath deployed to: ', BalancerSafeMathAddress);
    
    // const RightsManagerAddress = await deploy(RightsManager, signer, []);
    // console.log('- RightsManager deployed to: ', RightsManagerAddress);
    
    // const BFactoryAddress = await deploy(BFactory, signer, []);
    // console.log('- BFactory deployed to: ', BFactoryAddress);
    
    const SmartPoolManagerAddress = "0xddf904662e4A4F114d4a3Dc385cA9E47C36C160A";
    const BalancerSafeMathAddress = "0xE914e4658B6e7661682afA8fB440f2070e707C7C";
    const RightsManagerAddress = "0x9967A6484F6506c93bA01B0aa2060A01722C7899";
    let _CRPFactory = CRPFactory;
    _CRPFactory.bytecode = linkBytecode(_CRPFactory.bytecode, {
        "RightsManager" : RightsManagerAddress,
        "SmartPoolManager" : SmartPoolManagerAddress,
        "BalancerSafeMath" : BalancerSafeMathAddress
    });
    const CRPFactoryAddress = await deploy(_CRPFactory, signer, []);
    editSolc([SmartPoolManagerAddress, RightsManagerAddress, BalancerSafeMathAddress]);
    console.log('- CRPFactory deployed to: ', CRPFactoryAddress);

    // // Deploying trust factory
    // const  addresses = await factoriesDeploy(CRPFactoryAddress, BFactoryAddress, signer);
    // console.log('- Trust factory deployed to: ', addresses.trustFactoryAddress);
}
main();