import { ethers } from "hardhat"
// import { factoriesDeploy } from '../balancer/test/Util'

import { RightsManager__factory } from '@beehiveinnovation/rain-protocol/dist/e07af1be5703ebddd8faf546df1e98f23164c253/typechain/factories/RightsManager__factory'
import { CRPFactory__factory } from '@beehiveinnovation/rain-protocol/dist/e07af1be5703ebddd8faf546df1e98f23164c253/typechain/factories/CRPFactory__factory'
import { BFactory__factory } from '@beehiveinnovation/rain-protocol/dist/e07af1be5703ebddd8faf546df1e98f23164c253/typechain/factories/BFactory__factory'

import type { CRPFactory } from "@beehiveinnovation/rain-protocol/dist/e07af1be5703ebddd8faf546df1e98f23164c253/typechain/CRPFactory";
import type { BFactory } from "@beehiveinnovation/rain-protocol/dist/e07af1be5703ebddd8faf546df1e98f23164c253/typechain/BFactory";

import type { TrustFactory } from "@beehiveinnovation/rain-protocol/dist/e07af1be5703ebddd8faf546df1e98f23164c253/typechain/TrustFactory";
import type { RedeemableERC20Factory } from "@beehiveinnovation/rain-protocol/dist/e07af1be5703ebddd8faf546df1e98f23164c253/typechain/RedeemableERC20Factory";
import type { RedeemableERC20PoolFactory } from "@beehiveinnovation/rain-protocol/dist/e07af1be5703ebddd8faf546df1e98f23164c253/typechain/RedeemableERC20PoolFactory";
import type { SeedERC20Factory } from "@beehiveinnovation/rain-protocol/dist/e07af1be5703ebddd8faf546df1e98f23164c253/typechain/SeedERC20Factory";

const crpFactoryAddress = '0xFB7Cd2084f0C745193DF635413dFbc1a682bD494'
const bFactoryAddress = '0xc50aAf61BAE0b5c69DAf59aED1Fe8dC793C44595'
const rightsManagerAddress = '0x3F9276cE9DDCaaB2b558DeFEA6DE1a8ee321536b'
async function main() {

    const signers = await ethers.getSigners();
    const signer = signers[0];

    const crpFactory = CRPFactory__factory.connect(crpFactoryAddress, signer)
    const bFactory = BFactory__factory.connect(bFactoryAddress, signer)

    const { trustFactory } = await factoriesDeploy(
        crpFactory,
        bFactory
      );

    console.log('Trust factory deployed to: ', trustFactory.address);

    // const trustFactoryDeployer = trustFactory.connect(signer);

    // const trust1 = await Util.trustDeploy(
    //     trustFactoryDeployer,
    //     signer,
    //     {
    //       creator: creator.address,
    //       minimumCreatorRaise,
    //       seeder: seeder.address,
    //       seederFee,
    //       seederUnits,
    //       seederCooldownDuration,
    //       minimumTradingDuration,
    //       redeemInit,
    //     },
    //     {
    //       name: tokenName,
    //       symbol: tokenSymbol,
    //       prestige: prestige.address,
    //       minimumStatus,
    //       totalSupply: totalTokenSupply,
    //     },
    //     {
    //       reserve: reserve.address,
    //       reserveInit,
    //       initialValuation,
    //       finalValuation: successLevel,
    //     },
    //     { gasLimit: 100000000 }
    //   );
}

main()

interface Factories {
    redeemableERC20Factory: RedeemableERC20Factory;
    redeemableERC20PoolFactory: RedeemableERC20PoolFactory;
    seedERC20Factory: SeedERC20Factory;
    trustFactory: TrustFactory;
}

const factoriesDeploy = async (
    crpFactory: CRPFactory,
    balancerFactory: BFactory
  ): Promise<Factories> => {
    const redeemableERC20FactoryFactory = await ethers.getContractFactory(
      "RedeemableERC20Factory"
    );
    const redeemableERC20Factory =
      (await redeemableERC20FactoryFactory.deploy()) as RedeemableERC20Factory;
    await redeemableERC20Factory.deployed();
  
    console.log("redeemableERC20Factory deployed to: " + redeemableERC20Factory.address)

    const redeemableERC20PoolFactoryFactory = await ethers.getContractFactory(
      "RedeemableERC20PoolFactory"
    );
    const redeemableERC20PoolFactory =
      (await redeemableERC20PoolFactoryFactory.deploy({
        crpFactory: crpFactory.address,
        balancerFactory: balancerFactory.address,
      })) as RedeemableERC20PoolFactory;
    await redeemableERC20PoolFactory.deployed();

    console.log("redeemableERC20PoolFactory deployed to: " + redeemableERC20PoolFactory.address)
  
    const seedERC20FactoryFactory = await ethers.getContractFactory(
      "SeedERC20Factory"
    );
    const seedERC20Factory =
      (await seedERC20FactoryFactory.deploy()) as SeedERC20Factory;
    await seedERC20Factory.deployed();

    console.log("seedERC20Factory deployed to: " + seedERC20Factory.address)
  
    const trustFactoryFactory = await ethers.getContractFactory("TrustFactory");
    const trustFactory = (await trustFactoryFactory.deploy({
      redeemableERC20Factory: redeemableERC20Factory.address,
      redeemableERC20PoolFactory: redeemableERC20PoolFactory.address,
      seedERC20Factory: seedERC20Factory.address,
    })) as TrustFactory;
    await trustFactory.deployed();
  
    return {
      redeemableERC20Factory,
      redeemableERC20PoolFactory,
      seedERC20Factory,
      trustFactory,
    };
  };