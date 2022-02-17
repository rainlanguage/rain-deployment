
const hre = require("hardhat");

const wait = async (ms: any) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  // RedeemableERC20PoolFactory args
  const CRPFactoryAddress = "0x4b591Edd0cB14c4f806442384a167f7D87e3152a";
  const BFactoryAddress = "0xe123e3Dc098D6E191C9B666253C90B71d85a2053";
  const ReedERC20PoolFactArgs = {
    crpFactory: CRPFactoryAddress,
    balancerFactory: BFactoryAddress,
  };

  const signer = (await hre.reef.getSigners())[0];
  
  // Deploying contract without args
  const SeedERC20FactoryFactory = await hre.reef.getContractFactory("SeedERC20Factory", signer);
  const SeedERC20Factory = await SeedERC20FactoryFactory.deploy();
  await SeedERC20Factory.deployed();
  const SeedERC20FactoryAddress = SeedERC20Factory.address;
  console.log("SeedERC20Factory address: ", SeedERC20FactoryAddress);
  
  // Contract with args
  const RedeemableERC20PoolFactoryFactory = await hre.reef.getContractFactory("RedeemableERC20PoolFactory", signer);
  const RedeemableERC20Pool = await RedeemableERC20PoolFactoryFactory.deploy([CRPFactoryAddress, BFactoryAddress]);
  await RedeemableERC20Pool.deployed();
  const RedeemableERC20PoolFactoryAddress = RedeemableERC20Pool.address;
  console.log("RedeemableERC20Pool address: ",RedeemableERC20Pool.address);
  
  await wait(10000);
  
  console.log("\nVerying contract with arg:");
  // Verifying contract without args
  await hre.reef.verifyContract(SeedERC20FactoryAddress, "SeedERC20Factory", []);
  
  console.log("\nVerying contract without arg:");
  // Veryfing contract with args
  await hre.reef.verifyContract(SeedERC20FactoryAddress, "RedeemableERC20PoolFactory", [ReedERC20PoolFactArgs]);

  await hre.reef.verifyContract(
    RedeemableERC20PoolFactoryAddress, 
    "RedeemableERC20PoolFactory",
    [ReedERC20PoolFactArgs],
    {
      runs: 100000,
      target: 'london',
      optimization: true,
      compilerVersion: "v0.8.10+commit.fc410830",
    }
  );
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