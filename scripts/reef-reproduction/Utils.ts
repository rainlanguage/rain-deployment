import { ethers } from "hardhat";
import type { Trust } from "../dist/typechain/Trust";
import TrustJson from "../dist/artifacts/contracts/rain-protocol/contracts/trust/Trust.sol/Trust.json"

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

export const trustDeploy = async (
    trustFactory: any,
    creator: any,
    ...args:any
  ) => {
    const tx = await trustFactory[
      "createChild((address,uint256,address,uint256,uint16,uint16,uint256),(string,string,address,uint8,uint256),(address,uint256,uint256,uint256,uint256))"
    ](...args);
    const receipt = await tx.wait();
  
    const trust = new ethers.Contract(
      ethers.utils.hexZeroPad(
        ethers.utils.hexStripZeros(
          receipt.events?.filter(
            (x:any) => x.event == "NewContract" && x.address == trustFactory.address
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