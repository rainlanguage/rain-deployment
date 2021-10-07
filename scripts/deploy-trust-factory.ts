import { ethers } from "hardhat"
import { deploy, factoriesDeploy} from "./utils";

import { RightsManager__factory } from './typechain/factories/RightsManager__factory'
import { CRPFactory__factory } from './typechain/factories/CRPFactory__factory'
import { BFactory__factory } from './typechain/factories/BFactory__factory'

const crpFactoryAddress = '0xFB7Cd2084f0C745193DF635413dFbc1a682bD494'
const bFactoryAddress = '0xc50aAf61BAE0b5c69DAf59aED1Fe8dC793C44595'
const rightsManagerAddress = '0x3F9276cE9DDCaaB2b558DeFEA6DE1a8ee321536b'

async function main() {
  const signers = await ethers.getSigners();
  const signer = signers[0];

  const crpFactory = CRPFactory__factory.connect(crpFactoryAddress, signer)
  const bFactory = BFactory__factory.connect(bFactoryAddress, signer)

  const { trustFactoryAddress } = await factoriesDeploy(crpFactory, bFactory, signer);

  console.log('Trust factory deployed to: ', trustFactoryAddress);
}

  main()