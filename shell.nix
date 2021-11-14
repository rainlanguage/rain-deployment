let
 pkgs = import <nixpkgs> {};

 build-solt = pkgs.writeShellScriptBin "build-solt" ''
  mkdir -p solt
  solt write contracts/balancer-core/contracts/BFactory.sol --npm --runs 100
  find contracts/configurable-rights-pool -type f -not -path 'contracts/configurable-rights-pool/contracts/test/*' | xargs -i solt write '{}' --npm --runs 200
  mv solc-* solt
 '';

 json-compile = pkgs.writeShellScriptBin "json-compile" ''
  mkdir -p new
  solc --standard-json scripts/dist/solt/solc-input-redeemableerc20factory.json | cat > data-redeemableerc20factory.json
  solc --standard-json scripts/dist/solt/solc-input-redeemableerc20poolfactory.json | cat > data-redeemableerc20poolfactory.json
  solc --standard-json scripts/dist/solt/solc-input-seederc20factory.json | cat > data-seederc20factory.json
  solc --standard-json scripts/dist/solt/solc-input-trustfactory.json | cat > data-trustfactory.json
  mv data-* new
 '';

 compile = pkgs.writeShellScriptBin "compile" ''
  yarn compile
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
  json-compile
  compile
  build-solt
  deploy-rain-mumbai
  deploy-rain-reef-testnet
  deploy-rain
 ];

 shellHook = ''
  source .env
  export PATH=$( npm bin ):$PATH
  # keep it fresh
  yarn install
 '';
}
