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
    for i in solc-* ; do  myVar=$(jq '.sources |= with_entries(.key |= sub("\\./"; ""))' "''${i}")
    cat <<< $myVar > "''${i}"; done
    mv solc-* solt
  '';
  
  deploy-rain = pkgs.writeShellScriptBin "deploy-rain" ''
    yarn deploy-rain --network
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
  solt-the-earth
 ];

 shellHook = ''
  source .env
  export PATH=$( npm bin ):$PATH
  # keep it fresh
  yarn install
 '';
}
