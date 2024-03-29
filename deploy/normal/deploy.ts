import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

import {
  estimateGasDeploy,
  deployContract as deploy,
  save,
} from "../utils/utils";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();

  const interpreter = await deploy("Rainterpreter", {
    from: deployer,
    gasLimit: await estimateGasDeploy("Rainterpreter"),
    args: [],
  });

  await deploy("RainterpreterExpressionDeployer", {
    from: deployer,
    gasLimit: await estimateGasDeploy("RainterpreterExpressionDeployer", [
      interpreter.address,
    ]),
    args: [interpreter.address],
  });

  // Deploy OrderBook
  await deploy("OrderBook", {
    from: deployer,
    gasLimit: await estimateGasDeploy("OrderBook"),
    args: [],
  });

  // Deploy FlowFactory
  await deploy("FlowFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("FlowFactory"),
    args: [],
  });

  // Deploy FlowERC20Factory
  await deploy("FlowERC20Factory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("FlowERC20Factory"),
    args: [],
  });

  // Deploy FlowERC721Factory
  await deploy("FlowERC721Factory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("FlowERC721Factory"),
    args: [],
  });

  // Deploy FlowERC1155Factory
  await deploy("FlowERC1155Factory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("FlowERC1155Factory"),
    args: [],
  });

  // Deploy CombineTierFactory
  await deploy("CombineTierFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("CombineTierFactory"),
    args: [],
  });

  // Deploy StakeFactory
  await deploy("StakeFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("StakeFactory"),
    args: [],
  });

  // Deploy Lobby
  const maxTimeout = 15000000; // Aprox 6months
  await deploy("LobbyFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("LobbyFactory", [maxTimeout]),
    args: [maxTimeout],
  });

  // Save all
  await save();
};
export default func;
