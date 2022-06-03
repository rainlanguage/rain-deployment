import * as dotenv from "dotenv";

import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-waffle";
import "@reef-defi/hardhat-reef";
import "@typechain/hardhat";
import "hardhat-deploy";

dotenv.config();

const defaultUrls = {
  reef: "ws://127.0.0.1:9944",
  reef_mainnet: "wss://rpc.reefscan.com/ws",
  reef_testnet: "wss://rpc-testnet.reefscan.com/ws",
  polygon: "https://rpc-mainnet.maticvigil.com/",
  mumbai: "https://rpc-mumbai.maticvigil.com",
  testnet_aurora: "https://testnet.aurora.dev",
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

// TODO Support to new chains
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
      url: "https://api.avax.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43114,
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
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
      gasPrice: 225000000000,
    },
    fantomTestnet: {
      url: "https://rpc.testnet.fantom.network",
      chainId: 4002,
      accounts:
        process.env.MNEMONIC !== undefined
          ? { mnemonic: process.env.MNEMONIC }
          : [process.env.PRIVATE_KEY],
      gasPrice: 225000000000,
    },
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
