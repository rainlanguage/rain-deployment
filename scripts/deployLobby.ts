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
const _lobbyFactory = "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c";
const _interpreter = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";
const _expressionDeployer = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
const _token = "0xc6e7DF5E7b4f2A278906862b61205850344D4e7d";

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
    memoryOperand(MemoryType.Constant, 0)
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
    constants: [0],
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
