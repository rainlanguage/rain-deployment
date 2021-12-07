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
    const BFactoryAddress = await deploy(BFactory, signer, []);
    console.log('- BFactory deployed to: ', BFactoryAddress);

    // Deploying CRP
    const SmartPoolManagerAddress = await deploy(SmartPoolManager, signer, []);
    console.log('- SmartPoolManager deployed to: ', SmartPoolManagerAddress);

    const BalancerSafeMathAddress = await deploy(BalancerSafeMath, signer, []);
    console.log('- BalancerSafeMath deployed to: ', BalancerSafeMathAddress);

    const RightsManagerAddress = await deploy(RightsManager, signer, []);
    console.log('- RightsManager deployed to: ', RightsManagerAddress);

    const libraries = {
        "SmartPoolManager" : SmartPoolManagerAddress,
        "BalancerSafeMath" : BalancerSafeMathAddress,
        "RightsManager" : RightsManagerAddress
    }
    let _CRPFactory = CRPFactory;
    _CRPFactory.bytecode = linkBytecode(_CRPFactory.bytecode, libraries);
    const CRPFactoryAddress = await deploy(_CRPFactory, signer, []);
    console.log('- CRPFactory deployed to: ', CRPFactoryAddress);

    // Deploying Rain Protocol
    const RedeemableERC20FactoryAddress = await deploy(RedeemableERC20Factory, signer, []);
    console.log('- RedeemableERC20Factory deployed to: ', RedeemableERC20FactoryAddress);

    const ReedERC20PoolFactArgs = [
        CRPFactoryAddress, 
        BFactoryAddress
    ];
    const RedeemableERC20PoolFactoryAddress = (
        await deploy(RedeemableERC20PoolFactory, signer, [ReedERC20PoolFactArgs])
    );
    console.log('- RedeemableERC20PoolFactory deployed to: ', RedeemableERC20PoolFactoryAddress);
    exportArgs(RedeemableERC20PoolFactory, ReedERC20PoolFactArgs, deployId);

    const SeedERC20FactoryAddress = await deploy(SeedERC20Factory, signer, []);
    console.log('- SeedERC20Factory deployed to: ', SeedERC20FactoryAddress);

    const TrustFactoryArgs = [
        RedeemableERC20FactoryAddress,
        RedeemableERC20PoolFactoryAddress,
        SeedERC20FactoryAddress
    ];
    const TrustFactoryAddress = await deploy(TrustFactory, signer, [TrustFactoryArgs]);
    console.log('- Trust factory deployed to: ', TrustFactoryAddress);
    exportArgs(TrustFactory, TrustFactoryArgs, deployId);
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
    });