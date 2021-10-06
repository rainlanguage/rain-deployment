import { ethers } from "hardhat"

const hre = require("hardhat");
const BFactory = require('@beehiveinnovation/rain-protocol/dist/e07af1be5703ebddd8faf546df1e98f23164c253/artifacts/@beehiveinnovation/balancer-core/contracts/BFactory.sol/BFactory.json')
const CRPFactory = require('@beehiveinnovation/rain-protocol/dist/e07af1be5703ebddd8faf546df1e98f23164c253/artifacts/@beehiveinnovation/configurable-rights-pool/contracts/CRPFactory.sol/CRPFactory.json')
const RightsManager = require('@beehiveinnovation/rain-protocol/dist/e07af1be5703ebddd8faf546df1e98f23164c253/artifacts/@beehiveinnovation/configurable-rights-pool/libraries/RightsManager.sol/RightsManager.json')
const SmartPoolManager = require('@beehiveinnovation/rain-protocol/dist/e07af1be5703ebddd8faf546df1e98f23164c253/artifacts/@beehiveinnovation/configurable-rights-pool/libraries/SmartPoolManager.sol/SmartPoolManager.json')
const BalancerSafeMath = require('@beehiveinnovation/rain-protocol/dist/e07af1be5703ebddd8faf546df1e98f23164c253/artifacts/@beehiveinnovation/configurable-rights-pool/libraries/BalancerSafeMath.sol/BalancerSafeMath.json')
// const Prestige = require('../balancer_mainnet_bytecode/PrestigeDeployTx.json')



const CRPFactoryProvisional = require('./dist/CRPFactory.sol/CRPFactory.json')

async function deploy(artifact:any, signer:any) {

    const iface = new ethers.utils.Interface(artifact.abi)
    const factory = new ethers.ContractFactory(iface, artifact.bytecode, signer)
    const contract = await factory.deploy()
    await contract.deployTransaction.wait()
    return contract.address

}

function linkBytecode(bytecode:any, links:any) {
    Object.keys(links).forEach(library_name => {
      const library_address = links[library_name];
      const regex = new RegExp(`__${library_name}_+`, "g");

      bytecode = bytecode.replace(regex, library_address.replace("0x", ""));
    });

    return bytecode;
}

async function deployFromTx(artifact:any, signer:any) {

    const tx = {
        data: artifact.deploy_tx,
        chainId: await signer.provider.send('eth_chainId')
    }

    const deployTx = await signer.sendTransaction(tx)

    return deployTx.creates
}
   
async function main() {

    const signer = await hre.reef.getSignerByName("account");
    await signer.claimDefaultAccount();

    const SmartPoolManagerAddress = await deploy(SmartPoolManager, signer)
    console.log('SmartPoolManager deployed to: ', SmartPoolManagerAddress)

    const BalancerSafeMathAddress = await deploy(BalancerSafeMath, signer)
    console.log('BalancerSafeMath deployed to: ', BalancerSafeMathAddress)

    const RightsManagerAddress = await deploy(RightsManager, signer)
    console.log('RightsManager deployed to: ', RightsManagerAddress)

    const BFactoryAddress = await deploy(BFactory, signer)
    console.log('BFactory deployed to: ', BFactoryAddress)

    let _CRPFactory = CRPFactoryProvisional

    _CRPFactory.bytecode = linkBytecode(_CRPFactory.bytecode, {
        "RightsManager" : RightsManagerAddress,
        "SmartPoolManager" : SmartPoolManagerAddress,
        "BalancerSafeMath" : BalancerSafeMathAddress
    })

    const CRPFactoryAddress = await deploy(_CRPFactory, signer)
    console.log('CRPFactory deployed to: ', CRPFactoryAddress)
}

main()