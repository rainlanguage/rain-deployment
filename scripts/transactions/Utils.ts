import { ethers, artifacts } from "hardhat";
import type { Trust } from "../dist/typechains/Trust";
import TrustJson from "../dist/artifact/contracts/rain-protocol/contracts/trust/Trust.sol/Trust.json";
import ConfigurableRightsPoolJson from "../dist/artifact/contracts/configurable-rights-pool/contracts/ConfigurableRightsPool.sol/ConfigurableRightsPool.json";
import BPoolJson from "../dist/artifact/contracts/configurable-rights-pool/contracts/test/BPool.sol/BPool.json";
import type { RedeemableERC20Pool } from "../dist/typechains/RedeemableERC20Pool";
import type { ConfigurableRightsPool } from "../dist/typechains/ConfigurableRightsPool";
import type { BPool } from "../dist/typechains/BPool";

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