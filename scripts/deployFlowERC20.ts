import { artifacts, ethers } from "hardhat";
import { concat } from "ethers/lib/utils";

import {
  RAIN_FLOW_SENTINEL,
  RAIN_FLOW_ERC20_SENTINEL,
  op,
  Opcode,
  memoryOperand,
  MemoryType,
  getEventArgs,
} from "./utils";

import type { FlowERC20Config } from "./utils/types/flow";
import type { Overrides } from "ethers";

// Typechain
import type { FlowERC20Factory, FlowERC20 } from "../typechain";
import type {
  FlowERC20ConfigStruct,
  FlowERC20IOStruct,
  FlowTransferStruct,
} from "../typechain/contracts/flow/erc20/FlowERC20";

// ****NOTE: This addressess will be used
const _flowERC20Factory = "0x3C9A9f2b30ae4bCBAb558731280241De0f0c7Ca5";
const _interpreter = "0x3c0F6e4fB39Dffe64e4F2b1AeA3d5C28534f72DA";
const _expressionDeployer = "0x627B698a53551BC59041EE4d10E4D62FCf14E97D";

const YOU = () => op(Opcode.CONTEXT, 0x0000);

const flowERC20Deploy = async (
  flowERC20Config: FlowERC20Config,
  flowERC20Factory: FlowERC20Factory,
  expressionDeployer_: string,
  interpreter_: string,
  ...args: Overrides[]
): Promise<FlowERC20> => {
  const flowERC20ConfigStruct: FlowERC20ConfigStruct = {
    stateConfig: flowERC20Config.stateConfig,
    flowConfig: {
      expressionDeployer: expressionDeployer_,
      interpreter: interpreter_,
      flows: flowERC20Config.flows,
    },
    name: flowERC20Config.name,
    symbol: flowERC20Config.symbol,
  };

  const txDeploy = await flowERC20Factory.createChildTyped(
    flowERC20ConfigStruct,
    ...args
  );

  const flow = new ethers.Contract(
    ethers.utils.hexZeroPad(
      ethers.utils.hexStripZeros(
        (await getEventArgs(txDeploy, "NewChild", flowERC20Factory)).child
      ),
      20 // address bytes length
    ),
    (await artifacts.readArtifact("FlowERC20")).abi,
    flowERC20Factory.signer
  ) as FlowERC20;

  await flow.deployed();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  flow.deployTransaction = txDeploy;

  return flow;
};

const main = async function () {
  const signers = await ethers.getSigners();
  const you = signers[0];

  const flowERC20Factory = (await ethers.getContractAt(
    "FlowERC20Factory",
    _flowERC20Factory
  )) as FlowERC20Factory;

  const flowTransfer: FlowTransferStruct = {
    native: [],
    erc20: [],
    erc721: [],
    erc1155: [],
  };

  const flowERC20IO: FlowERC20IOStruct = {
    mints: [
      {
        account: you.address,
        amount: ethers.BigNumber.from(2),
      },
    ],
    burns: [
      {
        account: you.address,
        amount: ethers.BigNumber.from(0),
      },
    ],
    flow: flowTransfer,
  };

  const mint = flowERC20IO.mints[0].amount;
  const burn = flowERC20IO.burns[0].amount;

  const constantsCanTransfer = [
    RAIN_FLOW_SENTINEL,
    RAIN_FLOW_ERC20_SENTINEL,
    1,
    mint,
    burn,
    1,
  ];

  const constantsCannotTransfer = [
    RAIN_FLOW_SENTINEL,
    RAIN_FLOW_ERC20_SENTINEL,
    1,
    mint,
    burn,
    0,
  ];

  const SENTINEL = () =>
    op(Opcode.READ_MEMORY, memoryOperand(MemoryType.Constant, 0));
  const SENTINEL_ERC20 = () =>
    op(Opcode.READ_MEMORY, memoryOperand(MemoryType.Constant, 1));

  const MINT_AMOUNT = () =>
    op(Opcode.READ_MEMORY, memoryOperand(MemoryType.Constant, 3));
  const BURN_AMOUNT = () =>
    op(Opcode.READ_MEMORY, memoryOperand(MemoryType.Constant, 4));

  const CAN_TRANSFER = () =>
    op(Opcode.READ_MEMORY, memoryOperand(MemoryType.Constant, 5));

  const sourceFlowIO = concat([
    SENTINEL(), // ERC1155 SKIP
    SENTINEL(), // ERC721 SKIP
    SENTINEL(), // ERC20 SKIP
    SENTINEL(), // NATIVE SKIP
    SENTINEL_ERC20(), // BURN END
    YOU(),
    BURN_AMOUNT(),
    SENTINEL_ERC20(), // MINT END
    YOU(),
    MINT_AMOUNT(),
  ]);

  const sources = [CAN_TRANSFER()];

  const stateConfigStructCanTransfer: FlowERC20Config = {
    name: "FlowERC20",
    symbol: "F20",
    stateConfig: {
      sources,
      constants: constantsCanTransfer,
    },
    flows: [
      {
        sources: [sourceFlowIO],
        constants: constantsCanTransfer,
      },
    ],
  };
  const stateConfigStructCannotTransfer: FlowERC20Config = {
    name: "FlowERC20",
    symbol: "F20",
    stateConfig: {
      sources,
      constants: constantsCannotTransfer,
    },
    flows: [
      {
        sources: [sourceFlowIO],
        constants: constantsCannotTransfer,
      },
    ],
  };

  const flowCanTransfer = await flowERC20Deploy(
    stateConfigStructCanTransfer,
    flowERC20Factory,
    _expressionDeployer,
    _interpreter
  );
  const flowCannotTransfer = await flowERC20Deploy(
    stateConfigStructCannotTransfer,
    flowERC20Factory,
    _expressionDeployer,
    _interpreter
  );

  console.log("flowCanTransfer address: ", flowCanTransfer.address);
  console.log("flowCannotTransfer address: ", flowCannotTransfer.address);
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
