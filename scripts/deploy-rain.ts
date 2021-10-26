import { ethers } from "hardhat";
import {deploy, linkBytecode, factoriesDeploy} from "./utils";

const BFactory = require(`./dist/artifacts/@beehiveinnovation/balancer-core/contracts/BFactory.sol/BFactory.json`);
const CRPFactory = require(`./dist/artifacts/@beehiveinnovation/configurable-rights-pool/contracts/CRPFactory.sol/CRPFactory.json`); 
const RightsManager = require(`./dist/artifacts/@beehiveinnovation/configurable-rights-pool/libraries/RightsManager.sol/RightsManager.json`);
const SmartPoolManager = require(`./dist/artifacts/@beehiveinnovation/configurable-rights-pool/libraries/SmartPoolManager.sol/SmartPoolManager.json`);
const BalancerSafeMath = require(`./dist/artifacts/@beehiveinnovation/configurable-rights-pool/libraries/BalancerSafeMath.sol/BalancerSafeMath.json`);
// import Prestige from '../balancer_mainnet_bytecode/PrestigeDeployTx.json';

import { RightsManager__factory } from './dist/typechain/factories/RightsManager__factory';
import { CRPFactory__factory } from './dist/typechain/factories/CRPFactory__factory';
import { BFactory__factory } from './dist/typechain/factories/BFactory__factory';

   
async function main() {
    const signers = await ethers.getSigners();
    const signer = signers[0];
    
    // Deploying balancer
    const SmartPoolManagerAddress = await deploy(SmartPoolManager, signer, []);
    console.log('- SmartPoolManager deployed to: ', SmartPoolManagerAddress);

    const BalancerSafeMathAddress = await deploy(BalancerSafeMath, signer, []);
    console.log('- BalancerSafeMath deployed to: ', BalancerSafeMathAddress);

    const RightsManagerAddress = await deploy(RightsManager, signer, []);
    console.log('- RightsManager deployed to: ', RightsManagerAddress);

    const BFactoryAddress = await deploy(BFactory, signer, []);
    console.log('- BFactory deployed to: ', BFactoryAddress);

    let _CRPFactory = CRPFactory;
    _CRPFactory.bytecode = linkBytecode(_CRPFactory.bytecode, {
        "RightsManager" : RightsManagerAddress,
        "SmartPoolManager" : SmartPoolManagerAddress,
        "BalancerSafeMath" : BalancerSafeMathAddress
    });
    const CRPFactoryAddress = await deploy(_CRPFactory, signer, []);
    console.log('- CRPFactory deployed to: ', CRPFactoryAddress);

    // Deploying trust factory
    const  addresses = await factoriesDeploy(CRPFactoryAddress, BFactoryAddress, signer);
    console.log('- Trust factory deployed to: ', addresses.trustFactoryAddress);
}
main();