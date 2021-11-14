let
 pkgs = import <nixpkgs> {};

 solt-the-earth = pkgs.writeShellScriptBin "solt-the-earth" ''
  mkdir -p solt
  find contracts/rain-protocol -type f -not -path 'contracts/test/*' | xargs -i solt write '{}' --npm --runs 100000
  mv solc-* solt
 '';

 build-solt = pkgs.writeShellScriptBin "build-solt" ''
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
  solt-the-earth
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
