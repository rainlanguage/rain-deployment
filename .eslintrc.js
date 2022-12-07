module.exports = {
  env: {
    browser: false,
    es2021: true,
    mocha: true,
    node: true,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  rules: {
    camelcase: [
      "error",
      {
        allow: [
          "reef_testnet",
          "reef_mainnet",
          "CombineTierFactory__factory",
          "CombineTier__factory",
          "bsc_testnet",
          "bsc_mainnet",
          "testnet_aurora",
          "mainnet_aurora",
          "fantom_testnet",
          "fantom_mainnet",
          "arbitrum_rinkeby",
          "arbitrum_mainnet",
          "celo_alfajores",
          "celo_mainnet",
          "aurora_testnet",
          "aurora_mainnet",
        ],
      },
    ],
  },
};
