import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@reef-defi/hardhat-reef";

dotenv.config();

//Custom tasks
import "./scripts/hardhat-tasks/deploy-verify-tier";
import "./scripts/hardhat-tasks/deploy-rain.ts";
import "./scripts/hardhat-tasks/create-trust.ts";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config:any = {
  solidity: { 
    compilers: [
      {
        version: "0.8.10",
        "settings": {
          "metadata": {
            "useLiteralContent": true
          },
          "optimizer": {
            "enabled": true,
            "runs": 100000
          }
        }
      },
      {
        version: "0.6.12",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100000,
          },
        },
      },
      {
        version: "0.5.12",
        "settings": {
          "metadata": {
            "useLiteralContent": true
          },
          "optimizer": {
            "enabled": true,
            "runs": 100
          },
          evmVersion: "byzantium"
        }
      },
    ],
  },
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
        gasPrice: 10e9,
    },
    reef_mainnet: {
      url: "wss://rpc.reefscan.com/ws",
      seeds: {
        "account1": process.env.MNEMONIC_REEF1,
        "account2": process.env.MNEMONIC_REEF2,
        "account3": process.env.MNEMONIC_REEF3,
        "account4": process.env.MNEMONIC_REEF4
      }
    },
    reef_testnet: {
      url: "wss://rpc-testnet.reefscan.com/ws",
      seeds: {
        "account1": process.env.MNEMONIC_REEF1,
        "account2": process.env.MNEMONIC_REEF2,
        "account3": process.env.MNEMONIC_REEF3,
        "account4": process.env.MNEMONIC_REEF4
      }
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: process.env.MNEMONIC !== undefined ? {mnemonic: process.env.MNEMONIC} : [process.env.MUMBAI_PRIVATE_KEY],
      gasPrice: 10e9,
    },
    polygon: {
      url: "https://rpc-mainnet.maticvigil.com",
      accounts: [ process.env.POLYGON_PRIVATE_KEY],
      gasPrice: 20e9
    },
    avalanche: {
      url: 'https://api.avax.network/ext/bc/C/rpc',
      gasPrice: 225000000000,
      chainId: 43114,
      accounts: process.env.AVALANCHE_PRIVATE_KEY !== undefined ? [process.env.AVALANCHE_PRIVATE_KEY] : [],
    },
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      gasPrice: 25000000000,
      chainId: 43113,
      accounts: process.env.MNEMONIC !== undefined ? {mnemonic: process.env.MNEMONIC} : [process.env.AVALANCHE_PRIVATE_KEY],
    },
    rinkeby: {
      url: process.env.RINKEBY_URL || "",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 10e9,
    },
    fantom: {
      url: "https://rpc.ftm.tools/",
      chainId: 250,
      accounts: process.env.MNEMONIC !== undefined ? {mnemonic: process.env.MNEMONIC} : [process.env.MUMBAI_PRIVATE_KEY],
      gasPrice: 225000000000,
    },
    fantom_testnet: {
      url: "https://rpc.testnet.fantom.network",
      chainId: 4002,
      accounts: process.env.MNEMONIC !== undefined ? {mnemonic: process.env.MNEMONIC} : [process.env.MUMBAI_PRIVATE_KEY],
      gasPrice: 225000000000,
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
