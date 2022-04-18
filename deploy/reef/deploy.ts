import { deploy, getAccount, estimateGasDeploy } from "../utils/reefUtils";

const main = async function () {
  // TODO: Add type check to deployment. Wrap the function deploy and check the type to each funcion
  const deployer = await getAccount("deployer");

  // Rain protocol contracts
  const RedeemableERC20Factory = await deploy("RedeemableERC20Factory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("RedeemableERC20Factory"),
    args: [],
  });

  await deploy("VerifyFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("VerifyFactory"),
    args: [],
  });

  await deploy("VerifyTierFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("VerifyTierFactory"),
    args: [],
  });

  await deploy("ERC20BalanceTierFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("ERC20BalanceTierFactory"),
    args: [],
  });

  await deploy("ERC20TransferTierFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("ERC20TransferTierFactory"),
    args: [],
  });

  await deploy("CombineTierFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("CombineTierFactory"),
    args: [],
  });

  await deploy("ERC721BalanceTierFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("ERC721BalanceTierFactory"),
    args: [],
  });

  const SaleFactoryArgs = {
    maximumSaleTimeout: 10000,
    maximumCooldownDuration: 1000,
    redeemableERC20Factory: RedeemableERC20Factory.address,
  };
  await deploy("SaleFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("SaleFactory", [SaleFactoryArgs]),
    args: [SaleFactoryArgs],
  });

  await deploy("GatedNFTFactory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("GatedNFTFactory"),
    args: [],
  });

  await deploy("RedeemableERC20ClaimEscrow", {
    from: deployer,
    gasLimit: await estimateGasDeploy("RedeemableERC20ClaimEscrow"),
    args: [],
  });

  await deploy("NoticeBoard", {
    from: deployer,
    gasLimit: await estimateGasDeploy("NoticeBoard"),
    args: [],
  });

  await deploy("EmissionsERC20Factory", {
    from: deployer,
    gasLimit: await estimateGasDeploy("EmissionsERC20Factory"),
    args: [],
  });
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
