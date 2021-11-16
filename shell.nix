let
 pkgs = import <nixpkgs> {};

   flush-all = pkgs.writeShellScriptBin "flush-all" ''
    rm -rf artifacts
    rm -rf cache
    rm -rf typechain
    rm -rf bin
  '';

  cut-dist = pkgs.writeShellScriptBin "cut-dist" ''
    flush-all

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
    rain-protocol-solt
    mv solc-* solt
  '';

  rain-protocol-solt = pkgs.writeShellScriptBin "rain-protocol-solt" ''
    buildPath=`cat artifacts/contracts/trust/TrustFactory.sol/TrustFactory.dbg.json | jq '.buildInfo'`
    buildPath=artifacts/"''${buildPath:10:(''${#buildPath}-11)}"
    cat "''${buildPath}" | jq '.input' | cat > solc-input-rainprotocol.json
  '';

  deploy-rain = pkgs.writeShellScriptBin "deploy-rain" ''
    yarn deploy-rain
  '';

  deploy-rain-mumbai = pkgs.writeShellScriptBin "deploy-rain-mumbai" ''
    yarn deploy-rain --network mumbai
  '';

  deploy-rain-reef-testnet = pkgs.writeShellScriptBin "deploy-rain-reef-testnet" ''
    yarn deploy-rain-reef --network reef_testnet
  '';
  
in
pkgs.stdenv.mkDerivation {
 name = "shell";
 buildInputs = [
  pkgs.nodejs-14_x
  pkgs.jq
  deploy-rain-mumbai
  deploy-rain-reef-testnet
  deploy-rain
  flush-all
  cut-dist
  rain-protocol-solt
  solt-the-earth
 ];

 shellHook = ''
  source .env
  export PATH=$( npm bin ):$PATH
  # keep it fresh
  yarn install
 '';
}
