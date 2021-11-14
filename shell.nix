let
 pkgs = import <nixpkgs> {};

  build-solt = pkgs.writeShellScriptBin "build-solt" ''
  mkdir -p solt
  find contracts/balancer-core -type f -not -path 'contracts/balancer-core/contracts/test/*' | xargs -i solt write '{}' --npm --runs 100
  find contracts/configurable-rights-pool -type f -not -path 'contracts/configurable-rights-pool/contracts/test/*' | xargs -i solt write '{}' --npm --runs 200
  find contracts/rain-protocol -type f -not -path 'contracts/rain-protocol/contracts/test/*' | xargs -i solt write '{}' --npm --runs 100000
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
  
in
pkgs.stdenv.mkDerivation {
 name = "shell";
 buildInputs = [
  pkgs.nodejs-14_x
  json-compile
  compile
  build-solt
 ];

 shellHook = ''
  source .env
  export PATH=$( npm bin ):$PATH
  # keep it fresh
  yarn install
 '';
}
