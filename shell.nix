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
    rm -rf contracts
    rm -rf artifacts
    rm -rf solt
    rm -rf cache
    rm -rf typechain
    rm -rf bin
    yarn install
  '';

  deploy-rain = pkgs.writeShellScriptBin "deploy-rain" ''
    if [[ ''$1 == "" ]]; then
      echo "should specify a network"
    else 
      if [[ ''$1 == *"reef"* ]]; then
        hardhat run deploy/reef/deploy.ts --network ''$1
      else 
        hardhat deploy --network ''$1
      fi
    fi
  '';

  hardhat-node = pkgs.writeShellScriptBin "hardhat-node" ''
    hardhat node --network hardhat --no-deploy
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
    solt-the-earth
    commit=`jq '.dependencies."@beehiveinnovation/rain-protocol"' package.json`
    if [[ $commit == *"#"* ]]; then
      commit=''${commit#*\#}; commit=''${commit::-1}
    else
      commit=`echo $commit | sed 's/\^//' | sed 's/\~//'`;commit=''${commit:1:-1}
    fi
    sed -i '$s/.*/COMMIT='$commit'/' .env
  '';

  init = pkgs.writeShellScriptBin "init" ''
    mkdir -p contracts && cp -r node_modules/@beehiveinnovation/rain-protocol/contracts .
    npx hardhat compile
    get-commit
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
  solt-the-earth
  get-commit
  hardhat-node
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

