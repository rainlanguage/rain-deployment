import { ethers } from "hardhat"

const BFactory = require('@beehiveinnovation/rain-protocol/dist/e07af1be5703ebddd8faf546df1e98f23164c253/artifacts/@beehiveinnovation/balancer-core/contracts/BFactory.sol/BFactory.json')
const CRPFactory = require('@beehiveinnovation/rain-protocol/dist/e07af1be5703ebddd8faf546df1e98f23164c253/artifacts/@beehiveinnovation/configurable-rights-pool/contracts/CRPFactory.sol/CRPFactory.json')
const RightsManager = require('../dist/RightsManager.json')
const Prestige = require('../balancer_mainnet_bytecode/PrestigeDeployTx.json')
const SmartPoolManager = require('../dist/SmartPoolManager.json')
const BalancerSafeMath = require('../dist/BalancerSafeMath.json')

async function deploy(artifact, signer) {

    const iface = new ethers.utils.Interface(artifact.abi)
    const factory = new ethers.ContractFactory(iface, artifact.bytecode, signer)
    const contract = await factory.deploy()
    await contract.deployTransaction.wait()
    return contract.address

}

function linkBytecode(bytecode, links) {
    Object.keys(links).forEach(library_name => {
      const library_address = links[library_name];
      const regex = new RegExp(`__${library_name}_+`, "g");

      bytecode = bytecode.replace(regex, library_address.replace("0x", ""));
    });

    return bytecode;
}

async function deployFromTx(artifact, signer) {

    const tx = {
        data: artifact.deploy_tx,
        chainId: await signer.provider.send('eth_chainId')
    }

    const deployTx = await signer.sendTransaction(tx)

    return deployTx.creates
}
   
async function main() {

    const signers = await ethers.getSigners()

    const SmartPoolManagerAddress = await deploy(SmartPoolManager, signers[0])
    console.log('SmartPoolManager deployed to: ', SmartPoolManagerAddress)

    const BalancerSafeMathAddress = await deploy(BalancerSafeMath, signers[0])
    console.log('BalancerSafeMath deployed to: ', BalancerSafeMathAddress)

    const RightsManagerAddress = await deploy(RightsManager, signers[0])
    console.log('RightsManager deployed to: ', RightsManagerAddress)

    const BFactoryAddress = await deploy(BFactory, signers[0])
    console.log('BFactory deployed to: ', BFactoryAddress)

    let _CRPFactory = CRPFactory

    _CRPFactory.bytecode = linkBytecode(_CRPFactory.bytecode, {
        "RightsManager" : RightsManagerAddress,
        "SmartPoolManager" : SmartPoolManagerAddress,
        "BalancerSafeMath" : BalancerSafeMathAddress
    })

    const CRPFactoryAddress = await deploy(_CRPFactory, signers[0])
    console.log('CRPFactory deployed to: ', CRPFactoryAddress)

}

main()