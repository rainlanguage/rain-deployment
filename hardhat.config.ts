import * as dotenv from "dotenv";

import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@reef-defi/hardhat-reef";
import "@typechain/hardhat";

dotenv.config();

function createLocalHostConfig() {
  const url: string = "http://localhost:8545";
  const mnemonic: string =
    "test test test test test test test test test test test junk";
  return {
    accounts: {
      count: 10,
      initialIndex: 0,
      mnemonic,
      path: "m/44'/60'/0'/0",
    },
    url,
  };
}

const config: any = {
  typechain: {
    outDir: "typechain",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.10",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100000,
          },
          metadata: {
            useLiteralContent: true,
          },
        },
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
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          },
          evmVersion: "byzantium",
        },
      },
    ],
  },
  networks: {
    localhost: createLocalHostConfig(),
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 10e9,
    },
    reefMainnet: {
      url: "wss://rpc.reefscan.com/ws",
      scanUrl: "wss://reefscan.com",
      seeds: {
        account1:
          process.env.MNEMONIC_REEF1 !== undefined
            ? process.env.MNEMONIC_REEF1
            : "",
        account2:
          process.env.MNEMONIC_REEF2 !== undefined
            ? process.env.MNEMONIC_REEF2
            : "",
        account3:
          process.env.MNEMONIC_REEF3 !== undefined
            ? process.env.MNEMONIC_REEF3
            : "",
        account4:
          process.env.MNEMONIC_REEF4 !== undefined
            ? process.env.MNEMONIC_REEF4
            : "",
      },
    },
    reefTestnet: {
      url: "wss://rpc-testnet.reefscan.com/ws",
      scanUrl: "https://testnet.reefscan.com",
      seeds: {
        account1:
          process.env.MNEMONIC_REEF1 !== undefined
            ? process.env.MNEMONIC_REEF1
            : "",
        account2:
          process.env.MNEMONIC_REEF2 !== undefined
            ? process.env.MNEMONIC_REEF2
            : "",
        account3:
          process.env.MNEMONIC_REEF3 !== undefined
            ? process.env.MNEMONIC_REEF3
            : "",
        account4:
          process.env.MNEMONIC_REEF4 !== undefined
            ? process.env.MNEMONIC_REEF4
            : "",
      },
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts:
        process.env.MNEMONIC !== undefined
          ? { mnemonic: process.env.MNEMONIC }
          : [process.env.MUMBAI_PRIVATE_KEY],
      gasPrice: 10e9,
    },
    polygon: {
      url: process.env.POLYGON_URL || "",
      accounts:
        process.env.POLYGON_PRIVATE_KEY !== undefined
          ? [process.env.POLYGON_PRIVATE_KEY]
          : [],
      gasPrice: 20e9,
    },
    avalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43114,
      accounts:
        process.env.AVALANCHE_PRIVATE_KEY !== undefined
          ? [process.env.AVALANCHE_PRIVATE_KEY]
          : [],
    },
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      gasPrice: 25000000000,
      chainId: 43113,
      accounts:
        process.env.MNEMONIC !== undefined
          ? { mnemonic: process.env.MNEMONIC }
          : [process.env.AVALANCHE_PRIVATE_KEY],
    },
    rinkeby: {
      url: process.env.RINKEBY_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 10e9,
    },
    fantom: {
      url: "https://rpc.ftm.tools/",
      chainId: 250,
      accounts:
        process.env.MNEMONIC !== undefined
          ? { mnemonic: process.env.MNEMONIC }
          : [process.env.MUMBAI_PRIVATE_KEY],
      gasPrice: 225000000000,
    },
    fantomTestnet: {
      url: "https://rpc.testnet.fantom.network",
      chainId: 4002,
      accounts:
        process.env.MNEMONIC !== undefined
          ? { mnemonic: process.env.MNEMONIC }
          : [process.env.MUMBAI_PRIVATE_KEY],
      gasPrice: 225000000000,
    },
    // arbitrum: {

    // },
    arbitrumTestnet: {
      url: "https://rinkeby.arbitrum.io/rpc",
      chainId: 421611,
      accounts:
        process.env.MNEMONIC !== undefined
          ? { mnemonic: process.env.MNEMONIC }
          : [],
      gasPrice: 225000000000,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  mocha: {
    timeout: 300000,
  },
};

export default config;
