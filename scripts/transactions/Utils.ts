import { ethers, artifacts } from "hardhat";

import ConfigurableRightsPoolJson from "@beehiveinnovation/configurable-rights-pool/artifacts/ConfigurableRightsPool.json";
import BPoolJson from "@beehiveinnovation/configurable-rights-pool/artifacts/BPool.json";
// import TrustJson from "@beehiveinnovation/rain-protocol/dist/e07af1be5703ebddd8faf546df1e98f23164c253/artifacts/contracts/trust/Trust.sol/Trust.json";
import TrustJson from "../../dist/artifacts/contracts/trust/Trust.sol/Trust.json";

// import type { Trust } from "@beehiveinnovation/rain-protocol/dist/e07af1be5703ebddd8faf546df1e98f23164c253/typechain/Trust";
// import type { RedeemableERC20Pool } from "@beehiveinnovation/rain-protocol/dist/e07af1be5703ebddd8faf546df1e98f23164c253/RedeemableERC20Pool";
// import type { ConfigurableRightsPool } from "@beehiveinnovation/rain-protocol/dist/e07af1be5703ebddd8faf546df1e98f23164c253/ConfigurableRightsPool";
// import type { BPool } from "@beehiveinnovation/rain-protocol/dist/e07af1be5703ebddd8faf546df1e98f23164c253/BPool";
import type { Trust } from "../../dist/typechain/Trust";
import type { RedeemableERC20Pool } from "../../dist/typechain/RedeemableERC20Pool";
import type { ConfigurableRightsPool } from "../../dist/typechain/ConfigurableRightsPool";
import type { BPool } from "../../dist/typechain/BPool";

export enum Tier {
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

export const eighteenZeros = "000000000000000000";
export const sixZeros = "000000";

export async function deploy(artifact:any, signer:any, argmts:any[]) {
  const iface = new ethers.utils.Interface(artifact.abi)
  const factory = new ethers.ContractFactory(iface, artifact.bytecode, signer)
  const contract = await factory.deploy(...argmts)
  await contract.deployTransaction.wait()
  return contract.address
}

export const trustDeploy = async (
  trustFactory: any,
  creator: any,
  ...args: any
) => {
  const tx = await trustFactory[
    "createChild((address,uint256,address,uint256,uint16,uint16,uint256),(string,string,address,uint8,uint256),(address,uint256,uint256,uint256,uint256))"
  ](...args);
  const receipt = await tx.wait();

  // Getting the address, and get the contract abstraction
  const trust = new ethers.Contract(
    ethers.utils.hexZeroPad(
      ethers.utils.hexStripZeros(
        receipt.events?.filter(
          (x: any) =>
            x.event == "NewContract" &&
            ethers.utils.getAddress(x.address) ==
              ethers.utils.getAddress(trustFactory.address)
        )[0].topics[1]
      ),
      20 // address bytes length
    ),
    TrustJson.abi,
    creator
  ) as Trust;

  if (!ethers.utils.isAddress(trust.address)) {
    throw new Error(
      `invalid trust address: ${trust.address} (${trust.address.length} chars)`
    );
  }

  await trust.deployed();

  return trust;
};

export const poolContracts = async (
  signers: any,
  pool: RedeemableERC20Pool
): Promise<[ConfigurableRightsPool, BPool]> => {
  const crp = new ethers.Contract(
    await pool.crp(),
    ConfigurableRightsPoolJson.abi,
    signers[0]
  ) as ConfigurableRightsPool;
  const bPool = new ethers.Contract(
    await crp.bPool(),
    BPoolJson.abi,
    signers[0]
  ) as BPool;
  return [crp, bPool];
};
function timeout(ms:any) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const waitForBlock = async (blockNumber:any): Promise<any> => {
  const currentBlock = await ethers.provider.getBlockNumber();

  if (currentBlock >= blockNumber) {
    return;
  }

  console.log({
    currentBlock,
    awaitingBlock: blockNumber,
  });

  await timeout(2000);

  return await waitForBlock(blockNumber);
};