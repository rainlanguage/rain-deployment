import { ethers } from "hardhat";
const hre = require("hardhat");
import {deploy, linkBytecode, factoriesDeploy, editSolc, exportArguments} from "./utils";

const BFactory = require(`./dist/artifact/contracts/balancer-core/contracts/BFactory.sol/BFactory.json`);
const CRPFactory = require(`./dist/artifact/contracts/configurable-rights-pool/contracts/CRPFactory.sol/CRPFactory.json`); 
const RightsManager = require(`./dist/artifact/contracts/configurable-rights-pool/libraries/RightsManager.sol/RightsManager.json`);
const SmartPoolManager = require(`./dist/artifact/contracts/configurable-rights-pool/libraries/SmartPoolManager.sol/SmartPoolManager.json`);
const BalancerSafeMath = require(`./dist/artifact/contracts/configurable-rights-pool/libraries/BalancerSafeMath.sol/BalancerSafeMath.json`);
   
async function main() {
    const signers = await hre.reef.getSigners();
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
   editSolc([RightsManagerAddress, SmartPoolManagerAddress, BalancerSafeMathAddress]);
   console.log('- CRPFactory deployed to: ', CRPFactoryAddress);

   // Deploying trust factory
   const  addresses = await factoriesDeploy(CRPFactoryAddress, BFactoryAddress, signer);
   console.log('- Trust factory deployed to: ', addresses.trustFactoryAddress);
}
main();