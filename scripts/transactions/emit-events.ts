import { ethers } from "hardhat";
import * as Util from "./Utils"

const FACTORY_ADDRESS = "0x96f999f904f88EF394250B67A60F920F9CbC44b3";

import type { TierByConstructionClaim } from "../dist/typechains/TierByConstructionClaim";
import type { ReadWriteTier } from "../dist/typechains/ReadWriteTier";
import type { ReserveToken } from "../dist/typechains/ReserveToken";
import type { SeedERC20 } from "../dist/typechains/SeedERC20";
import type { RedeemableERC20Pool } from "../dist/typechains/RedeemableERC20Pool";
import type { RedeemableERC20 } from "../dist/typechains/RedeemableERC20";
import type { TrustFactory } from "../dist/typechains/TrustFactory";

const TRUSTFACTORY = require("../dist/artifact/contracts/rain-protocol/contracts/trust/TrustFactory.sol/TrustFactory.json");
const SEED = require("../dist/artifact/contracts/rain-protocol/contracts/seed/SeedERC20.sol/SeedERC20.json");
const POOL = require("../dist/artifact/contracts/rain-protocol/contracts/pool/RedeemableERC20Pool.sol/RedeemableERC20Pool.json");
const REDEEMABLEERC20 = require("../dist/artifact/contracts/rain-protocol/contracts/redeemableERC20/RedeemableERC20.sol/RedeemableERC20.json");

//
const RESERVE_TOKEN = require("../dist/artifact/contracts/rain-protocol/contracts/test/ReserveToken.sol/ReserveToken.json");
const READWRITE_TIER = require("../dist/artifact/contracts/rain-protocol/contracts/tier/ReadWriteTier.sol/ReadWriteTier.json");
const TIERBYCONSTRUCTION = require("../dist/artifact/contracts/rain-protocol/contracts/claim/TierByConstructionClaim.sol/TierByConstructionClaim.json");


enum Tier {
    ZERO,
    ONE,
    TWO,
    THREE,
    FOUR,
    FIVE,
    SIX,
    SEVEN,
    EIGHT,
  }

/**
 * Events
 *
 * [x] TierByConstructionClaim
 * [x] -> Claim
 * [x] -> TierChange
 *
 * [x] Factory -> IFactory.NewContract
 *
 * [x] Phased -> PhaseShiftScheduled
 * [x] RedeemableERC20 -> Redeem
 * [x] RedeemableERC20 -> AddRedeemable
 *
 * OZ ERC20
 * [x]   -> Transfer
 *
 */

 async function main() {

    const config = { gasLimit: 20000000 }
  
    const signers = await ethers.getSigners();
  
    const creator = signers[0];
    const seeder = signers[1]; // seeder is not creator/owner
    const deployer = signers[2];
    const trader1 = signers[3];
  
    // const reserveAddress = await Util.deploy(RESERVE_TOKEN, signers[0], []);
    const reserveAddress = "0x7775eAB57E07cAF4e7A8EC6679D08f3dc556F662";
    const reserve = (new ethers.Contract( reserveAddress , RESERVE_TOKEN.abi , signers[0] )) as ReserveToken;
    console.log("Reserve deployed to: " + reserveAddress)
  
    const tokenName = "Token";
    const tokenSymbol = "TKN";
  
    const reserveInit = ethers.BigNumber.from("2000" + Util.sixZeros);
    const redeemInit = ethers.BigNumber.from("2000" + Util.sixZeros);
    const totalTokenSupply = ethers.BigNumber.from("2000" + Util.eighteenZeros);
    const initialValuation = ethers.BigNumber.from("20000" + Util.sixZeros);
    const minimumCreatorRaise = ethers.BigNumber.from("1000" + Util.sixZeros);
  
    const seedUnits = 10;
    const seedPrice = reserveInit.div(seedUnits);
    const seederCooldownDuration = 3;
  
    const seederFee = seedPrice.mul(seedUnits);
  
    const finalValuation = reserveInit
      .add(seederFee)
      .add(redeemInit)
      .add(minimumCreatorRaise);
  
    const minimumTradingDuration = 30;

    // const readWriteTierAddress = await Util.deploy(READWRITE_TIER, signers[0], []);
    const readWriteTierAddress = "0xfc794a1d976569BD6178974Dee38DFb37F483aDc";
    const readWriteTier = (new ethers.Contract( readWriteTierAddress , READWRITE_TIER.abi , signers[0] )) as ReadWriteTier;
    console.log("Tier deployed to: " + readWriteTierAddress)
    const minimumStatus = Tier.ZERO;
  
    await readWriteTier.connect(trader1).setTier(trader1.address, Tier.THREE, []);
  
    // const tierByConstructionClaimAddress =  await Util.deploy(TIERBYCONSTRUCTION, signers[0], [
    //     readWriteTierAddress,
    //     minimumStatus
    // ]);
    const tierByConstructionClaimAddress =  "0xfc794a1d976569BD6178974Dee38DFb37F483aDc";
    const tierByConstructionClaim = (new ethers.Contract(
        tierByConstructionClaimAddress , TIERBYCONSTRUCTION.abi , signers[0] 
    )) as TierByConstructionClaim;
    console.log("Tier by construction deployed to: " + tierByConstructionClaimAddress)
  
    await tierByConstructionClaim.claim(trader1.address, []);
  
    // // Existing trust factory deployment
    // const _trustFactoryContract = new ethers.Contract(
    //   FACTORY_ADDRESS,
    //   TRUSTFACTORY.abi
    // );
    // const trustFactory = _trustFactoryContract.connect(deployer) as TrustFactory;
  
    // // Local TrustFactory deployment
    // // const [crpFactory, bFactory] = await TestUtil.balancerDeploy();
    // // const { trustFactory } = await Util.factoriesDeploy(crpFactory, bFactory);
  
    // const trust = await Util.trustDeploy(
    //   trustFactory,
    //   deployer,
    //   {
    //     creator: creator.address,
    //     minimumCreatorRaise,
    //     seeder: ethers.constants.AddressZero, // autogenerate seedERC20 contract
    //     seederFee: seederFee,
    //     seederUnits: seedUnits,
    //     seederCooldownDuration,
    //     redeemInit,
    //   },
    //   {
    //     name: tokenName,
    //     symbol: tokenSymbol,
    //     tier: readWriteTierAddress,
    //     minimumStatus,
    //     totalSupply: totalTokenSupply,
    //   },
    //   {
    //     reserve: reserveAddress,
    //     reserveInit,
    //     initialValuation,
    //     finalValuation,
    //     minimumTradingDuration,
    //   },
    //   // { gasLimit: 20000000 }
    // );
  
    // console.log("Trust deployed to: " + trust.address)
  
    // const seedERC20 = new ethers.Contract(
    //   await trust.seeder(),
    //   SEED.abi,
    //   signers[0]
    // ) as SeedERC20;
    
    // console.log("Seeder at: " + seedERC20.address)
    // // seeder needs some cash
    // const tx0 = await reserve.transfer(seeder.address, seederFee, config);
    // await tx0.wait();
    // console.log("Seeder transfered seed")
  
    // // seeder seeds via SeedERC20 contract (typically used when more than 1 seeder)
    // await reserve.connect(seeder).approve(seedERC20.address, seederFee, config);
  
    // // buy all units
    // await seedERC20.connect(seeder).seed(0, seedUnits, config);
    // console.log("Bought all seed units")
  
    // const redeemableERC20 = new ethers.Contract(
    //   await trust.token(),
    //   REDEEMABLEERC20.abi,
    //   creator
    // ) as RedeemableERC20;
    // const pool = new ethers.Contract(
    //   await trust.pool(),
    //   POOL.abi,
    //   creator
    // ) as RedeemableERC20Pool;
  
    // // start raise
    // const tx1 = await pool.startDutchAuction(config);
    // await tx1.wait();
    // console.log("Raise started")
  
    // const startBlock = await ethers.provider.getBlockNumber();
  
    // let [crp, bPool] = await Util.poolContracts(signers, pool);
  
    // const tokenAddress = await trust.token();
  
    // // begin trading
  
    // const swapReserveForTokens = async (signer:any, spend:any) => {
    //   const tx = await reserve.transfer(signer.address, spend);
    //   await tx.wait();
  
    //   await reserve.connect(signer).approve(bPool.address, spend);
    //   await crp.connect(signer).pokeWeights();
    //   await bPool
    //     .connect(signer)
    //     .swapExactAmountIn(
    //       reserveAddress,
    //       spend,
    //       tokenAddress,
    //       ethers.BigNumber.from("1"),
    //       ethers.BigNumber.from("1000000" + Util.sixZeros),
    //       config
    //     );
    // };
  
    // const reserveSpend = finalValuation.div(10);
  
    // while ((await reserve.balanceOf(bPool.address)).lte(finalValuation)) {
    //   await swapReserveForTokens(trader1, reserveSpend);
    // }
  
    // console.log("All swaps done")
  
    // // wait until distribution can end
    // await Util.waitForBlock(startBlock + minimumTradingDuration + 1);
  
    // console.log("Raise over")
  
    // await trust.connect(seeder).anonEndDistribution(config);
  
    // console.log("Raise ended")
  
    // await seedERC20.connect(seeder).redeem(seedUnits, config);
  
    // console.log("SeedERC20 redemeed")
  
    // await redeemableERC20
    //   .connect(trader1)
    //   .redeem(await redeemableERC20.balanceOf(trader1.address),config);
  
    // console.log("RedeemableERC20 redeemed")
}
  
  main();