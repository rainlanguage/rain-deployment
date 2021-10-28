const solc = require('solc')
const fs = require('fs')

const nameContract = "TrustFactory"
const contract = './contracts/rain-protocol/contracts/trust/TrustFactory.sol';
const fileJson = 'scripts/dist/solt/solc-input-trustfactory.json'
const content = fs.readFileSync(fileJson).toString()


// const output = JSON.parse(solc.compile(JSON.stringify(content)))
const output = JSON.parse(solc.compile(content))
const file = {
    "abi": output.contracts[contract][nameContract].abi,
    "bytecode": output.contracts[contract][nameContract].evm.bytecode.object
};
fs.writeFileSync(`file.json`, JSON.stringify(file, null, 4));
