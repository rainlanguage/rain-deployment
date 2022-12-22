import { ethers } from "hardhat";
import { ReserveToken } from "../typechain";

const main = async function () {
  const token = (await (
    await ethers.getContractFactory("ReserveToken")
  ).deploy()) as ReserveToken;

  console.log("Token address: ", token.address);
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
