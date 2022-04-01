/* eslint-disable @typescript-eslint/no-explicit-any*/
import hre, { artifacts } from "hardhat";
import * as ethers from "ethers";
import * as path from "path";
import fs from "fs";

import type { Artifact, CompilerOutputContract } from "hardhat/types";
import { ContractFactory, PayableOverrides } from "@ethersproject/contracts";

import type { Contract, BigNumber } from "ethers";
import type { EthersSigner } from "@reef-defi/hardhat-reef/src/proxies/signers/EthersSigner";

const deploymentsPath = path.resolve(__dirname, "../../deployments");

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

/**
 * Deploy a contract to the Reef network
 * @param name Name of contract to be deployed
 * @param options Deployment options and configuration
 * @returns The deployment result
 */
export async function deploy(
  name: string,
  options: DeployOptions
): Promise<DeployResult> {
  const signer = options.from;

  const overrides: PayableOverrides = {
    gasLimit: options.gasLimit,
    gasPrice: options.gasPrice,
    maxFeePerGas: options.maxFeePerGas,
    maxPriorityFeePerGas: options.maxPriorityFeePerGas,
    value: options.value,
    nonce: options.nonce,
  };

  const { artifact, factory, args } = await getContract(name, options, signer);

  const contract = await factory.deploy(...args, overrides);

  const result = await saveContract(contract, args, artifact);

  return result;
}

/**
 * Estimate the gas that will be use to deploy the contract. This is the
 * reef function version. The contract provided could be a artifact or
 * a contract name that will be searched with Hardhat
 * @param contract The contract that will be deployed.
 * @param args The arguments necessaries to deploy
 * @returns The gas estimation
 */
export async function estimateGasDeploy(
  contract: string | BasicArtifact,
  args: any[] = []
): Promise<BigNumber> {
  let artifact: BasicArtifact;

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

  const unsignedTx = factory.getDeployTransaction(...args);

  const signer = (await hre.reef.getSigners())[0] as EthersSigner;

  return await signer.provider.estimateGas({
    from: await signer.getAddress(),
    data: unsignedTx.data,
  });
}

/**
 * Get a signer account with a Reef account but with a Ethers signer type. If a `nameAccount`
 * is provided, will return the signer with that name. The function automatically checks if
 * the signer is claimed, or claims it if not.
 * @param nameAccount The account name of a specific wallet to get as signer. If not provided
 * will get a the first one.
 * @param claimAccount Force the claimAccount call.
 * @returns A signer account ready to interact with ethers
 */
export async function getAccount(
  nameAccount?: string,
  claimAccount?: boolean
): Promise<EthersSigner> {
  const signer = nameAccount
    ? await hre.reef.getSignerByName(nameAccount)
    : (await hre.reef.getSigners())[0];

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const substAddress = signer._substrateAddress;
  const provider = await hre.reef.getProvider();
  const resp = await provider.api.query.evmAccounts.evmAddresses(substAddress);

  if (claimAccount || resp.toHex() === "0x") {
    await signer.claimDefaultAccount();
  }

  return signer as EthersSigner;
}

/**
 * Get the the artifact, factory and arguments of a contract depending
 * of a specific deploy options/configuration.
 * @param name The contract name
 * @param options The deployment options
 * @param signer The signer that will be connected to the contract factory
 * @returns The artifact, factory and arguments of the specific contract
 */
async function getContract(
  name: string,
  options: DeployOptions,
  signer: EthersSigner
): Promise<{
  artifact: BasicArtifact;
  factory: ContractFactory;
  args: any[];
}> {
  const artifact = options.contract
    ? options.contract
    : await artifacts.readArtifact(name);

  const factory = ContractFactory.fromSolidity(artifact).connect(signer);

  const args = options.args ? [...options.args] : [];
  const numArguments = factory.interface.deploy.inputs.length;
  if (args.length !== numArguments) {
    throw new Error(
      `expected ${numArguments} constructor arguments, got ${args.length}`
    );
  }

  return {
    artifact,
    factory,
    args,
  };
}

/**
 * Convert all the BigNumbers values that exist in an Object to string .
 * @param obj The object that contain BigNumbers
 */
function flattenBigNumbers(obj: unknown): void {
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

/**
 * Save the deployment contract information in local disk
 * @param contract The contract instance that was deployed
 * @param args The arguments used in the deployement
 * @param artifact The artifact of the contract deployed
 * @returns The deployment result with full information
 */
export async function saveContract(
  contract: Contract,
  args: any[] = [],
  artifact: BasicArtifact
): Promise<DeployResult> {
  const deployTx = contract.deployTransaction;
  const receipt = await deployTx.wait();

  flattenBigNumbers(deployTx);
  flattenBigNumbers(receipt);

  const result: DeployResult = {
    address: contract.address,
    abi: artifact.abi,
    transactionHash: deployTx.hash,
    receipt: receipt,
    args: args,
    numDeployments: 1,
    bytecode: artifact.bytecode,
    deployedBytecode: artifact.deployedBytecode,
  };

  await getExtendedInfo(result, artifact);

  const path = `${deploymentsPath}/${hre.network.name}`;
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }

  const pathFile = `${path}/${artifact.contractName}.json`;
  writeFile(pathFile, JSON.stringify(result, null, 2));

  return result;
}

/**
 * Get the full extended info of a contract using the hardhat enviroment
 * to save the major information posible about the deployment.
 * @param result The deploy result of the contract
 * @param artifact The artifact of the contrac that was the deployed
 */
async function getExtendedInfo(result: DeployResult, artifact: BasicArtifact) {
  const contractId = `:${artifact.contractName}`;
  const qualifiedName = (await artifacts.getAllFullyQualifiedNames()).find(
    (e) => e.includes(contractId)
  );
  const buildInfo = await artifacts.getBuildInfo(qualifiedName);
  const contractPath = qualifiedName.replace(contractId, "");
  const hhOutput: OutputContract =
    buildInfo.output.contracts[contractPath][artifact.contractName];

  result.metadata = artifact.metadata ? artifact.metadata : hhOutput.metadata;
  result.devdoc = artifact.devdoc ? artifact.devdoc : hhOutput.devdoc;
  result.userdoc = artifact.userdoc ? artifact.userdoc : hhOutput.userdoc;
}
