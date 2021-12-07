import { EtherscanProvider } from "@ethersproject/providers"
import { ethers, artifacts, network } from "hardhat"
const fs = require('fs')

const RedeemableERC20Factory = require("../dist/artifacts/contracts/redeemableERC20/RedeemableERC20Factory.sol/RedeemableERC20Factory.json")
const RedeemableERC20PoolFactory = require("../dist/artifacts/contracts/pool/RedeemableERC20PoolFactory.sol/RedeemableERC20PoolFactory.json")
const SeedERC20Factory = require("../dist/artifacts/contracts/seed/SeedERC20Factory.sol/SeedERC20Factory.json")
const TrustFactory = require("../dist/artifacts/contracts/trust/TrustFactory.sol/TrustFactory.json")

export async function deploy(artifact:any, signer:any, argmts:any[] | any) {
    const iface = new ethers.utils.Interface(artifact.abi)
    const factory = new ethers.ContractFactory(iface, artifact.bytecode, signer)
    const overrides = {
        nonce: 20,
        gasPrice: ethers.BigNumber.from("75000000000"),
        gasLimit: ethers.BigNumber.from("20000000")
    };
    const contract = await factory.deploy(argmts);
    // console.log(contract.deployTransaction)
    await contract.deployTransaction.wait()
    return contract.address
}

export function linkBytecode(bytecode:any, links:any) {
    Object.keys(links).forEach(library_name => {
      const library_address = links[library_name];
      const regex = new RegExp(`__${library_name}_+`, "g");

      bytecode = bytecode.replace(regex, library_address.replace("0x", ""));
    });
    return bytecode;
}

export async function deployFromTx(artifact:any, signer:any) {
    const tx = {
        data: artifact.deploy_tx,
        chainId: await signer.provider.send('eth_chainId')
    }
    const deployTx = await signer.sendTransaction(tx)
    return deployTx.creates
}

export async function factoriesDeploy(crpFactory: string, balancerFactory: string, signer:any) {
    const redeemableERC20FactoryAddress = await deploy(RedeemableERC20Factory, signer, []);
    console.log('- RedeemableERC20Factory deployed to: ', redeemableERC20FactoryAddress);
    
    const redeemableERC20PoolFactoryAddress = await deploy(RedeemableERC20PoolFactory, signer, [
      crpFactory,
      balancerFactory
    ]);
    console.log('- RedeemableERC20PoolFactory deployed to: ', redeemableERC20PoolFactoryAddress);
    
    const seedERC20FactoryAddress = await deploy(SeedERC20Factory, signer, []);
    console.log('- SeedERC20Factory deployed to: ', seedERC20FactoryAddress);

    const trustFactoryAddress = await deploy(TrustFactory, signer, [
      redeemableERC20FactoryAddress,
      redeemableERC20PoolFactoryAddress,
      seedERC20FactoryAddress
    ]);
    return {
      redeemableERC20FactoryAddress,
      redeemableERC20PoolFactoryAddress,
      seedERC20FactoryAddress,
      trustFactoryAddress,
    };
  };

  export function exportArgs(artifact:any, args:string[], deployId:string) {
    let pathTo = `${__dirname}/verification/${deployId}`;
    checkPath(pathTo);
    pathTo = `${pathTo}/arguments.json`;
    const content = fs.existsSync(pathTo) ? fetchFile(pathTo) : {};
    const TwelveBytes = "000000000000000000000000";
    const encodeABIArgs = args.reduce((prev, current) => {
      return prev + TwelveBytes + current.replace("0x", "");
    }, "");
    content[artifact.contractName] = encodeABIArgs;
    writeFile(pathTo, JSON.stringify(content, null, 4));
  }

  export function getDeployID() {
    const networkName= network.name ? network.name : "networkName";
    const date = new Date(Date.now())
      .toLocaleString('en-GB', {timeStyle:"medium", dateStyle:"medium"})
      .replace(", ","-").replace(/ /g, "").replace(/:/g, "");
    return `${networkName}-${date}`;
  }

  function fetchFile(_path:string) {
    try {
      return JSON.parse(fs.readFileSync(_path).toString())
    } catch (error) {
      console.log(error)
      return {}
    }
  }

  function writeFile(_path:string, file:any) {
    try {
      fs.writeFileSync(_path, file);
    } catch (error) {
      console.log(error)
    }
  }

  function checkPath(_path:string) {
    if(!fs.existsSync(_path)) {
      try {
        fs.mkdirSync(_path);
      } catch (error) {
        console.log(error)
      }
    }
  }