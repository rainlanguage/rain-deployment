import { artifacts, ethers } from "hardhat";
import {
  Lobby,
  LobbyConfigStruct,
  StateConfigStruct,
} from "../typechain/contracts/lobby/Lobby";
import { MemoryType, Opcode, getEventArgs, memoryOperand, op } from "./utils";
import { concat } from "ethers/lib/utils";
import { LobbyFactory } from "../typechain";
import { Overrides } from "ethers";

// TODO: Improve multichain scripts
// Mumbai addresses (be careful)
const _lobbyFactory = "0xCB876f819f88403dfb9D0Fc31AD8c42854677f0a";
const _interpreter = "0x5CFbf7d001A1095115657c6C08e87a9039C3343b";
const _expressionDeployer = "0xA9a5943fe662a463148B1e966739c4C03B35cEb0";
const _token = "0x30c0331340CffE54c402d27Aa854894F618ceC9B";

const lobbyDeploy = async (
  lobbyConfig: LobbyConfigStruct,
  lobbyFactory: LobbyFactory,
  ...args: Overrides[]
): Promise<Lobby> => {
  const lobbyConfigStruct: LobbyConfigStruct = lobbyConfig;

  const txDeploy = await lobbyFactory.createChildTyped(
    lobbyConfigStruct,
    ...args
  );

  const _lobby = new ethers.Contract(
    ethers.utils.hexZeroPad(
      ethers.utils.hexStripZeros(
        (await getEventArgs(txDeploy, "NewChild", lobbyFactory)).child
      ),
      20 // address bytes length
    ),
    (await artifacts.readArtifact("Lobby")).abi,
    lobbyFactory.signer
  ) as Lobby;

  await _lobby.deployed();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  _lobby.deployTransaction = txDeploy;

  return _lobby;
};

const main = async function () {
  const signers = await ethers.getSigners();
  const deployer = signers[0];
  const lobbyFactory = (await ethers.getContractAt(
    "LobbyFactory",
    _lobbyFactory
  )) as LobbyFactory;

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
    constants: [0, 1],
  };

  const config: LobbyConfigStruct = {
    refMustAgree: true,
    ref: deployer.address,
    expressionDeployer: _expressionDeployer,
    interpreter: _interpreter,
    token: _token,
    stateConfig: stateConfig,
    description: "0x00",
    timeoutDuration: 15000000, // Aprox 6months,
  };

  const lobby = await lobbyDeploy(config, lobbyFactory);

  console.log("Lobby deployed: ", lobby.address);
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
