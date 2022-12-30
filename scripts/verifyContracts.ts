/* eslint-disable @typescript-eslint/no-explicit-any */
import { Interface } from "ethers/lib/utils";
import hre, { artifacts } from "hardhat";
import axios from "axios";
import {
  fetchFile,
  commit,
  Addresses,
  DeployResult,
  NetworksApiInfo,
  ApiInfo,
  delay,
} from "../deploy/utils/utils";

const apiNetworkInfo: ApiInfo = {
  apiKey: "",
  apiUrl: "",
};

/**
 * This get the API info from HardhatConfig. See `verificationApi` in your hardhat.config for examples to add more networks
 */
const initializeApiInfo = async () => {
  // @ts-expect-error: The hardhat config has this info in this repo. The "HardhatConfig" type has not been edited yet.
  const allApiInfo = hre.config.verificationApi as NetworksApiInfo;

  const { apiKey, apiUrl } = allApiInfo[hre.network.name] ?? {};

  if (!apiKey || !apiUrl) {
    throw new Error(
      `API info to verify in your HardhatConfig for ${hre.network.name} is missing or not complete`
    );
  }

  apiNetworkInfo.apiKey = apiKey;
  apiNetworkInfo.apiUrl = apiUrl;
};

const buildBody = async (contractName_: string, folderpath_: string) => {
  // Deployment info file
  const file = fetchFile(
    `${folderpath_}/${contractName_}.json`
  ) as DeployResult;

  // Solt file - the JSON description input. For more info about this JSON, refer to solidity docs.
  // See: https://docs.soliditylang.org/en/latest/using-the-compiler.html#input-description
  const soltFile = JSON.stringify(
    fetchFile(
      "/home/nanez/terra-virtua/rain-deployment/solt/" +
        `solc-input-${contractName_.toLowerCase()}.json`
    )
  );

  const all = await artifacts.getAllFullyQualifiedNames();
  const qualifiedName = all.find((e) => {
    return e.substring(e.indexOf(":") + 1) === contractName_;
  });
  const buildInfo = await artifacts.getBuildInfo(qualifiedName);

  const body: any = {
    apikey: apiNetworkInfo.apiKey, // function validator about the api key
    module: "contract",
    action: "verifysourcecode",
    sourceCode: soltFile,
    contractaddress: file.address,
    codeformat: "solidity-standard-json-input",
    contractname: qualifiedName,
    compilerversion: `v${buildInfo.solcLongVersion}`,
  };

  // If the deployment had args, create an interface with the ABI and encode the args from the deployResult file
  if (file.args && file.args.length) {
    const iface = new Interface(file.abi);
    // Removing the 0x before assign it
    body.constructorArguements = iface.encodeDeploy(file.args).substring(2);
  }

  return body;
};

const getEntries = (folderPath_: string): string[] => {
  // Reading the addesses.json file that contain all the addresses deployed by this commit/network in the path.
  const addresses = fetchFile(folderPath_ + "/addresses.json") as Addresses;

  if (!addresses) {
    throw new Error(
      `The path ${folderPath_} is not valid since require the addresses file`
    );
  }

  const _entries: string[] = [];

  // Include only the contracts names to be the entry
  Object.keys(addresses).forEach((element) => {
    if (!element.includes("Block")) {
      _entries.push(element);
    }
  });

  return _entries;
};

const sendContract = async (contractName_: string, body_: any) => {
  const url = apiNetworkInfo.apiUrl;
  const { contractaddress } = body_;
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };

  const resp = await axios.post(url, body_, { headers });

  let message = "";

  if (resp.data.status == 1) {
    // The verification was sent
    const bodyCheck = {
      apikey: apiNetworkInfo.apiKey,
      guid: resp.data.result,
      module: "contract",
      action: "checkverifystatus",
    };

    let isVerified = false;
    let i = 0;

    // Now wait a few secs (max 20) to ask if the contract is verified
    // It's possible that verification take to much and fail (for many reasons).
    // WARNING: Be careful and take attention to the messages.
    while (!isVerified && i < 4) {
      await delay(5000);
      const respCheck = await axios.get(url, {
        data: bodyCheck,
        headers: headers,
      });

      message = `contract address "${contractaddress}": ${respCheck.data.result}`;

      if (respCheck.data.status == 1) {
        // The contract is verified
        isVerified = true;
      }

      i++;
    }
  } else {
    // An error happened when the verification was sent
    message = `contract address "${contractaddress}": ${resp.data.result}`;
  }

  console.log(`${contractName_} - ${message}`);
};

const verifyContracts = async () => {
  const folderPath = `deployments/${commit}/${hre.network.name}`;
  const entries = getEntries(folderPath);

  for (let i = 0; i < entries.length; i++) {
    // Entry to use. The contract name to verify
    const contractName = entries[i];

    // The body necessary to send the verification request
    const body = await buildBody(contractName, folderPath);

    // Send the verifaction request
    await sendContract(contractName, body);
  }
};

const main = async function () {
  await initializeApiInfo();
  await verifyContracts();
};

main()
  .then(() => {
    const exit = process.exit;
    exit(0);
  })
  .catch((error) => {
    console.error(error);
    const exit = process.exit;
    exit(1);
  });
