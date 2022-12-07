import { ethers } from "hardhat";
import { concat } from "ethers/lib/utils";

import {
  randomUint256,
  max_uint256,
  eighteenZeros,
  op,
  Opcode,
  memoryOperand,
  MemoryType,
} from "./utils";

import type { OrderBook } from "../typechain";

import { OrderConfigStruct } from "../typechain/contracts/orderbook/OrderBook";

// ****NOTE: This addressess will be used
const _tokenA = "0xe80081b6Ad08D9dFF568c2a8e34C672f84002b40";
const _tokenB = "0x7e30616a7c0996f685e24e44b7afdc2c75461527";
const _interpreter = "0xF4d1dbA59eABac89a9C37eB5F5bbC5F5b7Ab6B8c";
const _expressionDeployer = "0x1819ed2de3ABa77c93C3B263aA95fbE67ef34088";

const main = async function () {
  const signers = await ethers.getSigners();
  const alice = signers[0];

  const orderBook = (await ethers.getContractAt(
    "OrderBook",
    "0x4C765C1Bf6581574afBaF8878beC448b03185677"
  )) as OrderBook;

  const aliceInputVault = ethers.BigNumber.from(randomUint256());
  const aliceOutputVault = ethers.BigNumber.from(randomUint256());

  // ASK ORDER
  const askPrice = ethers.BigNumber.from("90" + eighteenZeros);
  const askConstants = [max_uint256, askPrice];
  const vAskOutputMax = op(
    Opcode.READ_MEMORY,
    memoryOperand(MemoryType.Constant, 0)
  );
  const vAskPrice = op(
    Opcode.READ_MEMORY,
    memoryOperand(MemoryType.Constant, 1)
  );
  // prettier-ignore
  const askSource = concat([
        vAskOutputMax,
        vAskPrice,
      ]);
  const askOrderConfig: OrderConfigStruct = {
    interpreter: _interpreter,
    expressionDeployer: _expressionDeployer,
    validInputs: [{ token: _tokenA, vaultId: aliceInputVault }],
    validOutputs: [{ token: _tokenB, vaultId: aliceOutputVault }],
    interpreterStateConfig: {
      sources: [askSource, []],
      constants: askConstants,
    },
  };

  const txAskAddOrder = await orderBook.connect(alice).addOrder(askOrderConfig);

  const tx = await txAskAddOrder.wait();
  console.log("The transaction hash is: " + tx.transactionHash);
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
