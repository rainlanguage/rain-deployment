const hre = require("hardhat");
// import hre, { ethers } from "hardhat";

const wait = async (ms: any) => new Promise((res) => setTimeout(res, ms));

async function main() {
  const signer = (await hre.reef.getSigners())[0];
  const RedeemableERC20PoolFactory = await hre.reef.getContractFactory("RedeemableERC20PoolFactory", signer);

  const CRPFactoryAddress = "0x4b591Edd0cB14c4f806442384a167f7D87e3152a";
  const BFactoryAddress = "0xe123e3Dc098D6E191C9B666253C90B71d85a2053";

  const RedeemableERC20PoolFactoryAddress = "0x980662D3377224e02693618a2264953Dc07faBf4";
  const ReedERC20PoolFactArgs = [CRPFactoryAddress, BFactoryAddress];

  // const contract = await RedeemableERC20PoolFactory.deploy(ReedERC20PoolFactArgs);
  // await contract.deployed();
  // console.log("Contract address: ",contract.address)
  // await wait(10000);
  await hre.reef.verifyContract(RedeemableERC20PoolFactoryAddress, "RedeemableERC20PoolFactory", ReedERC20PoolFactArgs);
  await hre.reef.verifyContract(RedeemableERC20PoolFactoryAddress, "RedeemableERC20PoolFactory", [ReedERC20PoolFactArgs]);
}

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