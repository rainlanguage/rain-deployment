let
 pkgs = import <nixpkgs> {};

 solt-the-earth = pkgs.writeShellScriptBin "solt-the-earth" ''
  mkdir -p solt
  find contracts/rain-protocol -type f -not -path 'contracts/test/*' | xargs -i solt write '{}' --npm --runs 100000
  mv solc-* solt
 '';

 compile = pkgs.writeShellScriptBin "compile" ''
  yarn compile --force
 '';
  
in
pkgs.stdenv.mkDerivation {
 name = "shell";
 buildInputs = [
  pkgs.nodejs-14_x
  solt-the-earth
  compile
 ];

 shellHook = ''
  source .env
  export PATH=$( npm bin ):$PATH
  # keep it fresh
  yarn install
 '';
}
