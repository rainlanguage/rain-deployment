const fs = require('fs');

import ConfigurableRightsPoolJson from "@beehiveinnovation/configurable-rights-pool/artifacts/ConfigurableRightsPool.json";
import BPoolJson from "@beehiveinnovation/configurable-rights-pool/artifacts/BPool.json";
import TrustJson from "../../dist/artifacts/contracts/trust/Trust.sol/Trust.json";

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

export const checkNetwork = async (hre:any) => {
    let network:any;
        try {
            network =  await hre.ethers.provider.getNetwork();
        } catch (error) {
            try {
                network =  await (await hre.reef.getProvider()).getNetwork();
            } catch (error) {
                console.error(error);
            }
        }
    return network;
};

export const getSigner = async (hre:any) => {
    const network = await checkNetwork(hre);
    let signers;
    try {
        signers =  network.name != "reef" ? 
            await hre.ethers.getSigners() : await hre.reef.getSigners();
    } catch (error) {
        console.error(error);
    }
    return signers;
};

export const deploy = async (artifact:any, signer:any, argmts:any[] | any, hre:any) => {
    const iface = new hre.ethers.utils.Interface(artifact.abi)
    const factory = new hre.ethers.ContractFactory(iface, artifact.bytecode, signer)
    const overrides = {
        nonce: 20,
        gasPrice: hre.ethers.BigNumber.from("75000000000"),
        gasLimit: hre.ethers.BigNumber.from("20000000")
    };

    const contract = await factory.deploy(...argmts);

    // console.log(contract.deployTransaction)
    await contract.deployTransaction.wait()
    return contract.address
}

export const linkBytecode = (bytecode:any, links:any) => {
    Object.keys(links).forEach(library_name => {
      const library_address = links[library_name];
      const regex = new RegExp(`__${library_name}_+`, "g");

      bytecode = bytecode.replace(regex, library_address.replace("0x", ""));
    });
    return bytecode;
}

export const exportArgs = (artifact:any, args:string[], deployId:string) => {
    const dirname = __dirname.replace("/hardhat-tasks", "");
    let pathTo = `${dirname}/verification/${deployId}`;
    checkPath(pathTo);
    pathTo = `${pathTo}/arguments.json`;
    const content = fs.existsSync(pathTo) ? fetchFile(pathTo) : {};
    const TwelveBytes = "000000000000000000000000";
    const encodeABIArgs = args.reduce((prev, current) => {
      return prev + TwelveBytes + current.replace("0x", "");
    }, "");
    content[artifact.contractName] = encodeABIArgs;
    writeFile(pathTo, JSON.stringify(content, null, 4));
  }

export const getDeployID = async(hre:any) => {
    const networkName= hre.network.name ? hre.network.name : "networkName";
    const date = new Date(Date.now())
        .toLocaleString('en-GB', {timeStyle:"medium", dateStyle:"medium"})
        .replace(", ","-").replace(/ /g, "").replace(/:/g, "");
    return `${networkName}-${date}`;
}

const fetchFile = (_path:string) => {
    try {
        return JSON.parse(fs.readFileSync(_path).toString())
    } catch (error) {
        console.log(error)
        return {}
    }
}

const writeFile = (_path:string, file:any) => {
    try {
        fs.writeFileSync(_path, file);
    } catch (error) {
        console.log(error)
    }
}

const checkPath = (_path:string) => {
    if(!fs.existsSync(_path)) {
        try {
        fs.mkdirSync(_path);
        } catch (error) {
        console.log(error)
        }
    }
}

export const trustDeploy = async (
    trustFactory: any,
    creator: any,
    hre:any,
    ...args: any
  ) => {
    const tx = await trustFactory[
      // "createChild((address,uint256,address,uint256,uint16,uint16,uint256),(string,string,address,uint8,uint256),(address,uint256,uint256,uint256,uint256))"
      "createChild((address,uint256,address,uint256,uint16,uint16,uint256,(string,string)),((string,string),address,uint8,uint256),(address,uint256,uint256,uint256,uint256))"
    ](...args);
    const receipt = await tx.wait();
  
    // Getting the address, and get the contract abstraction
    const trust = new hre.ethers.Contract(
      hre.ethers.utils.hexZeroPad(
        hre.ethers.utils.hexStripZeros(
          receipt.events?.filter(
            (x: any) =>
              x.event == "NewContract" &&
              hre.ethers.utils.getAddress(x.address) ==
                hre.ethers.utils.getAddress(trustFactory.address)
          )[0].topics[1]
        ),
        20 // address bytes length
      ),
      TrustJson.abi,
      creator
    ) as Trust;
  
    if (!hre.ethers.utils.isAddress(trust.address)) {
      throw new Error(
        `invalid trust address: ${trust.address} (${trust.address.length} chars)`
      );
    }
  
    await trust.deployed();
  
    return trust;
  };

export const poolContracts = async (
    signers: any,
    pool: RedeemableERC20Pool,
    hre: any
    ): Promise<[ConfigurableRightsPool, BPool]> => {
    const crp = new hre.ethers.Contract(
        await pool.crp(),
        ConfigurableRightsPoolJson.abi,
        signers[0]
    ) as ConfigurableRightsPool;
    const bPool = new hre.ethers.Contract(
        await crp.bPool(),
        BPoolJson.abi,
        signers[0]
    ) as BPool;
    return [crp, bPool];
};

export function timeout(ms:any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
  
export const waitForBlock = async (blockNumber:any, networkInfo:any, hre:any): Promise<any> => {
    const currentBlock = await getActualBlock(networkInfo, hre);

    if (currentBlock >= blockNumber) {
        return;
    }

    console.log({
        currentBlock,
        awaitingBlock: blockNumber,
    });

    await timeout(2000);

    return await waitForBlock(blockNumber, networkInfo, hre);
};

export const getContract = async (address:string, abi:any, signer:any, networkInfo:any, hre:any) => {
    if (networkInfo.name != "reef") {
        return new hre.ethers.Contract( address , abi , signer);
    } else {
        return hre.reef.getContractAt(abi, address, signer);
    }
}

export const getActualBlock = async (networkInfo:any, hre:any) => {
    return networkInfo.name != "reef" ? 
      await hre.ethers.provider.getBlockNumber() : await (await hre.reef.getProvider()).getBlockNumber();
};