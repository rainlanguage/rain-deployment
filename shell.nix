let
  pkgs = import
    (builtins.fetchTarball {
      name = "nixos-unstable-2021-10-01";
      url = "https://github.com/nixos/nixpkgs/archive/d3d2c44a26b693293e8c79da0c3e3227fc212882.tar.gz";
      sha256 = "0vi4r7sxzfdaxzlhpmdkvkn3fjg533fcwsy3yrcj5fiyqip2p3kl";
    })
    { };

   flush-all = pkgs.writeShellScriptBin "flush-all" ''
    rm -rf node_modules
    rm -rf artifacts
    rm -rf cache
    rm -rf typechain
    rm -rf bin
    yarn install
  '';

  deploy-rain = pkgs.writeShellScriptBin "deploy-rain" ''
    npx hardhat run scripts/deploy-rain.ts --network ''$1
  '';

  create-trust = pkgs.writeShellScriptBin "create-trust" ''
    export TrustFactory=''$1
    npx hardhat run scripts/create-trust.ts --network ''$2
  '';

  solt-the-earth = pkgs.writeShellScriptBin "solt-the-earth" ''
    mkdir -p solt
    find contracts -type f -not -path 'contracts/test/*' | xargs -i solt write '{}' --npm --runs 100000
    for name in solc-* ; do  content=$(jq '.sources |= with_entries(.key |= sub("\\./"; ""))' "''${name}")
    cat <<< $content > "''${name}"; done
    mv solc-* solt
  '';

  get-commit = pkgs.writeShellScriptBin "get-commit" ''
    rm -rf solt
    (cd node_modules/@beehiveinnovation/rain-protocol; solt-the-earth)
    (cd node_modules/@vishalkale15107/rain-protocol; solt-the-earth)
    (cd node_modules/@beehiveinnovation/rain-statusfi; solt-the-earth)
    commit=`jq '.dependencies."@beehiveinnovation/rain-protocol"' package.json`
    if [[ $commit == *"#"* ]]; then
      commit=''${commit#*\#}; commit=''${commit::-1}
    else
      commit=`echo $commit | sed 's/\^//' | sed 's/\~//'`;commit=''${commit:1:-1}
    fi
    sed -i '$s/.*/COMMIT='$commit'/' .env
    cp -r "node_modules/@beehiveinnovation/rain-protocol/solt" "./"
    cp -r "node_modules/@vishalkale15107/rain-protocol/solt/solc-input-erc721balancetierfactory.json" "solt"
    cp -r "node_modules/@vishalkale15107/rain-protocol/solt/solc-input-erc721balancetier.json" "solt"
    cp -r "node_modules/@beehiveinnovation/rain-statusfi/solt/solc-input-gatednftfactory.json" "solt"
    cp -r "node_modules/@beehiveinnovation/rain-statusfi/solt/solc-input-gatednft.json" "solt"
  '';

  init = pkgs.writeShellScriptBin "init" ''
    mkdir -p contracts && cp -r node_modules/@beehiveinnovation/rain-protocol/contracts .
    mkdir -p contracts/rain-statusfi && cp node_modules/@beehiveinnovation/rain-statusfi/contracts/*.sol contracts/rain-statusfi
    mkdir -p contracts/tier && cp node_modules/@vishalkale15107/rain-protocol/contracts/tier/ERC721BalanceTier*.sol contracts/tier
    mkdir -p contracts/test && cp node_modules/@vishalkale15107/rain-protocol/contracts/test/ReserveNFT.sol contracts/test
    npx hardhat compile
  '';
  
in
pkgs.stdenv.mkDerivation {
 name = "shell";
 buildInputs = [
  pkgs.yarn
  pkgs.nodejs-16_x
  pkgs.jq
  flush-all
  deploy-rain
  create-trust
  solt-the-earth
  get-commit
  init
 ];

 shellHook = ''
  source .env
  export PATH=$( npm bin ):$PATH
  # keep it fresh
  yarn install
  init
 '';
}

