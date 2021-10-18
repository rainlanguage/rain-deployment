import { ethers } from "hardhat";
const hre = require("hardhat");

import {deploy, linkBytecode, factoriesDeploy} from "./utils";

const BFactory = require(`${process.env.DIST_VERSION}/artifacts/@beehiveinnovation/balancer-core/contracts/BFactory.sol/BFactory.json`);
const CRPFactory = require(`${process.env.DIST_VERSION}/artifacts/@beehiveinnovation/configurable-rights-pool/contracts/CRPFactory.sol/CRPFactory.json`);
const RightsManager = require(`${process.env.DIST_VERSION}/artifacts/@beehiveinnovation/configurable-rights-pool/libraries/RightsManager.sol/RightsManager.json`);
const SmartPoolManager = require(`${process.env.DIST_VERSION}/artifacts/@beehiveinnovation/configurable-rights-pool/libraries/SmartPoolManager.sol/SmartPoolManager.json`);
const BalancerSafeMath = require(`${process.env.DIST_VERSION}/artifacts/@beehiveinnovation/configurable-rights-pool/libraries/BalancerSafeMath.sol/BalancerSafeMath.json`);
// import Prestige from '../balancer_mainnet_bytecode/PrestigeDeployTx.json';

import { RightsManager__factory } from './typechain/factories/RightsManager__factory';
import { CRPFactory__factory } from './typechain/factories/CRPFactory__factory';
import { BFactory__factory } from './typechain/factories/BFactory__factory';

// This is provisional while we fix the JSON that we get on the import
import CRPFactoryProvisional from "./dist/CRPFactory.sol/CRPFactory.json";

   
async function main() {
    const signers = await hre.reef.getSigners();
    const signer = signers[0];
    /**
    "claimDefaultAccount" has to be done only once, multiple calls however won't change anything.
    This call take some REEF from the balance
    await signer.claimDefaultAccount();
    */

    // Deploying balancer
    const SmartPoolManagerAddress = await deploy(SmartPoolManager, signer, []);
    console.log('- SmartPoolManager deployed to: ', SmartPoolManagerAddress);

    const BalancerSafeMathAddress = await deploy(BalancerSafeMath, signer, []);
    console.log('- BalancerSafeMath deployed to: ', BalancerSafeMathAddress);

    const RightsManagerAddress = await deploy(RightsManager, signer, []);
    console.log('- RightsManager deployed to: ', RightsManagerAddress);

    const BFactoryAddress = await deploy(BFactory, signer, []);
    console.log('- BFactory deployed to: ', BFactoryAddress);

    let _CRPFactory = CRPFactoryProvisional;
    _CRPFactory.bytecode = linkBytecode(_CRPFactory.bytecode, {
        "RightsManager" : RightsManagerAddress,
        "SmartPoolManager" : SmartPoolManagerAddress,
        "BalancerSafeMath" : BalancerSafeMathAddress
    });
    const CRPFactoryAddress = await deploy(_CRPFactory, signer, []);
    console.log('- CRPFactory deployed to: ', CRPFactoryAddress);

    // Deploying trust factory
    const crpFactory = CRPFactory__factory.connect(CRPFactoryAddress, signer);
    const bFactory = BFactory__factory.connect(BFactoryAddress, signer);

    const  addresses = await factoriesDeploy(crpFactory, bFactory, signer);
    console.log('- Trust factory deployed to: ', addresses.trustFactoryAddress);
}
main();