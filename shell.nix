let
 pkgs = import <nixpkgs> {};

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

   deploy-verify = pkgs.writeShellScriptBin "deploy-verify" ''
    export AdminAddress=''$1
    npx hardhat run scripts/deploy-verify-tier.ts --network ''$2
  '';

  cut-dist = pkgs.writeShellScriptBin "cut-dist" ''


    # flush-all
    copy-commit $1
    hardhat compile --force
    rm -rf dist
    mkdir -p "dist"
    solt-the-earth

    cp -r "artifacts" "dist"
    cp -r "typechain" "dist"
    cp -r "solt" "dist"
  '';

  copy-commit = pkgs.writeShellScriptBin "copy-commit" ''
    (cd rain-protocol; git checkout $1)
    rm -rf contracts; cp -r rain-protocol/contracts ./
  '';

  solt-the-earth = pkgs.writeShellScriptBin "solt-the-earth" ''
    mkdir -p solt
    find contracts -type f -not -path 'contracts/test/*' | xargs -i solt write '{}' --npm --runs 100000
    for name in solc-* ; do  content=$(jq '.sources |= with_entries(.key |= sub("\\./"; ""))' "''${name}")
    cat <<< $content > "''${name}"; done
    mv solc-* solt
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
  copy-commit
 ];

 shellHook = ''
  source .env
  export PATH=$( npm bin ):$PATH
  # keep it fresh
  yarn install
 '';
}
