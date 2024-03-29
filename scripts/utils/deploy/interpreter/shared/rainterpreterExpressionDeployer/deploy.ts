import { ethers } from "hardhat";
import {
  RainterpreterExpressionDeployer,
  Rainterpreter,
} from "../../../../../../typechain";

export const rainterpreterExpressionDeployer = async (
  interpreter: Rainterpreter
) => {
  const expressionDeployerFactory = await ethers.getContractFactory(
    "RainterpreterExpressionDeployer"
  );
  const expressionDeployer = (await expressionDeployerFactory.deploy(
    interpreter.address
  )) as RainterpreterExpressionDeployer;

  return expressionDeployer;
};
