import { ethers } from "hardhat";
const { MAX_STORAGE_LIMIT } = require("@reef-defi/evm-provider");
import * as Util from "./utils";
import { 
  getSigner,  
  checkNetwork, 
  getContract, 
  getActualBlock
} from "./utils";


import type { TierByConstructionClaim } from "../dist/typechain/TierByConstructionClaim";
import type { ReadWriteTier } from "../dist/typechain/ReadWriteTier";
import type { ReserveToken } from "../dist/typechain/ReserveToken";
import type { SeedERC20 } from "../dist/typechain/SeedERC20";
import type { RedeemableERC20Pool } from "../dist/typechain/RedeemableERC20Pool";
import type { RedeemableERC20 } from "../dist/typechain/RedeemableERC20";
import type { TrustFactory } from "../dist/typechain/TrustFactory";

// Until we get the new version in @beehiveinnovation package or using 
// directly the sub-module, compile with the new hardhat config, and target to those artifacts
const TRUSTFACTORY = require("../dist/artifacts/contracts/trust/TrustFactory.sol/TrustFactory.json");
const TRUST = require("../dist/artifacts/contracts/trust/Trust.sol/Trust.json");
const SEED = require("../dist/artifacts/contracts/seed/SeedERC20.sol/SeedERC20.json");
const POOL = require("../dist/artifacts/contracts/pool/RedeemableERC20Pool.sol/RedeemableERC20Pool.json");
const REDEEMABLEERC20 = require("../dist/artifacts/contracts/redeemableERC20/RedeemableERC20.sol/RedeemableERC20.json");

//
const RESERVE_TOKEN = require("../dist/artifacts/contracts/test/ReserveToken.sol/ReserveToken.json");
const READWRITE_TIER = require("../dist/artifacts/contracts/tier/ReadWriteTier.sol/ReadWriteTier.json");
const TIERBYCONSTRUCTION = require("../dist/artifacts/contracts/claim/TierByConstructionClaim.sol/TierByConstructionClaim.json");

const FactoryAddress:any = process.env.TrustFactory;

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
    
  const networkInfo = await checkNetwork();
  const signers = await getSigner();
  const configFactory = networkInfo.name != "reef" ? 
    config : { customData: { storageLimit: MAX_STORAGE_LIMIT } };


  const creator = signers[0];
  const seeder = signers[1]; // seeder is not creator/owner
  const deployer = signers[2];
  const trader1 = signers[3];

  const reserveAddress = await Util.deploy(RESERVE_TOKEN, signers[0], []);
  const reserve = (await getContract(reserveAddress, RESERVE_TOKEN.abi , signers[0], networkInfo)) as ReserveToken;
  console.log("Reserve deployed to: " + reserveAddress)

  const erc20Config = { name: "Token", symbol: "TKN" };
  const seedERC20Config = { name: "SeedToken", symbol: "SDT" };

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
  const readWriteTier = (await getContract(readWriteTierAddress , READWRITE_TIER.abi , signers[0], networkInfo)) as ReadWriteTier;
  console.log("Tier deployed to: " + readWriteTierAddress)
  const minimumStatus = Tier.ZERO;

  await readWriteTier.connect(trader1).setTier(await trader1.getAddress(), Tier.THREE, []);

  const tierByConstructionClaimAddress =  await Util.deploy(
    TIERBYCONSTRUCTION, 
    signers[0], 
    [
      readWriteTierAddress,
      minimumStatus
    ]
  );
  const tierByConstructionClaim = (await getContract(
      tierByConstructionClaimAddress, 
      TIERBYCONSTRUCTION.abi, 
      signers[0], 
      networkInfo
  )) as TierByConstructionClaim;
  console.log("Tier by construction deployed to: " + tierByConstructionClaimAddress)

  await tierByConstructionClaim.claim(await trader1.getAddress(), [], { gasLimit: 20000000 });

  // Existing trust factory deployment
  const _trustFactoryContract = await getContract(
    FactoryAddress,
    TRUSTFACTORY.abi, 
    signers[0],
    networkInfo
  );
  const trustFactory = _trustFactoryContract.connect(deployer) as TrustFactory;

  const trust = await Util.trustDeploy(
    trustFactory,
    deployer,
    {
      creator: await creator.getAddress(),
      minimumCreatorRaise,
      seeder: ethers.constants.AddressZero, // autogenerate seedERC20 contract
      seederFee: seederFee,
      seederUnits: seedUnits,
      seederCooldownDuration,
      redeemInit,
      seedERC20Config
    },
    {
      erc20Config,
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
    configFactory
  );

  console.log("Trust deployed to: " + trust.address);

  const redeemableERC20 = await getContract(
    await trust.token(),
     REDEEMABLEERC20.abi, 
     creator, 
     networkInfo
  ) as RedeemableERC20;

  const seedERC20Address = await trust.seeder();
  const seedERC20 = (await getContract( seedERC20Address , SEED.abi , signers[0], networkInfo)) as SeedERC20;
  console.log("Seeder at: " + seedERC20Address)
  
  // seeder needs some cash
  const tx0 = await reserve.transfer(await seeder.getAddress(), seederFee, config);
  await tx0.wait();
  console.log("Seeder transfered seed")

  // seeder seeds via SeedERC20 contract (typically used when more than 1 seeder)
  await reserve.connect(seeder).approve(seedERC20.address, seederFee, config);

  // buy all units
  await seedERC20.connect(seeder).seed(0, seedUnits, config);
  console.log("Bought all seed units")

  const pool = await getContract(
    await trust.pool(), 
    POOL.abi, 
    creator, 
    networkInfo
  ) as RedeemableERC20Pool;

  // start raise
  const tx1 = await pool.startDutchAuction(config);
  await tx1.wait();
  console.log("Raise started")

  const startBlock = await getActualBlock(networkInfo);

  let [crp, bPool] = await Util.poolContracts(signers, pool);

  const tokenAddress = await trust.token();

  // // begin trading
  const swapReserveForTokens = async (signer:any, spend:any) => {
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

  let i=1;
  while ((await reserve.balanceOf(bPool.address)).lte(finalValuation)) {
    await swapReserveForTokens(trader1, reserveSpend);
    console.log(`Swap ${i}`);
    i+=1;
  }

  console.log("All swaps done")

  // wait until distribution can end
  await Util.waitForBlock(startBlock + minimumTradingDuration + 1, networkInfo);

  console.log("Raise over")

  await trust.connect(seeder).anonEndDistribution(config);

  console.log("Raise ended")

  await seedERC20.connect(seeder).redeem(seedUnits, config);

  console.log("SeedERC20 redemeed")

  await redeemableERC20
    .connect(trader1)
    .redeem([reserveAddress], await redeemableERC20.balanceOf(await trader1.getAddress()), config);

  console.log("RedeemableERC20 redeemed")
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
    });