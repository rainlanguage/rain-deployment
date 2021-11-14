import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@reef-defi/hardhat-reef";

dotenv.config();

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
        version: "0.6.12",
        "settings": {
          "metadata": {
            "useLiteralContent": true
          },
          "optimizer": {
            "enabled": true,
            "runs": 100000
          },
          "evmVersion": 'istanbul'
        }
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
    overrides: {
      "contracts/configurable-rights-pool/contracts/utils/BalancerOwnable.sol": {
        version: "0.6.12",
        "settings": {
          "metadata": {
            "useLiteralContent": true
          },
          "optimizer": {
            "enabled": true,
            "runs": 200
          },
          evmVersion: 'istanbul'
        }
      },
      "contracts/configurable-rights-pool/contracts/utils/BalancerReentrancyGuard.sol": {
        version: "0.6.12",
        "settings": {
          "metadata": {
            "useLiteralContent": true
          },
          "optimizer": {
            "enabled": true,
            "runs": 200
          },
          evmVersion: 'istanbul'
        }
      },
      "contracts/configurable-rights-pool/contracts/ConfigurableRightsPool.sol": {
        version: "0.6.12",
        "settings": {
          "metadata": {
            "useLiteralContent": true
          },
          "optimizer": {
            "enabled": true,
            "runs": 200
          },
          evmVersion: 'istanbul'
        }
      },
      "contracts/configurable-rights-pool/contracts/CRPFactory.sol": {
        version: "0.6.12",
        "settings": {
          "metadata": {
            "useLiteralContent": true
          },
          "optimizer": {
            "enabled": true,
            "runs": 200
          },
          evmVersion: 'istanbul'
        }
      },
      "contracts/configurable-rights-pool/contracts/IBFactory.sol": {
        version: "0.6.12",
        "settings": {
          "metadata": {
            "useLiteralContent": true
          },
          "optimizer": {
            "enabled": true,
            "runs": 200
          },
          evmVersion: 'istanbul'
        }
      },
      "contracts/configurable-rights-pool/contracts/Migrations.sol": {
        version: "0.6.12",
        "settings": {
          "metadata": {
            "useLiteralContent": true
          },
          "optimizer": {
            "enabled": true,
            "runs": 200
          },
          evmVersion: 'istanbul'
        }
      },
      "contracts/configurable-rights-pool/contracts/PCToken.sol": {
        version: "0.6.12",
        "settings": {
          "metadata": {
            "useLiteralContent": true
          },
          "optimizer": {
            "enabled": true,
            "runs": 200
          },
          evmVersion: 'istanbul'
        }
      },
      "contracts/configurable-rights-pool/interfaces/IConfigurableRightsPool.sol": {
        version: "0.6.12",
        "settings": {
          "metadata": {
            "useLiteralContent": true
          },
          "optimizer": {
            "enabled": true,
            "runs": 200
          },
          evmVersion: 'istanbul'
        }
      },
      "contracts/configurable-rights-pool/interfaces/IERC20.sol": {
        version: "0.6.12",
        "settings": {
          "metadata": {
            "useLiteralContent": true
          },
          "optimizer": {
            "enabled": true,
            "runs": 200
          },
          evmVersion: 'istanbul'
        }
      },
      "contracts/configurable-rights-pool/libraries/BalancerConstants.sol": {
        version: "0.6.12",
        "settings": {
          "metadata": {
            "useLiteralContent": true
          },
          "optimizer": {
            "enabled": true,
            "runs": 200
          },
          evmVersion: 'istanbul'
        }
      },
      "contracts/configurable-rights-pool/libraries/BalancerSafeMath.sol": {
        version: "0.6.12",
        "settings": {
          "metadata": {
            "useLiteralContent": true
          },
          "optimizer": {
            "enabled": true,
            "runs": 200
          },
          evmVersion: 'istanbul'
        }
      },
      "contracts/configurable-rights-pool/libraries/RightsManager.sol": {
        version: "0.6.12",
        "settings": {
          "metadata": {
            "useLiteralContent": true
          },
          "optimizer": {
            "enabled": true,
            "runs": 200
          },
          evmVersion: 'istanbul'
        }
      },
      "contracts/configurable-rights-pool/libraries/SafeApprove.sol": {
        version: "0.6.12",
        "settings": {
          "metadata": {
            "useLiteralContent": true
          },
          "optimizer": {
            "enabled": true,
            "runs": 200
          },
          evmVersion: 'istanbul'
        }
      },
      "contracts/configurable-rights-pool/libraries/SmartPoolManager.sol": {
        version: "0.6.12",
        "settings": {
          "metadata": {
            "useLiteralContent": true
          },
          "optimizer": {
            "enabled": true,
            "runs": 200
          },
          evmVersion: 'istanbul'
        }
      }
    }
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
        "account": process.env.MNEMONIC
      }
    },
    reef_testnet: {
      url: "wss://rpc-testnet.reefscan.com/ws",
      seeds: {
        "account": process.env.MNEMONIC,
      }
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: process.env.MNEMONIC !== undefined ? {mnemonic: process.env.MNEMONIC} : [process.env.MUMBAI_PRIVATE_KEY],
      gasPrice: 10e9,
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
      accounts: process.env.AVALANCHE_PRIVATE_KEY !== undefined ? [process.env.AVALANCHE_PRIVATE_KEY] : [],
    },
    rinkeby: {
      url: process.env.RINKEBY_URL || "",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 10e9,
    },
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
