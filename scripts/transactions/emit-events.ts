import { ethers } from "hardhat";
import { expect } from "chai";
import * as Util from "./Utils"

const FACTORY_ADDRESS = "0x4C91F1DEE2681aCe4ae1cDF90Dba0BD2263B11DE";

import type { TierByConstructionClaim } from "../dist/typechain/TierByConstructionClaim";
import type { ReadWriteTier } from "../dist/typechain/ReadWriteTier";
import type { ReserveToken } from "../dist/typechain/ReserveToken";
import type { SeedERC20 } from "../dist/typechain/SeedERC20";
import type { RedeemableERC20Pool } from "../dist/typechain/RedeemableERC20Pool";
import type { RedeemableERC20 } from "../dist/typechain/RedeemableERC20";
import type { TrustFactory } from "../dist/typechain/TrustFactory";
import type { Trust } from "../dist/typechain/Trust";

const TRUSTFACTORY = require("../dist/artifacts/contracts/rain-protocol/contracts/trust/TrustFactory.sol/TrustFactory.json");
const TRUST = require("../dist/artifacts/contracts/rain-protocol/contracts/trust/Trust.sol/Trust.json");
const SEED = require("../dist/artifacts/contracts/rain-protocol/contracts/seed/SeedERC20.sol/SeedERC20.json");
const POOL = require("../dist/artifacts/contracts/rain-protocol/contracts/pool/RedeemableERC20Pool.sol/RedeemableERC20Pool.json");
const REDEEMABLEERC20 = require("../dist/artifacts/contracts/rain-protocol/contracts/redeemableERC20/RedeemableERC20.sol/RedeemableERC20.json");

//
const RESERVE_TOKEN = require("../dist/artifacts/contracts/rain-protocol/contracts/test/ReserveToken.sol/ReserveToken.json");
const READWRITE_TIER = require("../dist/artifacts/contracts/rain-protocol/contracts/tier/ReadWriteTier.sol/ReadWriteTier.json");
const TIERBYCONSTRUCTION = require("../dist/artifacts/contracts/rain-protocol/contracts/claim/TierByConstructionClaim.sol/TierByConstructionClaim.json");


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
  
    const reserveAddress = await Util.deploy(RESERVE_TOKEN, signers[0], []);
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

    const readWriteTierAddress = await Util.deploy(READWRITE_TIER, signers[0], []);
    const readWriteTier = (new ethers.Contract( readWriteTierAddress , READWRITE_TIER.abi , signers[0] )) as ReadWriteTier;
    console.log("Tier deployed to: " + readWriteTierAddress)
    const minimumStatus = Tier.ZERO;
  
    await readWriteTier.connect(trader1).setTier(trader1.address, Tier.THREE, []);
  
    const tierByConstructionClaimAddress =  await Util.deploy(TIERBYCONSTRUCTION, signers[0], [
        readWriteTierAddress,
        minimumStatus
    ]);
    const tierByConstructionClaim = (new ethers.Contract(
        tierByConstructionClaimAddress, TIERBYCONSTRUCTION.abi , signers[0] 
    )) as TierByConstructionClaim;
    console.log("Tier by construction deployed to: " + tierByConstructionClaimAddress)
  
    await tierByConstructionClaim.claim(trader1.address, [], { gasLimit: 20000000 });
  
    // Existing trust factory deployment
    const _trustFactoryContract = new ethers.Contract(
      FACTORY_ADDRESS,
      TRUSTFACTORY.abi
    );
    const trustFactory = _trustFactoryContract.connect(deployer) as TrustFactory;
  

    const blockBeforeTrust = await ethers.provider.getBlockNumber();
    const trust = await Util.trustDeploy(
      trustFactory,
      deployer,
      {
        creator: creator.address,
        minimumCreatorRaise,
        seeder: ethers.constants.AddressZero, // autogenerate seedERC20 contract
        seederFee: seederFee,
        seederUnits: seedUnits,
        seederCooldownDuration,
        redeemInit,
      },
      {
        name: tokenName,
        symbol: tokenSymbol,
        tier: readWriteTierAddress,
        minimumStatus,
        totalSupply: totalTokenSupply,
      },
      {
        reserve: reserveAddress,
        reserveInit,
        initialValuation,
        finalValuation,
        minimumTradingDuration,
      },
      { gasLimit: 20000000 }
    );
  
    console.log("Trust deployed to: " + trust.address);

    const redeemableERC20 = new ethers.Contract(
      await trust.token(),
       REDEEMABLEERC20.abi, 
       creator
    ) as RedeemableERC20;
    
    // Checking the AddRedeemable event
    const eventFilter = redeemableERC20.filters.AddRedeemable(); 
    const event = await redeemableERC20.queryFilter(eventFilter, blockBeforeTrust);
    const newRedeemableAdded = event[0].args[0];
    expect(newRedeemableAdded).to.be.equal(reserveAddress);
    console.log("New redeemableERC20: " + await trust.token())

    const seedERC20Address = await trust.seeder();
    const seedERC20 = (new ethers.Contract( seedERC20Address , SEED.abi , signers[0] )) as SeedERC20;
    console.log("Seeder at: " + seedERC20Address)
    
    // seeder needs some cash
    const tx0 = await reserve.transfer(seeder.address, seederFee, config);
    await tx0.wait();
    console.log("Seeder transfered seed")
  
    // seeder seeds via SeedERC20 contract (typically used when more than 1 seeder)
    await reserve.connect(seeder).approve(seedERC20.address, seederFee, config);
  
    // buy all units
    await seedERC20.connect(seeder).seed(0, seedUnits, config);
    console.log("Bought all seed units")

    const pool = new ethers.Contract(
      await trust.pool(), 
      POOL.abi, 
      creator
    ) as RedeemableERC20Pool;
  
    // start raise
    const tx1 = await pool.startDutchAuction(config);
    await tx1.wait();
    console.log("Raise started")
  
    const startBlock = await ethers.provider.getBlockNumber();
  
    let [crp, bPool] = await Util.poolContracts(signers, pool);
  
    const tokenAddress = await trust.token();
  
    // // begin trading
    const swapReserveForTokens = async (signer:any, spend:any) => {
      const tx = await reserve.transfer(signer.address, spend, config);
      await tx.wait();
  
      await reserve.connect(signer).approve(bPool.address, spend, config);
      await crp.connect(signer).pokeWeights(config);
      await bPool
        .connect(signer)
        .swapExactAmountIn(
          reserveAddress,
          spend,
          tokenAddress,
          ethers.BigNumber.from("1"),
          ethers.BigNumber.from("1000000" + Util.sixZeros),
          config
        );
    };
  
    const reserveSpend = finalValuation.div(10);
  
    while ((await reserve.balanceOf(bPool.address)).lte(finalValuation)) {
      await swapReserveForTokens(trader1, reserveSpend);
    }
  
    console.log("All swaps done")
  
    // wait until distribution can end
    await Util.waitForBlock(startBlock + minimumTradingDuration + 1);
  
    console.log("Raise over")
  
    await trust.connect(seeder).anonEndDistribution(config);
  
    console.log("Raise ended")
  
    await seedERC20.connect(seeder).redeem(seedUnits, config);
  
    console.log("SeedERC20 redemeed")
  
    await redeemableERC20
      .connect(trader1)
      .redeem(await redeemableERC20.balanceOf(trader1.address),config);
  
    console.log("RedeemableERC20 redeemed")
}
  
  main();