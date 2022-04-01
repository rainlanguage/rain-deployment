/* eslint-disable @typescript-eslint/no-explicit-any*/
import * as path from "path";
import fs from "fs";
import { artifacts, ethers } from "hardhat";

import type { Contract, BigNumber } from "ethers";
import type { Artifact, CompilerOutputContract } from "hardhat/types";
import type { EthersSigner } from "@reef-defi/hardhat-reef/src/proxies/signers/EthersSigner";

export interface BasicArtifact extends Partial<Artifact> {
  contractName: string;
  abi: any[];
  bytecode: string;
  metadata?: string;
  devdoc?: any;
  userdoc?: any;
}

export interface CRPLibraries {
  [key: string]: string;
  SmartPoolManager: string;
  BalancerSafeMath: string;
  RightsManager: string;
}

export interface OutputContract extends CompilerOutputContract {
  metadata?: string;
  userdoc?: any;
  devdoc?: any;
}

export interface DeployOptions {
  contract?: BasicArtifact;
  args: any[];
  from: EthersSigner;
  gasLimit?: string | number | BigNumber;
  gasPrice?: string | BigNumber;
  maxFeePerGas?: string | BigNumber;
  maxPriorityFeePerGas?: string | BigNumber;
  value?: string | BigNumber;
  nonce?: string | number | BigNumber;
  to?: string;
  data?: string;
  waitConfirmations?: number;
}

export interface DeployResult {
  address: string;
  abi: any[];
  transactionHash?: string;
  receipt?: Receipt;
  history?: DeployResult[];
  numDeployments?: number;
  args?: any[];
  metadata?: string;
  bytecode?: string;
  deployedBytecode?: string;
  userdoc?: any;
  devdoc?: any;
}

export type Receipt = {
  from: string;
  transactionHash: string;
  blockHash: string;
  blockNumber: number;
  transactionIndex: number;
  cumulativeGasUsed: BigNumber | string | number;
  gasUsed: BigNumber | string | number;
  contractAddress?: string;
  to?: string;
  logs?: Log[];
  events?: any[];
  logsBloom?: string;
  byzantium?: boolean;
  status?: number;
  confirmations?: number;
};

export type Log = {
  blockNumber: number;
  blockHash: string;
  transactionHash: string;
  transactionIndex: number;
  logIndex: number;
  removed: boolean;
  address: string;
  topics: string[];
  data: string;
};

// TODO: Create function to get Input compiler description JSON
// eslint-disable-next-line
async function getSolt(artifact: BasicArtifact) {
  // const aver = await artifacts.getBuildInfo("@beehiveinnovation/balancer-core/contracts/BFactory.sol:BFactory");
  const aver = await artifacts.getBuildInfo(
    "contracts/trust/TrustFactory.sol:TrustFactory"
  );
  const input = aver.input;
  const ordered = Object.keys(input.sources)
    .sort()
    .reduce((obj, key) => {
      obj[key] = input.sources[key];
      return obj;
    }, {});

  const pathFile = path.resolve(
    __dirname,
    `../reef/${artifact.contractName}.json`
  );
  // remove replacer
  const replacer = (key: string, value: unknown) => {
    return key === "data" ? undefined : value;
  };
  writeFile(pathFile, JSON.stringify(ordered, replacer, 2));
}

/**
 * Convert all the BigNumbers values that exist in an Object to string .
 * @param obj The object that contain BigNumbers
 */
export function flattenBigNumbers(obj: unknown): void {
  Object.keys(obj).forEach((key) => {
    if (ethers.BigNumber.isBigNumber(obj[key])) {
      obj[key] = obj[key].toString();
    }
  });
}

/**
 * Linking libraries to CRPFactory bytecode
 * @param artifact CRPFactory artifacts that contain the bytecode to link
 * @param links The libraries addresses to link
 * @returns The artifacts with the bytecode linked with libraries
 */
export const linkBytecode = (
  artifact: Artifact | BasicArtifact,
  links: CRPLibraries
): Artifact | BasicArtifact => {
  Object.keys(links).forEach((libraryName) => {
    const libraryAddress = links[libraryName];
    const regex = new RegExp(`__${libraryName}_+`, "g");
    artifact.bytecode = artifact.bytecode.replace(
      regex,
      libraryAddress.replace("0x", "")
    );
  });
  return artifact;
};

/**
 * Estimate the gas that will be use to deploy the contract.
 * The contract provided could be a artifact or a contract
 * name that will be searched with Hardhat.
 * @param contract The contract that will be deployed.
 * @param args The arguments necessaries to deploy
 * @returns The gas estimation
 */
export async function estimateGasDeploy(
  contract: string | Artifact | BasicArtifact,
  args: any[] = []
): Promise<BigNumber> {
  let artifact: Artifact | BasicArtifact;

  if (typeof contract === "string") {
    artifact = await artifacts.readArtifact(contract);
  } else {
    artifact = contract;
  }

  const iface = new ethers.utils.Interface(artifact.abi);
  const factory = new ethers.ContractFactory(iface, artifact.bytecode);

  const numArguments = factory.interface.deploy.inputs.length;
  if (args.length !== numArguments) {
    throw new Error(
      `expected ${numArguments} constructor arguments, got ${args.length}`
    );
  }

  const data = factory.getDeployTransaction(...args).data;

  return await ethers.provider.estimateGas({ data: data });
}

/**
 * Write a file
 * @param _path Location of the file
 * @param file The file
 */
export const writeFile = (
  _path: string,
  file: string | NodeJS.ArrayBufferView
): void => {
  try {
    fs.writeFileSync(_path, file);
  } catch (error) {
    console.log(error);
  }
};
