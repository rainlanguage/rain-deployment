## NIX-SHELL

# Build solt
You should have installed nix-shell. Run inside nix to build new Input JSON Description files (solt files). 
The script will created and add specified specific optimizer runs for each "contracts types". Ex: Rain protocol contracts with 100000 optimizer runs and Balacer core contracts with 100 optimizer runs
```shell
build solt
```

# Compile from solt JSON
This is a custom script to compile from Solt files. It is for testing purpose and must be ignored. You should have the correct solc version in you computer to run it. It is specific only for the target contracts on the script with the solc compiler v0.6.12+commit.27d51765. In nix-shell run:
```shel
json-compile
```
# Hardhat compile
This command will force hardhat to compile. Run `compile`
