import { ethers } from "hardhat";
import {
  deploy,
  linkBytecode,
  factoriesDeploy
} from "../utils";

import {Tier, eighteenZeros, sixZeros, trustDeploy} from "./Utils"

const BFactory = require(`../dist/artifact/contracts/balancer-core/contracts/BFactory.sol/BFactory.json`);
const CRPFactory = require(`../dist/artifact/contracts/configurable-rights-pool/contracts/CRPFactory.sol/CRPFactory.json`); 
const RightsManager = require(`../dist/artifact/contracts/configurable-rights-pool/libraries/RightsManager.sol/RightsManager.json`);
const SmartPoolManager = require(`../dist/artifact/contracts/configurable-rights-pool/libraries/SmartPoolManager.sol/SmartPoolManager.json`);
const BalancerSafeMath = require(`../dist/artifact/contracts/configurable-rights-pool/libraries/BalancerSafeMath.sol/BalancerSafeMath.json`);

async function main() {
  const signers = await ethers.getSigners();
  const signer = signers[0]; 
  // In this case we managed the same signer addresses, but these addresses will be different

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
  const trustFactoryAddress = addresses.trustFactoryAddress;
  console.log('- Trust factory deployed to: ', trustFactoryAddress);
  const trustFactory = await ethers.getContractAt("TrustFactory", trustFactoryAddress, signer);

  //  --- Properties ---
  // The read/write tier
  const TierFactory = await ethers.getContractFactory("ReadWriteTier", signer);
  const readWriteTier = await TierFactory.deploy()
  const tierAddress = readWriteTier.address;
  console.log('- ReadWriteTier deployed to: ', tierAddress);
  
  // A reserve token to the trust
  const ReserveTokenFactory = await ethers.getContractFactory("ReserveToken", signer);
  const reserveToken = await ReserveTokenFactory.deploy()
  const tokenReserveAddress = reserveToken.address 
  console.log('- ReserveToken deployed to: ', tokenReserveAddress);


  // Trust properties
  const minimumStatus = Tier.NIL;
  const tokenName = "Token";
  const tokenSymbol = "TKN";
  const reserveInit = ethers.BigNumber.from("2000" + sixZeros);
  const redeemInit = ethers.BigNumber.from("2000" + sixZeros);
  const totalTokenSupply = ethers.BigNumber.from("2000" + eighteenZeros);
  const initialValuation = ethers.BigNumber.from("20000" + sixZeros);
  const minimumCreatorRaise = ethers.BigNumber.from("100" + sixZeros);
  const seederFee = ethers.BigNumber.from("100" + sixZeros);
  const seederUnits = 0;
  const seederCooldownDuration = 0;
  const minimumTradingDuration = 10;
  const successLevel = redeemInit
    .add(minimumCreatorRaise)
    .add(seederFee)
    .add(reserveInit);
    
  const trust = await trustDeploy(
    trustFactory,
    signer,
    { 
      // The trustFactoryTrustConfig_
      creator: signer.getAddress(),
      minimumCreatorRaise,
      seeder: signer.getAddress(),
      seederFee,
      seederUnits,
      seederCooldownDuration,
      redeemInit,
    },
    { 
      // The trustFactoryTrustRedeemableERC20Config_
      name: tokenName,
      symbol: tokenSymbol,
      tier: tierAddress,
      minimumStatus,
      totalSupply: totalTokenSupply,
    },
    { 
      // The trustFactoryTrustRedeemableERC20PoolConfig_
      reserve: tokenReserveAddress,
      reserveInit,
      initialValuation,
      finalValuation: successLevel,
      minimumTradingDuration,
    },
    { gasLimit: 100000000 }
  );

  if (await trustFactory.isChild(trust.address)) {
    console.log("Child was registered")
  } else {
    console.log("Child was NOT registered")
  }
}
    
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });