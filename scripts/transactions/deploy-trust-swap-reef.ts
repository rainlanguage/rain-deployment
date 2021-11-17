import { ethers } from "hardhat";
import hre from "hardhat";
import { expect } from "chai";
import * as Util from "./Utils"
import { MAX_STORAGE_LIMIT } from "@reef-defi/evm-provider";
const checkSumAddress = ethers.utils.getAddress;

const FACTORY_ADDRESS = "0x415FE28416c0747070b254Aa3C571C985f0865b5"; //reef

import type { TierByConstructionClaim } from "../../dist/typechain/TierByConstructionClaim";
import type { ReadWriteTier } from "../../dist/typechain/ReadWriteTier";
import type { ReserveToken } from "../../dist/typechain/ReserveToken";
import type { SeedERC20 } from "../../dist/typechain/SeedERC20";
import type { RedeemableERC20Pool } from "../../dist/typechain/RedeemableERC20Pool";
import type { RedeemableERC20 } from "../../dist/typechain/RedeemableERC20";
import type { TrustFactory } from "../../dist/typechain/TrustFactory";
import type { Trust } from "../../dist/typechain/Trust";

// Until we get the new version in @beehiveinnovation package or using 
// directly the sub-module, compile with the new hardhat config, and target to those artifacts
const TRUSTFACTORY = require("../../dist/artifacts/contracts/trust/TrustFactory.sol/TrustFactory.json");
const TRUST = require("../../dist/artifacts/contracts/trust/Trust.sol/Trust.json");
const SEED = require("../../dist/artifacts/contracts/seed/SeedERC20.sol/SeedERC20.json");
const POOL = require("../../dist/artifacts/contracts/pool/RedeemableERC20Pool.sol/RedeemableERC20Pool.json");
const REDEEMABLEERC20 = require("../../dist/artifacts/contracts/redeemableERC20/RedeemableERC20.sol/RedeemableERC20.json");

//
const RESERVE_TOKEN = require("../../dist/artifacts/contracts/test/ReserveToken.sol/ReserveToken.json");
const READWRITE_TIER = require("../../dist/artifacts/contracts/tier/ReadWriteTier.sol/ReadWriteTier.json");
const TIERBYCONSTRUCTION = require("../../dist/artifacts/contracts/claim/TierByConstructionClaim.sol/TierByConstructionClaim.json");


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
    const provider = await hre.reef.getProvider();
    const signers = await hre.reef.getSigners();
  
    const creator = signers[0];
    const seeder = signers[1]; // seeder is not creator/owner
    const deployer = signers[2];
    const trader1 = signers[3];
  
    // Reserve token
    // const reserveAddress = await Util.deploy(RESERVE_TOKEN, creator, []);
    const reserveAddress = "0x5591D95f1d6Bb41AD2c7735aDFFFAA70D4D31039";
    const reserve = (await hre.reef.getContractAt(RESERVE_TOKEN.abi, reserveAddress, creator)) as ReserveToken;
    console.log("Reserve deployed to: " + reserveAddress)
  
    // Properties 
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

    // ReadWrite tier contract attached deployed by creator and attached to trader1 to do tx
    // const readWriteTierAddress = await Util.deploy(READWRITE_TIER, creator, []);
    const readWriteTierAddress = "0xB51CEd610076d26a8033A9EF119Aa06f92713C8B";
    const readWriteTier = (
      await hre.reef.getContractAt(READWRITE_TIER.abi, readWriteTierAddress, trader1)
    ) as ReadWriteTier;
    console.log("Tier deployed to: " + readWriteTierAddress)
    const minimumStatus = Tier.ZERO;
  
    await readWriteTier.setTier(await trader1.getAddress(), Tier.THREE, []);
  
    // TierByConstructionClaimAddress deployed and attached to creator
    const tierByConstructionClaimAddress =  await Util.deploy(TIERBYCONSTRUCTION, creator, [
        readWriteTierAddress,
        minimumStatus
    ]);
    // const tierByConstructionClaimAddress =  "0x7f4E4E1b55F734B881BA546Fc133E65d7Ba427BA";
    const tierByConstructionClaim = (
      await hre.reef.getContractAt(TIERBYCONSTRUCTION.abi, tierByConstructionClaimAddress, creator)
    ) as TierByConstructionClaim;
    console.log("Tier by construction deployed to: " + tierByConstructionClaimAddress)
  
    await tierByConstructionClaim.claim(await trader1.getAddress(), [], { gasLimit: 20000000 });
  
    // Existing trust factory deployment
    const trustFactory = (
      await hre.reef.getContractAt(TRUSTFACTORY.abi, FACTORY_ADDRESS, deployer)
    ) as TrustFactory;
  
    const blockBeforeTrust = await provider.getBlockNumber();
    const trust = await Util.trustDeploy(
      trustFactory,
      deployer,
      {
        creator: creator.getAddress(),
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
      { customData: { storageLimit: MAX_STORAGE_LIMIT } }
    );
  
    console.log("Trust deployed to: " + trust.address);

    const redeemableERC20 = (
      await hre.reef.getContractAt(REDEEMABLEERC20.abi, await trust.token(), creator)
    )as RedeemableERC20;
    console.log("New redeemableERC20: " + await trust.token())

    const seedERC20Address = await trust.seeder();
    const seedERC20 = (await hre.reef.getContractAt(SEED.abi, seedERC20Address, seeder)) as SeedERC20;
    console.log("Seeder at: " + seedERC20Address)
    
    // seeder needs some cash
    const tx0 = await reserve.transfer(await seeder.getAddress(), seederFee, config);
    await tx0.wait();
    console.log("Seeder transfered seed")
  
    // seeder seeds via SeedERC20 contract (typically used when more than 1 seeder)
    const reserveAttachSeeder = (
      await hre.reef.getContractAt(RESERVE_TOKEN.abi, reserveAddress, seeder)
    ) as ReserveToken;
    await reserveAttachSeeder.approve(seedERC20.address, seederFee, config);
  
    // buy all units
    await seedERC20.seed(0, seedUnits, config);
    console.log("Bought all seed units")

    const pool = (
      await hre.reef.getContractAt(POOL.abi, await trust.pool(), creator)
    ) as RedeemableERC20Pool;

  
    // start raise
    const tx1 = await pool.startDutchAuction(config);
    await tx1.wait();
    console.log("Raise started")
  
    const startBlock = await provider.getBlockNumber();
  
    let [crp, bPool] = await Util.poolContracts(signers, pool);
  
    const tokenAddress = await trust.token();
  
    // begin trading
    const swapReserveForTokens = async (signer:any, spend:any) => {
      // Transfer from creator (signer in reserver) to the signer argument
      const tx = await reserve.transfer(await signer.getAddress(), spend, config);
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
    let i=0;
    while ((await reserve.balanceOf(bPool.address)).lte(finalValuation)) {
      await swapReserveForTokens(trader1, reserveSpend);
      console.log(`Swap ${i}`);
      i+=1;
    }
    console.log("All swaps done")
  
    // wait until distribution can end
    const waitForBlock = async (blockNumber:any): Promise<any> => {
      const currentBlock = await provider.getBlockNumber();
    
      if (currentBlock >= blockNumber) {
        return;
      }
    
      console.log({
        currentBlock,
        awaitingBlock: blockNumber,
      });
    
      await Util.timeout(2000);
    
      return await waitForBlock(blockNumber);
    };

    await waitForBlock(startBlock + minimumTradingDuration + 1);

  
    console.log("Raise over")

    // Attach the same trust to seeder as signer to call 
    const trustAttchSeeder = (
      await hre.reef.getContractAt(TRUST.abi, trust.address, seeder)
    ) as Trust;
  
    await trustAttchSeeder.anonEndDistribution(config);
    // await trust.connect(seeder).anonEndDistribution(config);
  
    console.log("Raise ended")
  
    // The seedERC20 is already attached to seeder as signer
    await seedERC20.redeem(seedUnits, config);
    // await seedERC20.connect(seeder).redeem(seedUnits, config);

  
    console.log("SeedERC20 redemeed")

    // Attach the same RedeemableERC20 to trader1 as signer to call 
    const redeemableERC20AttchTrader1 = (
      await hre.reef.getContractAt(REDEEMABLEERC20.abi, redeemableERC20.address, trader1)
    )as RedeemableERC20;
  
    await redeemableERC20AttchTrader1
      .redeem(
        [reserveAddress], 
        await redeemableERC20.balanceOf(await trader1.getAddress()),
        config
      );
  
    console.log("RedeemableERC20 redeemed")
}
  
  main();