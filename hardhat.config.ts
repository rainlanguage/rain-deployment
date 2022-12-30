import * as dotenv from "dotenv";

import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@reef-defi/hardhat-reef";
import "@typechain/hardhat";
import "hardhat-deploy";

dotenv.config();

/**
 * Use defaullt URL from here if does not found any match on env file
 */
const defaultUrls = {
  reef: "ws://127.0.0.1:9944",
  reef_mainnet: "wss://rpc.reefscan.com/ws",
  reef_testnet: "wss://rpc-testnet.reefscan.com/ws",
  polygon: "https://rpc-mainnet.maticvigil.com/",
  mumbai: "https://rpc-mumbai.maticvigil.com",
  testnet_aurora: "https://testnet.aurora.dev",
  celo_mainnet: "https://forno.celo.org",
  celo_alfajores: "https://alfajores-forno.celo-testnet.org",
  fantom_mainnet: "https://rpc.ftm.tools",
  fantom_testnet: "https://rpc.testnet.fantom.network",
};

/**
 * Provide the correct mnemonic seed. The function can handle HD wallet
 * address or assign the correct test wallet account in Reef localnode.
 * @param subkey The subkey use to generate a specific HD wallet address.
 * In order to get an address from a mnemonic + subkey, it should be use
 * the same subkey present in your wallet. If a test name account is
 * provided, will be use to get the HD test wallet. The names availables
 * are: `["alice", "bob", "charlie", "dave", "eve",* "ferdie"]`
 * @returns The correct mnemonic to be used as signer
 */
function seedReef(subkey?: string): string {
  /**
   * This `testSubkeys` are intended for use with the local Reef node. Also these subkeys
   * generate developer accounts that are pre-funded with REEF.
   * Check documentation for more info:
   * - https://docs.reef.io/docs/developers/accounts/#developer-accounts
   * - https://github.com/reef-defi/hardhat-reef#usage
   */
  const testSubkeys = ["alice", "bob", "charlie", "dave", "eve", "ferdie"];
  if (testSubkeys.includes(subkey)) {
    subkey = subkey.charAt(0).toUpperCase() + subkey.slice(1);
    return `bottom drive obey lake curtain smoke basket hold race lonely fit walk//${subkey}`;
  }

  const seedMnemonic = process.env["MNEMONIC_REEF"];
  if (seedMnemonic && seedMnemonic !== "") {
    if (subkey) {
      subkey = `//${subkey}`;
      return seedMnemonic.includes("//")
        ? seedMnemonic.replace(new RegExp("//.+"), subkey)
        : seedMnemonic + subkey;
    }
    return seedMnemonic;
  }
  // Throw error
  return "";
}

function accounts(networkName?: string): { mnemonic: string } {
  return { mnemonic: getMnemonic(networkName) };
}

function getMnemonic(networkName?: string): string {
  if (networkName === "localhost") {
    return "test test test test test test test test test test test junk";
  }

  if (networkName) {
    const mnemonic = process.env["MNEMONIC_" + networkName.toUpperCase()];
    if (mnemonic && mnemonic !== "") {
      return mnemonic;
    }
  }

  const mnemonic = process.env.MNEMONIC;
  return mnemonic;
}

function getUrl(networkName: string): string {
  // Use localhost node
  if (networkName === "localhost") {
    return "http://localhost:8545";
  }

  const uri = process.env[networkName.toUpperCase() + "_URL"];
  if (uri && uri !== "") {
    return uri;
  }

  // Check a "default URl"
  const defaultUrl = defaultUrls[`${networkName.toLowerCase()}`];
  if (defaultUrl) {
    return defaultUrl;
  }
  // This will throw an error. URL is not set correctly
  return "";
}

const config = {
  typechain: {
    outDir: "typechain",
  },
  solidity: {
    compilers: [
      {
        version: "0.8.17",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1000000000,
            details: {
              peephole: true,
              inliner: true,
              jumpdestRemover: true,
              orderLiterals: true,
              deduplicate: true,
              cse: true,
              constantOptimizer: true,
            },
          },
          evmVersion: "london",
          // viaIR: true,
          metadata: {
            useLiteralContent: true,
          },
        },
      },
    ],
  },
  paths: {
    deploy: ["deploy/normal"],
  },
  namedAccounts: {
    deployer: 0,
  },
  networks: {
    localhost: {
      url: getUrl("localhost"),
      accounts: accounts("localhost"),
    },
    ethereum: {
      url: getUrl("ethereum"),
      accounts: accounts(),
    },
    goerli: {
      url: getUrl("goerli"),
      accounts: accounts(),
      gasPrice: 10e9,
    },
    mumbai: {
      url: getUrl("mumbai"),
      accounts: accounts(),
      gasPrice: 10e9,
    },
    polygon: {
      url: getUrl("polygon"),
      accounts: accounts(),
      gasPrice: 20e9,
    },
    bsc_testnet: {
      url: getUrl("bsc_testnet"),
      accounts: accounts(),
      gasPrice: 20e9,
    },
    bsc_mainnet: {
      url: getUrl("bsc_mainnet"),
      accounts: accounts(),
      gasPrice: 20e9,
    },
    reef: {
      // This is a reef local node
      deploy: ["deploy/reef"],
      url: getUrl("reef"),
      scanUrl: "http://localhost:3000",
      seeds: {
        deployer: seedReef("alice"),
      },
    },
    reef_mainnet: {
      deploy: ["deploy/reef"],
      url: getUrl("reef_mainnet"),
      scanUrl: "wss://reefscan.com",
      seeds: {
        deployer: seedReef(),
      },
    },
    reef_testnet: {
      deploy: ["deploy/reef"],
      url: getUrl("reef_testnet"),
      scanUrl: "https://testnet.reefscan.com",
      seeds: {
        deployer: seedReef(),
      },
    },
    avalanche: {
      url: getUrl("avalanche"),
      gasPrice: 225000000000,
      chainId: 43114,
      accounts: accounts(),
    },
    fuji: {
      url: getUrl("fuji"),
      accounts: accounts(),
      gasPrice: 225000000000,
    },
    testnet_aurora: {
      url: getUrl("testnet_aurora"),
      accounts: accounts(),
      chainId: 1313161555,
    },
    fantom: {
      url: "https://rpc.ftm.tools/",
      chainId: 250,
      accounts:
        process.env.MNEMONIC !== undefined
          ? { mnemonic: process.env.MNEMONIC }
          : [process.env.PRIVATE_KEY],
    },
    fantom_mainnet: {
      url: getUrl("fantom_mainnet"),
      accounts: accounts(),
      gasPrice: 225000000000,
    },
    fantom_testnet: {
      url: getUrl("fantom_testnet"),
      chainId: 4002,
      accounts: accounts(),
      gasPrice: 225000000000,
    },
    arbitrum_mainnet: {
      url: getUrl("arbitrum_mainnet"),
      accounts: accounts(),
      gasPrice: 225000000000,
    },
    arbitrum_rinkeby: {
      url: getUrl("arbitrum_rinkeby"),
      accounts: accounts(),
      gasPrice: 225000000000,
    },
    celo_mainnet: {
      url: getUrl("celo_mainnet"),
      accounts: accounts(),
      gasPrice: 225000000000,
    },
    celo_alfajores: {
      url: getUrl("celo_alfajores"),
      accounts: accounts(),
      gasPrice: 225000000000,
    },
    aurora_mainnet: {
      url: "https://mainnet.aurora.dev",
      // url: getUrl("aurora_mainnet"),
      accounts: accounts(),
      gasPrice: 225000000000,
    },
    aurora_testnet: {
      url: "https://testnet.aurora.dev",
      // url: getUrl("aurora_testnet"),
      accounts: accounts(),
      gasPrice: 225000000000,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  verificationApi: {
    // The name should matched with the network name in network config.
    // To found the api info about every Ethereum testnet see: https://docs.etherscan.io/getting-started/endpoint-urls
    mainnet: {
      apiUrl: "https://api.etherscan.io/api",
      apiKey: process.env.ETHERSCAN_API_KEY,
    },
    goerli: {
      apiUrl: "https://api-goerli.etherscan.io/api",
      apiKey: process.env.ETHERSCAN_API_KEY,
    },
    polygon: {
      apiUrl: "https://api.polygonscan.com/api",
      apiKey: process.env.POLYGON_MUMBAI_API_KEY,
    },
    mumbai: {
      apiUrl: "https://api-testnet.polygonscan.com/api",
      apiKey: process.env.POLYGON_MUMBAI_API_KEY,
    },
  },
  mocha: {
    timeout: 300000,
  },
};

export default config;
