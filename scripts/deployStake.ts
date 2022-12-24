import { artifacts, ethers } from "hardhat";

import {
  max_uint256,
  op,
  Opcode,
  memoryOperand,
  MemoryType,
  max_uint16,
  getEventArgs,
} from "./utils";

import {
  StakeConfigStruct,
  StakeFactory,
} from "../typechain/contracts/stake/StakeFactory";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Overrides } from "ethers";
import { ReserveToken, Stake } from "../typechain";

// ****NOTE: This addressess will be used
const _stakeFactory = "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1";
const _interpreter = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
const _expressionDeployer = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";
const _token = "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c";

const stakeDeploy = async (
  deployer: SignerWithAddress,
  stakeFactory: StakeFactory,
  stakeConfigStruct: StakeConfigStruct,
  ...args: Overrides[]
): Promise<Stake> => {
  const txDeploy = await stakeFactory.createChildTyped(
    stakeConfigStruct,
    ...args
  );

  const stake = new ethers.Contract(
    ethers.utils.hexZeroPad(
      ethers.utils.hexStripZeros(
        (await getEventArgs(txDeploy, "NewChild", stakeFactory)).child
      ),
      20 // address bytes length
    ),
    (await artifacts.readArtifact("Stake")).abi,
    deployer
  ) as Stake;

  await stake.deployed();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  stake.deployTransaction = txDeploy;

  return stake;
};

const main = async function () {
  const signers = await ethers.getSigners();
  const deployer = signers[0];

  const stakeFactory = (await ethers.getContractAt(
    "StakeFactory",
    _stakeFactory
  )) as StakeFactory;

  const token = (await ethers.getContractAt(
    "ReserveToken",
    _token
  )) as ReserveToken;

  const constants = [max_uint256, max_uint16];

  const max_deposit = op(
    Opcode.READ_MEMORY,
    memoryOperand(MemoryType.Constant, 0)
  );
  const max_withdraw = op(
    Opcode.READ_MEMORY,
    memoryOperand(MemoryType.Constant, 1)
  );

  const source = [max_deposit, max_withdraw];

  const stakeConfigStruct: StakeConfigStruct = {
    name: "Stake Token",
    symbol: "STKN",
    asset: token.address,
    expressionDeployer: _expressionDeployer,
    interpreter: _interpreter,
    stateConfig: {
      sources: source,
      constants: constants,
    },
  };

  const stake = await stakeDeploy(deployer, stakeFactory, stakeConfigStruct);

  console.log("Token address: ", token.address);
  console.log("stake address: ", stake.address);
};

main()
  .then(() => {
    const exit = process.exit;
    exit(0);
  })
  .catch((error) => {
    console.error(error);
    const exit = process.exit;
    exit(1);
  });
