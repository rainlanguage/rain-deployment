import { ethers } from "hardhat";
import {
  Lobby,
  ConfigStruct,
  StateConfigStruct,
} from "../typechain/contracts/lobby/Lobby";
import { MemoryType, Opcode, memoryOperand, op } from "./utils";
import { concat } from "ethers/lib/utils";

// Localhost addresses (no valid)
const _lobby = "0x59b670e9fA9D0A427751Af201D676719a970857b";
const _interpreter = "0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0";
const _expressionDeployer = "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82";
const _token = "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1";

const main = async function () {
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  const lobby = (await ethers.getContractAt("Lobby", _lobby)) as Lobby;

  const join_deposit = op(
    Opcode.READ_MEMORY,
    memoryOperand(MemoryType.Constant, 0)
  );
  const truthy_value = op(
    Opcode.READ_MEMORY,
    memoryOperand(MemoryType.Constant, 1)
  );
  const leave_min = op(
    Opcode.READ_MEMORY,
    memoryOperand(MemoryType.Constant, 0)
  );

  const claim_min = op(
    Opcode.READ_MEMORY,
    memoryOperand(MemoryType.Constant, 0)
  );

  // prettier-ignore
  const joinSource = concat([
    join_deposit, 
    truthy_value
  ]);

  // prettier-ignore
  const leaveSource = concat([
    leave_min
  ]);
  // prettier-ignore
  const claimSource = concat([
    claim_min
  ]);

  // 2 + 1 + 1
  const stateConfig: StateConfigStruct = {
    sources: [joinSource, leaveSource, claimSource],
    constants: [0, 100],
  };

  const config: ConfigStruct = {
    refMustAgree: true,
    ref: deployer.address,
    expressionDeployer: _expressionDeployer,
    interpreter: _interpreter,
    token: _token,
    stateConfig: stateConfig,
    description: "0x00",
    timeout: 15000000, // Aprox 6months,
  };

  const tx = await lobby.initialize(config);
  await tx.wait();

  console.log("Lobby initialized: ", lobby.address);
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
