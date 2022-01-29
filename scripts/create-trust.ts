import { ethers } from "hardhat";
import { MAX_STORAGE_LIMIT } from "@reef-defi/evm-provider";
import * as Util from "./utils";
import { getSigner, checkNetwork, getContract, getActualBlock } from "./utils";

import type { Contract } from "ethers";
import type { ReadWriteTier } from "@beehiveinnovation/rain-protocol/typechain/ReadWriteTier";
import type { ReserveToken } from "@beehiveinnovation/rain-protocol/typechain/ReserveToken";
import type { SeedERC20 } from "@beehiveinnovation/rain-protocol/typechain/SeedERC20";
import type { RedeemableERC20 } from "@beehiveinnovation/rain-protocol/typechain/RedeemableERC20";
import type { TrustFactory } from "@beehiveinnovation/rain-protocol/typechain/TrustFactory";

const TRUSTFACTORY = require("@beehiveinnovation/rain-protocol/artifacts/contracts/trust/TrustFactory.sol/TrustFactory.json");
const SEED = require("@beehiveinnovation/rain-protocol/artifacts/contracts/seed/SeedERC20.sol/SeedERC20.json");
const REDEEMABLEERC20 = require("@beehiveinnovation/rain-protocol/artifacts/contracts/redeemableERC20/RedeemableERC20.sol/RedeemableERC20.json");

//
const RESERVE_TOKEN = require("@beehiveinnovation/rain-protocol/artifacts/contracts/test/ReserveToken.sol/ReserveToken.json");
const READWRITE_TIER = require("@beehiveinnovation/rain-protocol/artifacts/contracts/tier/ReadWriteTier.sol/ReadWriteTier.json");
const TIERBYCONSTRUCTION = require("@beehiveinnovation/rain-protocol/artifacts/contracts/tier/TierByConstruction.sol/TierByConstruction.json");

enum Tier {
  NIL,
  COPPER,
  BRONZE,
  SILVER,
  GOLD,
  PLATINUM,
  DIAMOND,
  CHAD,
  JAWAD,
}

async function main() {
  const FactoryAddress = process.env.TrustFactory;
  if (!FactoryAddress || !ethers.utils.isAddress(FactoryAddress)) {
    throw "ERROR: Should provide a valid factory address with nix or env file";
  }

  const config = { gasLimit: 20000000 };

  const networkInfo = await checkNetwork();
  const signers = await getSigner();
  const configFactory =
    networkInfo.name !== "reef"
      ? config
      : { customData: { storageLimit: MAX_STORAGE_LIMIT } };

  const creator = signers[0];
  const deployer = signers[1]; // deployer is not creator
  const seeder1 = signers[2];
  const seeder2 = signers[3];
  const signer1 = signers[4];

  const reserveAddress = await Util.deploy(RESERVE_TOKEN, signers[0], []);
  const reserve = (await getContract(
    reserveAddress,
    RESERVE_TOKEN.abi,
    signers[0],
    networkInfo
  )) as ReserveToken;
  console.log("Reserve deployed to: " + reserveAddress);

  const readWriteTierAddress = await Util.deploy(
    READWRITE_TIER,
    signers[0],
    []
  );
  const readWriteTier = (await getContract(
    readWriteTierAddress,
    READWRITE_TIER.abi,
    signers[0],
    networkInfo
  )) as ReadWriteTier;
  console.log("Tier deployed to: " + readWriteTierAddress);
  const minimumTier = Tier.GOLD;

  await readWriteTier.setTier(signer1.address, Tier.GOLD, []);

  const totalTokenSupply = ethers.BigNumber.from("2000" + Util.eighteenZeros);
  const redeemableERC20Config = {
    name: "Token",
    symbol: "TKN",
    distributor: Util.zeroAddress,
    initialSupply: totalTokenSupply,
  };
  const seederUnits = 0;
  const seedERC20Config = {
    name: "SeedToken",
    symbol: "SDT",
    distributor: Util.zeroAddress,
    initialSupply: totalTokenSupply,
  };

  const reserveInit = ethers.BigNumber.from("2000" + Util.sixZeros);
  const redeemInit = ethers.BigNumber.from("2000" + Util.sixZeros);
  const initialValuation = ethers.BigNumber.from("20000" + Util.sixZeros);
  const minimumCreatorRaise = ethers.BigNumber.from("100" + Util.sixZeros);

  const seederFee = ethers.BigNumber.from("100" + Util.sixZeros);
  const seederCooldownDuration = 1;
  const seedPrice = reserveInit.div(10);

  const successLevel = redeemInit
    .add(minimumCreatorRaise)
    .add(seederFee)
    .add(reserveInit);
  const finalValuation = successLevel;

  const minimumTradingDuration = 50;

  // Existing trust factory deployment
  const _trustFactoryContract = await getContract(
    FactoryAddress,
    TRUSTFACTORY.abi,
    signers[0],
    networkInfo
  );
  const trustFactory = _trustFactoryContract.connect(deployer) as TrustFactory & Contract;

  const trust = await Util.trustDeploy(
    trustFactory,
    creator,
    {
      creator: creator.address,
      minimumCreatorRaise,
      seederFee,
      redeemInit,
      reserve: reserve.address,
      reserveInit,
      initialValuation,
      finalValuation,
      minimumTradingDuration,
    },
    {
      erc20Config: redeemableERC20Config,
      tier: readWriteTier.address,
      minimumTier,
    },
    {
      seeder: Util.zeroAddress,
      cooldownDuration: seederCooldownDuration,
      erc20Config: seedERC20Config,
    },
    { gasLimit: 100000000 }
  );

  await trust.deployed();
  console.log("Trust deployed to: " + trust.address);

  const { seeder } = await Util.getEventArgs(
    trust.deployTransaction,
    "Initialize",
    trust
  );

  const seederContract = (await getContract(
    seeder,
    SEED.abi,
    creator,
    networkInfo
  )) as RedeemableERC20 & Contract;
  console.log("Seeder Contract at: " + seederContract.address);
  
  const token = (await getContract(
    await trust.token(),
    REDEEMABLEERC20.abi,
    creator,
    networkInfo
  )) as RedeemableERC20 & Contract;
  console.log("Token RedeemableERC20 Contract at: " + token.address);

  const recipient = trust.address;

  const seeder1Units = 4;
  const seeder2Units = 6;

  // seeders needs some cash, give enough each for seeding
  await reserve.transfer(seeder1.address, seedPrice.mul(seeder1Units));
  await reserve.transfer(seeder2.address, seedPrice.mul(seeder2Units));

  const seederContract1 = seederContract.connect(seeder1);
  const seederContract2 = seederContract.connect(seeder2);
  const reserve1 = reserve.connect(seeder1);
  const reserve2 = reserve.connect(seeder2);

  await reserve1.approve(seederContract.address, seedPrice.mul(seeder1Units));
  await reserve2.approve(seederContract.address, seedPrice.mul(seeder2Units));

  // seeders send reserve to seeder contract
  await seederContract1.seed(0, seeder1Units);
  await seederContract2.seed(0, seeder2Units);

  // Recipient gains infinite approval on reserve token withdrawals from seed contract
  await reserve.allowance(seederContract.address, recipient);

  await trust.startDutchAuction({ gasLimit: 100000000 });

  const [crp, bPool] = await Util.poolContracts(signers, trust);

  const startBlock = await getActualBlock(networkInfo);

  const reserveSpend = finalValuation.div(10);
}

main()
  .then(() => {
    const exit = process.exit;
    exit(0);
  })
  .catch((error) => {
    console.error(error);
    const exit = process.exit;
    exit(1);
  });
