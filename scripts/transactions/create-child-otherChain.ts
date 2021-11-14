import { ethers } from "hardhat";
import {
  deploy,
  linkBytecode,
  factoriesDeploy
} from "../utils";

import {Tier, eighteenZeros, sixZeros, trustDeploy} from "./Utils"

const BFactory = require(`../dist/artifacts/contracts/balancer-core/contracts/BFactory.sol/BFactory.json`);
const CRPFactory = require(`../dist/artifacts/contracts/configurable-rights-pool/contracts/CRPFactory.sol/CRPFactory.json`); 
const RightsManager = require(`../dist/artifacts/contracts/configurable-rights-pool/libraries/RightsManager.sol/RightsManager.json`);
const SmartPoolManager = require(`../dist/artifacts/contracts/configurable-rights-pool/libraries/SmartPoolManager.sol/SmartPoolManager.json`);
const BalancerSafeMath = require(`../dist/artifacts/contracts/configurable-rights-pool/libraries/BalancerSafeMath.sol/BalancerSafeMath.json`);

async function main() {
  const signers = await ethers.getSigners();
  const signer = signers[0]; 
  // In this case we managed the same signer addresses, but these addresses will be different

  // Deploying balancer
  // const SmartPoolManagerAddress = await deploy(SmartPoolManager, signer, []);
  const SmartPoolManagerAddress = "0xCE5Ded96347fde5447b97036605e83Bb0Ca4412E";
  console.log('- SmartPoolManager deployed to: ', SmartPoolManagerAddress);

  // const BalancerSafeMathAddress = await deploy(BalancerSafeMath, signer, []);
  const BalancerSafeMathAddress = "0xe34C092b84838241B302bf70506EB357AAd65555";
  console.log('- BalancerSafeMath deployed to: ', BalancerSafeMathAddress);

  // const RightsManagerAddress = await deploy(RightsManager, signer, []);
  const RightsManagerAddress = "0x3d7FbCf57Af825Bccc3990094b159aBF5349e410";
  console.log('- RightsManager deployed to: ', RightsManagerAddress);

  // const BFactoryAddress = await deploy(BFactory, signer, []);
  const BFactoryAddress = "0x5b40ecEB5E63e392d7a7e900E0fB850E43D9e003";
  console.log('- BFactory deployed to: ', BFactoryAddress);

  // let _CRPFactory = CRPFactory;
  // _CRPFactory.bytecode = linkBytecode(_CRPFactory.bytecode, {
  //     "RightsManager" : RightsManagerAddress,
  //     "SmartPoolManager" : SmartPoolManagerAddress,
  //     "BalancerSafeMath" : BalancerSafeMathAddress
  // });
  // const CRPFactoryAddress = await deploy(_CRPFactory, signer, []);
  const CRPFactoryAddress = "0xA35B482452062FC14F5f9eeEaFE892e7C6E171a9";
  console.log('- CRPFactory deployed to: ', CRPFactoryAddress);

  // Deploying trust factory
  // const  addresses = await factoriesDeploy(CRPFactoryAddress, BFactoryAddress, signer);
  // const trustFactoryAddress = addresses.trustFactoryAddress;
  const trustFactoryAddress = "0x96f999f904f88EF394250B67A60F920F9CbC44b3";
  console.log('- Trust factory deployed to: ', trustFactoryAddress);
  const trustFactory = await ethers.getContractAt("TrustFactory", trustFactoryAddress, signer);

  //  --- Properties ---
  // The read/write tier
  // const TierFactory = await ethers.getContractFactory("ReadWriteTier", signer);
  // const readWriteTier = await TierFactory.deploy()
  // const tierAddress = readWriteTier.address;
  const tierAddress = "0x539bb75e5F830F7b7BA49C29644c2F295f71e1AD";
  console.log('- ReadWriteTier deployed to: ', tierAddress);
  
  // A reserve token to the trust
  // const ReserveTokenFactory = await ethers.getContractFactory("ReserveToken", signer);
  // const reserveToken = await ReserveTokenFactory.deploy()
  // const tokenReserveAddress = reserveToken.address 
  const tokenReserveAddress = "0x50cf093EF9bD0466cdE391d43C76D3497e3EeFc0"
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
    { gasLimit: 15000000  }
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