import { ethers } from "hardhat";
import hre from "hardhat";

import {Tier, eighteenZeros, sixZeros, trustDeploy} from "./Utils"

async function main() {
  const signers = await hre.reef.getSigners();
  const creator = signers[0]; // Creator of the trust
  const seeder = signers[0]; // Seeder is not creator/owner 
  const deployer = signers[0]; // Deployer of the trust factort
  // In this case we managed the same signer addresses, but these addresses will be different

  // A reserve token to the trust
  const tokenReserveAddress = "0xC2BC4a05931D583Bad998cDc52E6c560BD0035A8" 
  // The read/write tier
  const tierAddress = "0x8aCfce346D72e7b7cD9C0E15e088FEad17927e62";
  // Trust factory address
  const trustFactoryAddress = "0x97283C6b8BF4508338c6615E5a26BAEC19006fdd";
  const trustFactory = await hre.reef.getContractAt("TrustFactory", trustFactoryAddress, deployer);

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
    creator,
    {
      creator: creator.getAddress(),
      minimumCreatorRaise,
      seeder: seeder.getAddress(),
      seederFee,
      seederUnits,
      seederCooldownDuration,
      redeemInit,
    },
    {
      name: tokenName,
      symbol: tokenSymbol,
      tier: tierAddress,
      minimumStatus,
      totalSupply: totalTokenSupply,
    },
    {
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