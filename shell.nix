let
 pkgs = import <nixpkgs> {};

   flush-all = pkgs.writeShellScriptBin "flush-all" ''
    # rm -rf node_modules
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

   deploy-verify = pkgs.writeShellScriptBin "deploy-verify" ''
    export AdminAddress=''$1
    npx hardhat run scripts/deploy-verify-tier.ts --network ''$2
  '';

  cut-dist = pkgs.writeShellScriptBin "cut-dist" ''
    // WIP
    if [ -z "$1" ]; then echo "ERROR: Missing commit argument. Exiting..."; exit 0; fi
    flush-all
    commit=$1; copy-commit $1
    sed -i '$s/.*/COMMIT='$commit'/' .env
    hardhat compile --force
    rm -rf dist
    mkdir -p "dist"
    solt-the-earth

    cp -r "artifacts" "dist"
    cp -r "typechain" "dist"
    cp -r "solt" "dist"
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
  
in
pkgs.stdenv.mkDerivation {
 name = "shell";
 buildInputs = [
  pkgs.nodejs-14_x
  pkgs.jq
  deploy-rain
  create-trust
  deploy-verify
  flush-all
  cut-dist
  solt-the-earth
  get-commit
 ];

 shellHook = ''
  source .env
  export PATH=$( npm bin ):$PATH
  # keep it fresh
  yarn install
  get-commit
  (cd node_modules/@vishalkale15107/rain-protocol && [ ! -d artifacts ] && rm -rf yarn.lock && yarn install --ignore-scripts && yarn build)
  (cd node_modules/@beehiveinnovation/rain-statusfi && [ ! -d artifacts ] && yarn install --ignore-scripts && yarn build)
 '';
}

