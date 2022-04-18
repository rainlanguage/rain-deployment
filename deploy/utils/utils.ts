/* eslint-disable @typescript-eslint/no-explicit-any*/
import * as path from "path";
import fs, { promises as fsPromises } from "fs";
import fse from "fs-extra";
import hre, { artifacts, ethers } from "hardhat";

import type { BigNumber } from "ethers";
import type { Artifact, CompilerOutputContract } from "hardhat/types";
import { FeeData } from "@ethersproject/abstract-provider";

import deployConfig from "../../deployment-config.json";

export const networkName = hre.network.name;
const commit: string = process.env.COMMIT;
const ZERO_BN = ethers.constants.Zero;

const deploymentsPath = path.resolve(__dirname, "../../deployments");
if (!fs.existsSync(`${deploymentsPath}/${commit}`)) {
  fs.mkdirSync(`${deploymentsPath}/${commit}`, { recursive: true });
}

export interface BasicArtifact extends Partial<Artifact> {
  contractName: string;
  abi: any[];
  bytecode: string;
  metadata?: string;
  devdoc?: any;
  userdoc?: any;
}

export interface OutputContract extends CompilerOutputContract {
  metadata?: string;
  userdoc?: any;
  devdoc?: any;
}

export interface DeployOptions {
  contract?: BasicArtifact;
  args: any[];
  from: string;
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

export enum EstimationLevel {
  LOW, // Will use a -10% of current market value
  MARKET, // Will use the current market value
  AGGRESSIVE, // Will use a +10% of current market value
}

export async function deployContract(
  contractName: string,
  options: DeployOptions
): Promise<DeployResult> {
  const { deployments } = hre;
  const { deploy } = deployments;

  const estimation = deployConfig.estimationLevel.toLowerCase();

  // By Default use the market
  let estimationLevel = EstimationLevel.MARKET;
  if (estimation === "low") {
    estimationLevel = EstimationLevel.LOW;
  }
  if (estimation === "aggressive") {
    estimationLevel = EstimationLevel.AGGRESSIVE;
  }

  const feeCalculated = await estimateGasFee(estimationLevel);
  if (!options.gasPrice) {
    options.gasPrice = feeCalculated.gasPrice;
  }
  if (!options.maxFeePerGas) {
    options.maxFeePerGas = feeCalculated.maxFeePerGas;
  }
  if (!options.maxPriorityFeePerGas) {
    options.maxPriorityFeePerGas = feeCalculated.maxPriorityFeePerGas;
  }

  const result = await deploy(contractName, options);
  return result;
}

/**
 * Convert all the BigNumbers values that exist in an Object to string .
 * @param obj The object that contain BigNumbers
 */
export const flattenBigNumbers = (obj: unknown): void => {
  Object.keys(obj).forEach((key) => {
    if (ethers.BigNumber.isBigNumber(obj[key])) {
      obj[key] = obj[key].toString();
    }
  });
};

/**
 * Estimate the gas that will be use to deploy the contract.
 * The contract provided could be a artifact or a contract
 * name that will be searched with Hardhat.
 * @param contract The contract that will be deployed.
 * @param args The arguments necessaries to deploy
 * @returns The gas estimation
 */
export const estimateGasDeploy = async (
  contract: string | Artifact | BasicArtifact,
  args: any[] = []
): Promise<BigNumber> => {
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
};

/**
 * Estimate the price/fee about gas necessary to send the transaction/deploy. This fetch an amount of
 * `txsTofetch` which will be use to calculate a best average in wei. With a `estimationLevel` can permite to
 * set a higher or lower price/fee.
 * If the network support EIP-1559, will ignore the gasPrice
 * @param estimationLevel The estimation level to send the transaction. Could be Low(1), Market(2) or Aggressive(3)
 * @param txsTofetch The amount of transactions to fetch to estimate, by default is 10. A higher number will provide
 * a best estimation, but also will take more time to calculate. Min is 1 and max is 20 for safety
 * @returns And object with all the information in wei. If the network support EIP-1559, gasPrice will be empty/undefined
 */
export const estimateGasFee = async (
  estimationLevel: EstimationLevel,
  txsTofetch = 10
): Promise<FeeData> => {
  /*
   ** If `maxFeePerGas` exist in the response, then the network have EIP-1559 Transaction Support
   **  - NetworkType = 0 - Have not EIP-1559 Transaction Support
   **  - NetworkType = 2 - Have EIP-1559 Transaction Support
   */
  const networkType = (await ethers.provider.getFeeData()).maxFeePerGas ? 2 : 0;
  const values: FeeData[] = [];
  txsTofetch = txsTofetch < 1 ? 1 : txsTofetch > 20 ? 20 : txsTofetch;
  ``;
  for (let i = 1; i <= txsTofetch; i++) {
    const txArray = (await ethers.provider.getBlockWithTransactions(-i))
      .transactions;

    let counter = 0;

    const vals = {
      gasPrice: undefined,
      maxPriorityFeePerGas: undefined,
      maxFeePerGas: undefined,
    };
    txArray.forEach((transactionInfo) => {
      // Only fill gasPrice if network type 0
      if (networkType == 0 && transactionInfo.type == 0) {
        const gasPrice = ethers.BigNumber.isBigNumber(vals.gasPrice)
          ? vals.gasPrice.add(transactionInfo.gasPrice)
          : transactionInfo.gasPrice;

        vals.gasPrice = gasPrice;
        counter++;
      }

      // Only fill maxPriorityFeePerGas and  maxFeePerGas if network type 2
      if (networkType == 2 && transactionInfo.type == 2) {
        const priorFee = ethers.BigNumber.isBigNumber(vals.maxPriorityFeePerGas)
          ? vals.maxPriorityFeePerGas.add(transactionInfo.maxPriorityFeePerGas)
          : transactionInfo.maxPriorityFeePerGas;

        const maxFee = ethers.BigNumber.isBigNumber(vals.maxFeePerGas)
          ? vals.maxFeePerGas.add(transactionInfo.maxFeePerGas)
          : transactionInfo.maxFeePerGas;

        vals.maxPriorityFeePerGas = priorFee;
        vals.maxFeePerGas = maxFee;
        counter++;
      }
    });

    if (vals.gasPrice) {
      vals.gasPrice = vals.gasPrice.div(counter);
    }

    if (vals.maxPriorityFeePerGas) {
      vals.maxPriorityFeePerGas = vals.maxPriorityFeePerGas.div(counter);
    }

    if (vals.maxFeePerGas) {
      vals.maxFeePerGas = vals.maxFeePerGas.div(counter);
    }

    values.push(vals);
  }

  const result = values.reduce(
    (prev, curr) => {
      return {
        gasPrice: ethers.BigNumber.isBigNumber(curr.gasPrice)
          ? prev.gasPrice.add(curr.gasPrice)
          : ZERO_BN,
        maxFeePerGas: ethers.BigNumber.isBigNumber(curr.maxFeePerGas)
          ? prev.maxFeePerGas.add(curr.maxFeePerGas)
          : ZERO_BN,
        maxPriorityFeePerGas: ethers.BigNumber.isBigNumber(
          curr.maxPriorityFeePerGas
        )
          ? prev.maxPriorityFeePerGas.add(curr.maxPriorityFeePerGas)
          : ZERO_BN,
      };
    },
    {
      gasPrice: ZERO_BN,
      maxPriorityFeePerGas: ZERO_BN,
      maxFeePerGas: ZERO_BN,
    }
  );

  let multiplierLevel: number;
  if (estimationLevel == EstimationLevel.LOW) {
    multiplierLevel = 90;
  } else if (estimationLevel == EstimationLevel.MARKET) {
    multiplierLevel = 100;
  } else {
    multiplierLevel = 110;
  }

  // TODO: Maybe add a field, so someone can set a MAX value on that attribute that the user is willing to spend ???
  Object.keys(result).forEach((key) => {
    if (ethers.BigNumber.isBigNumber(result[key])) {
      if (result[key].eq(ZERO_BN)) {
        result[key] = undefined;
      } else {
        const prom = result[key].div(txsTofetch);
        result[key] = prom.mul(multiplierLevel).div(100);
      }
    }
  });

  return result;
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
 * Read a file that contain a DeployResult
 * @param _path Path of the DeployResult file
 * @returns The DeployResult
 */
export const fetchFile = (_path: string): DeployResult => {
  try {
    return JSON.parse(fs.readFileSync(_path).toString());
  } catch (error) {
    console.log(error);
  }
};

/**
 * Save the address that were deployed and created/copy to correct commit folder.
 * Avoid to save/generate to localhost network
 */
export const save = async (): Promise<void> => {
  if (networkName !== "localhost") {
    await saveListAddresses();
    copyDeployFolder();
  }
};

const copyDeployFolder = (): void => {
  const srcDir = deploymentsPath + `/${networkName}`;
  const destDir = deploymentsPath + `/${commit}/${networkName}`;

  // To copy a folder or file
  fse.copySync(srcDir, destDir, { overwrite: true }, function (err) {
    if (err) {
      console.log(err);
    }
  });
  console.log(`Save it to:  "${destDir}"`);

  fs.rmSync(srcDir, { recursive: true, force: true });
};

const saveListAddresses = async (): Promise<void> => {
  const getListDir = async (folderPath: string): Promise<string[]> => {
    try {
      const listFiles = await fsPromises.readdir(folderPath);
      const regex = new RegExp(/.*\.json$|.*\.JSON$/);
      return listFiles.filter((ele) => regex.test(ele));
    } catch (err) {
      console.error("Error occured while reading directory!", err);
    }
  };

  const folderPath = deploymentsPath + `/${networkName}`;
  const regexReplace = new RegExp(/.json$|.JSON$/);
  const files = await getListDir(folderPath);
  const pathTo = `${folderPath}/addresses.json`;
  const result = fs.existsSync(pathTo) ? fetchFile(pathTo) : {};

  for (let i = 0; i < files.length; i++) {
    const pathFile = path.resolve(folderPath, files[i]);
    const deployFile = fetchFile(pathFile);
    const name = `${files[i].replace(regexReplace, "")}`;
    result[`${name}`] = deployFile.address;
    result[`${name}Block`] = deployFile.receipt.blockNumber;
  }
  writeFile(pathTo, JSON.stringify(result, null, 4));
};

/**
 * Assign a value to an object taking in count nested properties
 * @param obj Object to assign the value
 * @param keyPath The keys or propertiers names to access
 * @param value Value to assign
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const assignValue = (obj: any, keyPath: string[], value: any) => {
  const lastKeyIndex = keyPath.length - 1;
  for (let i = 0; i < lastKeyIndex; i++) {
    const key = keyPath[i];
    if (!(key in obj)) {
      obj[key] = {};
    }
    obj = obj[key];
  }
  obj[keyPath[lastKeyIndex]] = value;
};
