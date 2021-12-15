import hre, { ethers } from "hardhat";
import * as path from "path";
import fs from "fs";

import ConfigurableRightsPoolJson from "@beehiveinnovation/configurable-rights-pool/artifacts/ConfigurableRightsPool.json";
import BPoolJson from "@beehiveinnovation/configurable-rights-pool/artifacts/BPool.json";
import TrustJson from "../dist/artifacts/contracts/trust/Trust.sol/Trust.json";

import type { Trust } from "../dist/typechain/Trust";
import type { RedeemableERC20Pool } from "../dist/typechain/RedeemableERC20Pool";
import type { ConfigurableRightsPool } from "../dist/typechain/ConfigurableRightsPool";
import type { BPool } from "../dist/typechain/BPool";
const config = require("../deployment-config.json");
const bookAddresses = require("./Addresses.json");
const commit: any = process.env.COMMIT;
const BALANCER_NAMES = [
  "BFactory",
  "SmartPoolManager",
  "BalancerSafeMath",
  "RightsManager",
  "CRPFactory",
];

export const eighteenZeros = "000000000000000000";
export const sixZeros = "000000";

export const checkNetwork = async () => {
  let network: any;
  try {
    network = await ethers.provider.getNetwork();
  } catch (error) {
    try {
      network = await (await hre.reef.getProvider()).getNetwork();
    } catch (error) {
      console.error(error);
    }
  }
  return network;
};

export const getSigner = async (): Promise<any> => {
  const network = await checkNetwork();
  try {
    const signers =
      network.name !== "reef"
        ? await hre.ethers.getSigners()
        : await hre.reef.getSigners();
    return signers;
  } catch (error) {
    console.error(error);
  }
};

const checkContract = async (
  contractName: string,
  networkName: string
): Promise<string> => {
  if (
    config.network[networkName] &&
    config.network[networkName][contractName]
  ) {
    return config.network[networkName][contractName];
  } else if (
    bookAddresses[commit] &&
    bookAddresses[commit][networkName] &&
    bookAddresses[commit][networkName][contractName]
  ) {
    return bookAddresses[commit][networkName][contractName];
  } else {
    return "";
  }
};

const writeAddress = async (
  address: string,
  contractName: string,
  networkName: string
) => {
  let pathTo, content;
  if (BALANCER_NAMES.includes(contractName)) {
    pathTo = path.resolve(__dirname, "../deployment-config.json");
    content = fs.existsSync(pathTo) ? fetchFile(pathTo) : {};
    if (!Object.prototype.hasOwnProperty.call(content.network, networkName)) {
      content.network[networkName] = {};
    }
    if (
      !Object.prototype.hasOwnProperty.call(
        content.network[networkName],
        networkName
      )
    ) {
      content.network[networkName][contractName] = {};
    }
    content.network[networkName][contractName] = address;
  } else {
    pathTo = path.join(__dirname, "Addresses.json");
    content = fs.existsSync(pathTo) ? fetchFile(pathTo) : {};
    if (!Object.prototype.hasOwnProperty.call(content, commit)) {
      content[commit] = {};
    }
    if (!Object.prototype.hasOwnProperty.call(content[commit], networkName)) {
      content[commit][networkName] = {};
    }
    if (
      !Object.prototype.hasOwnProperty.call(
        content[commit][networkName],
        contractName
      )
    ) {
      content[commit][networkName][contractName] = {};
    }
    content[commit][networkName][contractName] = address;
  }
  writeFile(pathTo, JSON.stringify(content, null, 4));
};

export const deploy = async (
  artifact: any,
  signer: any,
  argmts: any[] | any
) => {
  const networkName = hre.network.name ? hre.network.name : "networkName";
  const address = await checkContract(artifact.contractName, networkName);
  if (address) {
    return address;
  } else {
    const iface = new hre.ethers.utils.Interface(artifact.abi);
    const factory = new hre.ethers.ContractFactory(
      iface,
      artifact.bytecode,
      signer
    );
    const overrides =
      (await checkNetwork()).name !== "reef" ? config.deploy_config : {};
    const contract = await factory.deploy(...argmts, overrides);
    if (config.show_tx) {
      console.log("Nonce:", contract.deployTransaction.nonce);
      console.log("Tx hash:", contract.deployTransaction.hash);
    }
    await contract.deployTransaction.wait();
    await writeAddress(contract.address, artifact.contractName, networkName);
    return contract.address;
  }
};

export const linkBytecode = (bytecode: any, links: any) => {
  Object.keys(links).forEach((library_name) => {
    const library_address = links[library_name];
    const regex = new RegExp(`__${library_name}_+`, "g");

    bytecode = bytecode.replace(regex, library_address.replace("0x", ""));
  });
  return bytecode;
};

export const exportArgs = (artifact: any, args: string[], deployId: string) => {
  let pathTo = path.join(__dirname, "verification", deployId);
  checkPath(pathTo);
  pathTo = path.join(pathTo, "arguments.json");
  const content = fs.existsSync(pathTo) ? fetchFile(pathTo) : {};
  const TwelveBytes = "000000000000000000000000";
  const encodeABIArgs = args.reduce((prev, current) => {
    return prev + TwelveBytes + current.replace("0x", "");
  }, "");
  content[artifact.contractName] = encodeABIArgs;
  writeFile(pathTo, JSON.stringify(content, null, 4));
};

export const getDeployID = async () => {
  const networkName = hre.network.name ? hre.network.name : "networkName";
  const date = new Date(Date.now())
    .toLocaleString("en-GB", { timeStyle: "medium", dateStyle: "medium" })
    .replace(", ", "-")
    .replace(/ /g, "")
    .replace(/:/g, "");
  return `${networkName}-${date}`;
};

const fetchFile = (_path: string) => {
  try {
    return JSON.parse(fs.readFileSync(_path).toString());
  } catch (error) {
    console.log(error);
    return {};
  }
};

const writeFile = (_path: string, file: any) => {
  try {
    fs.writeFileSync(_path, file);
  } catch (error) {
    console.log(error);
  }
};

const checkPath = (_path: string) => {
  if (!fs.existsSync(_path)) {
    try {
      fs.mkdirSync(_path);
    } catch (error) {
      console.log(error);
    }
  }
};

export const trustDeploy = async (
  trustFactory: any,
  creator: any,
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
            x.event === "NewContract" &&
            hre.ethers.utils.getAddress(x.address) ===
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
  pool: RedeemableERC20Pool
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

export function timeout(ms: any) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const waitForBlock = async (
  blockNumber: any,
  networkInfo: any
): Promise<any> => {
  const currentBlock = await getActualBlock(networkInfo);

  if (currentBlock >= blockNumber) {
    return;
  }

  console.log({
    currentBlock,
    awaitingBlock: blockNumber,
  });

  await timeout(2000);

  return await waitForBlock(blockNumber, networkInfo);
};

export const getContract = async (
  address: string,
  abi: any,
  signer: any,
  networkInfo: any
) => {
  if (networkInfo.name !== "reef") {
    return new hre.ethers.Contract(address, abi, signer);
  } else {
    return hre.reef.getContractAt(abi, address, signer);
  }
};

export const getActualBlock = async (networkInfo?: any): Promise<number> => {
  if (networkInfo) {
    return networkInfo.name !== "reef"
      ? await hre.ethers.provider.getBlockNumber()
      : await (await hre.reef.getProvider()).getBlockNumber();
  } else {
    return await getActualBlock(await checkNetwork());
  }
};
