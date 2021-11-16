/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, BigNumberish } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { ClaimERC1155Test } from "../ClaimERC1155Test";

export class ClaimERC1155Test__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    redeemableToken_: string,
    tierValues_: [
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ],
    overrides?: Overrides
  ): Promise<ClaimERC1155Test> {
    return super.deploy(
      redeemableToken_,
      tierValues_,
      overrides || {}
    ) as Promise<ClaimERC1155Test>;
  }
  getDeployTransaction(
    redeemableToken_: string,
    tierValues_: [
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ],
    overrides?: Overrides
  ): TransactionRequest {
    return super.getDeployTransaction(
      redeemableToken_,
      tierValues_,
      overrides || {}
    );
  }
  attach(address: string): ClaimERC1155Test {
    return super.attach(address) as ClaimERC1155Test;
  }
  connect(signer: Signer): ClaimERC1155Test__factory {
    return super.connect(signer) as ClaimERC1155Test__factory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ClaimERC1155Test {
    return new Contract(address, _abi, signerOrProvider) as ClaimERC1155Test;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "redeemableToken_",
        type: "address",
      },
      {
        internalType: "uint256[8]",
        name: "tierValues_",
        type: "uint256[8]",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "Claim",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "enum ITier.Tier",
        name: "startTier",
        type: "uint8",
      },
      {
        indexed: true,
        internalType: "enum ITier.Tier",
        name: "endTier",
        type: "uint8",
      },
    ],
    name: "TierChange",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "TransferBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "TransferSingle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "value",
        type: "string",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "URI",
    type: "event",
  },
  {
    inputs: [],
    name: "ART",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "GOOD_ART",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "accounts",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
    ],
    name: "balanceOfBatch",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account_",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "data_",
        type: "bytes",
      },
    ],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "claims",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "constructionBlock",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "erc20",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account_",
        type: "address",
      },
      {
        internalType: "enum ITier.Tier",
        name: "minimumTier_",
        type: "uint8",
      },
    ],
    name: "isTier",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minimumTier",
    outputs: [
      {
        internalType: "enum ITier.Tier",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account_",
        type: "address",
      },
    ],
    name: "report",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "enum ITier.Tier",
        name: "",
        type: "uint8",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "setTier",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tierContract",
    outputs: [
      {
        internalType: "contract ITier",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tierValues",
    outputs: [
      {
        internalType: "uint256[8]",
        name: "tierValues_",
        type: "uint256[8]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "uri",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x6101c06040523480156200001257600080fd5b5060405162002d4a38038062002d4a83398181016040526101208110156200003957600080fd5b508051604080518082018252601d81527f68747470733a2f2f6578616d706c652e636f6d2f7b69647d2e6a736f6e0000006020808301919091528401805160809081529285015160a090815260608087015160c09081529487015160e090815291870151610100908152948701516101205290860151610140529290940151610160529082901b6001600160601b0319166101805260008054306001600160a01b031990911617905543600155600360f81b6101a052909190620001046301ffc9a760e01b6200013c565b6200010f81620001c1565b62000121636cdb3d1360e11b6200013c565b620001336303a24d0760e21b6200013c565b50505062000276565b6001600160e01b031980821614156200019c576040805162461bcd60e51b815260206004820152601c60248201527f4552433136353a20696e76616c696420696e7465726661636520696400000000604482015290519081900360640190fd5b6001600160e01b0319166000908152600360205260409020805460ff19166001179055565b8051620001d6906006906020840190620001da565b5050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200021d57805160ff19168380011785556200024d565b828001600101855582156200024d579182015b828111156200024d57825182559160200191906001019062000230565b506200025b9291506200025f565b5090565b5b808211156200025b576000815560010162000260565b60805160a05160c05160e051610100516101205161014051610160516101805160601c6101a05160f81c612a52620002f8600039806115a252806119535250806113da528061185b5250806112f95250806112d35250806112ad52508061128752508061126152508061123b5250806112155250806111f25250612a526000f3fe608060405234801561001057600080fd5b506004361061016b5760003560e01c8063785e9e86116100cd578063c6788bdd11610081578063e985e9c511610066578063e985e9c5146108ea578063f1ebd5dd14610925578063f242432a1461094e5761016b565b8063c6788bdd14610884578063e053ea31146108b75761016b565b8063a22cb465116100b2578063a22cb4651461077e578063a30872db146107b9578063bb1757cf146107c15761016b565b8063785e9e86146107455780639cb84a01146107765761016b565b80633acf301b1161012457806352dab69d1161010957806352dab69d146105fd57806370230b39146106c857806377544f33146107095761016b565b80633acf301b1461047e5780634e1273f4146104865761016b565b80630e89341c116101555780630e89341c1461020e5780630f0af57f146102a05780632eb2c2d6146102a85761016b565b8062fdd58e1461017057806301ffc9a7146101bb575b600080fd5b6101a96004803603604081101561018657600080fd5b5073ffffffffffffffffffffffffffffffffffffffff8135169060200135610a26565b60408051918252519081900360200190f35b6101fa600480360360208110156101d157600080fd5b50357fffffffff0000000000000000000000000000000000000000000000000000000016610acc565b604080519115158252519081900360200190f35b61022b6004803603602081101561022457600080fd5b5035610b07565b6040805160208082528351818301528351919283929083019185019080838360005b8381101561026557818101518382015260200161024d565b50505050905090810190601f1680156102925780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6101a9610bbd565b61047c600480360360a08110156102be57600080fd5b73ffffffffffffffffffffffffffffffffffffffff82358116926020810135909116918101906060810160408201356401000000008111156102ff57600080fd5b82018360208201111561031157600080fd5b8035906020019184602083028401116401000000008311171561033357600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250929594936020810193503591505064010000000081111561038357600080fd5b82018360208201111561039557600080fd5b803590602001918460208302840111640100000000831117156103b757600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250929594936020810193503591505064010000000081111561040757600080fd5b82018360208201111561041957600080fd5b8035906020019184600183028401116401000000008311171561043b57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550610bc3945050505050565b005b6101a9610f96565b6105ad6004803603604081101561049c57600080fd5b8101906020810181356401000000008111156104b757600080fd5b8201836020820111156104c957600080fd5b803590602001918460208302840111640100000000831117156104eb57600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250929594936020810193503591505064010000000081111561053b57600080fd5b82018360208201111561054d57600080fd5b8035906020019184602083028401116401000000008311171561056f57600080fd5b919080806020026020016040519081016040528093929190818152602001838360200280828437600092019190915250929550610f9b945050505050565b60408051602080825283518183015283519192839290830191858101910280838360005b838110156105e95781810151838201526020016105d1565b505050509050019250505060405180910390f35b61047c6004803603606081101561061357600080fd5b73ffffffffffffffffffffffffffffffffffffffff8235169160ff6020820135169181019060608101604082013564010000000081111561065357600080fd5b82018360208201111561066557600080fd5b8035906020019184600183028401116401000000008311171561068757600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550611181945050505050565b6106d06111e8565b604051808261010080838360005b838110156106f65781810151838201526020016106de565b5050505090500191505060405180910390f35b6101fa6004803603604081101561071f57600080fd5b50803573ffffffffffffffffffffffffffffffffffffffff16906020013560ff16611321565b61074d6113d8565b6040805173ffffffffffffffffffffffffffffffffffffffff9092168252519081900360200190f35b6101a96113fc565b61047c6004803603604081101561079457600080fd5b5073ffffffffffffffffffffffffffffffffffffffff81351690602001351515611401565b61074d61155c565b61047c600480360360408110156107d757600080fd5b73ffffffffffffffffffffffffffffffffffffffff823516919081019060408101602082013564010000000081111561080f57600080fd5b82018360208201111561082157600080fd5b8035906020019184600183028401116401000000008311171561084357600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550611578945050505050565b6101fa6004803603602081101561089a57600080fd5b503573ffffffffffffffffffffffffffffffffffffffff1661183b565b6101a9600480360360208110156108cd57600080fd5b503573ffffffffffffffffffffffffffffffffffffffff16611850565b6101fa6004803603604081101561090057600080fd5b5073ffffffffffffffffffffffffffffffffffffffff81358116916020013516611916565b61092d611951565b6040518082600881111561093d57fe5b815260200191505060405180910390f35b61047c600480360360a081101561096457600080fd5b73ffffffffffffffffffffffffffffffffffffffff823581169260208101359091169160408201359160608101359181019060a0810160808201356401000000008111156109b157600080fd5b8201836020820111156109c357600080fd5b803590602001918460018302840111640100000000831117156109e557600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550611975945050505050565b600073ffffffffffffffffffffffffffffffffffffffff8316610a94576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602b81526020018061287c602b913960400191505060405180910390fd5b50600081815260046020908152604080832073ffffffffffffffffffffffffffffffffffffffff861684529091529020545b92915050565b7fffffffff00000000000000000000000000000000000000000000000000000000811660009081526003602052604090205460ff165b919050565b60068054604080516020601f60027fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff610100600188161502019095169490940493840181900481028201810190925282815260609390929091830182828015610bb15780601f10610b8657610100808354040283529160200191610bb1565b820191906000526020600020905b815481529060010190602001808311610b9457829003601f168201915b50505050509050919050565b60015481565b8151835114610c1d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260288152602001806129d46028913960400191505060405180910390fd5b73ffffffffffffffffffffffffffffffffffffffff8416610c89576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260258152602001806129016025913960400191505060405180910390fd5b610c91611bc2565b73ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff161480610cd65750610cd685610cd1611bc2565b611916565b610d2b576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260328152602001806129266032913960400191505060405180910390fd5b6000610d35611bc2565b9050610d45818787878787610f8e565b60005b8451811015610e7f576000858281518110610d5f57fe5b602002602001015190506000858381518110610d7757fe5b60200260200101519050610dfe816040518060600160405280602a8152602001612958602a91396004600086815260200190815260200160002060008d73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611bc69092919063ffffffff16565b600083815260046020908152604080832073ffffffffffffffffffffffffffffffffffffffff8e811685529252808320939093558a1681522054610e429082611c77565b600092835260046020908152604080852073ffffffffffffffffffffffffffffffffffffffff8c1686529091529092209190915550600101610d48565b508473ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8787604051808060200180602001838103835285818151815260200191508051906020019060200280838360005b83811015610f2c578181015183820152602001610f14565b50505050905001838103825284818151815260200191508051906020019060200280838360005b83811015610f6b578181015183820152602001610f53565b5050505090500194505050505060405180910390a4610f8e818787878787611cf2565b505050505050565b600181565b60608151835114610ff7576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260298152602001806129ab6029913960400191505060405180910390fd5b6060835167ffffffffffffffff8111801561101157600080fd5b5060405190808252806020026020018201604052801561103b578160200160208202803683370190505b50905060005b845181101561117957600073ffffffffffffffffffffffffffffffffffffffff1685828151811061106e57fe5b602002602001015173ffffffffffffffffffffffffffffffffffffffff1614156110e3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260318152602001806128a76031913960400191505060405180910390fd5b600460008583815181106110f357fe5b60200260200101518152602001908152602001600020600086838151811061111757fe5b602002602001015173ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205482828151811061116657fe5b6020908102919091010152600101611041565b509392505050565b604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600860248201527f5345545f54494552000000000000000000000000000000000000000000000000604482015290519081900360640190fd5b6111f0612719565b7f000000000000000000000000000000000000000000000000000000000000000081527f000000000000000000000000000000000000000000000000000000000000000060208201527f000000000000000000000000000000000000000000000000000000000000000060408201527f000000000000000000000000000000000000000000000000000000000000000060608201527f000000000000000000000000000000000000000000000000000000000000000060808201527f000000000000000000000000000000000000000000000000000000000000000060a08201527f000000000000000000000000000000000000000000000000000000000000000060c08201527f000000000000000000000000000000000000000000000000000000000000000060e08201525b90565b60008054604080517fe053ea3100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff868116600483015291516113cc93929092169163e053ea3191602480820192602092909190829003018186803b15801561139a57600080fd5b505afa1580156113ae573d6000803e3d6000fd5b505050506040513d60208110156113c457600080fd5b505183612024565b60015410159392505050565b7f000000000000000000000000000000000000000000000000000000000000000081565b600081565b8173ffffffffffffffffffffffffffffffffffffffff16611420611bc2565b73ffffffffffffffffffffffffffffffffffffffff16141561148d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260298152602001806129826029913960400191505060405180910390fd5b806005600061149a611bc2565b73ffffffffffffffffffffffffffffffffffffffff90811682526020808301939093526040918201600090812091871680825291909352912080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001692151592909217909155611509611bc2565b73ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c318360405180821515815260200191505060405180910390a35050565b60005473ffffffffffffffffffffffffffffffffffffffff1681565b73ffffffffffffffffffffffffffffffffffffffff821660009081526002602052604090205482907f00000000000000000000000000000000000000000000000000000000000000009060ff161561163157604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600f60248201527f4455504c49434154455f434c41494d0000000000000000000000000000000000604482015290519081900360640190fd5b73ffffffffffffffffffffffffffffffffffffffff8416600081815260026020908152604080832080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00166001179055805182815287518184015287517fa16751aa65ef03fb7261c0a125a84854295c191657bda7151d4396246b1bbeb49489949293849390840192908601918190849084905b838110156116de5781810151838201526020016116c6565b50505050905090810190601f16801561170b5780820380516001836020036101000a031916815260200191505b509250505060405180910390a2600054604080517fe053ea3100000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff808816600483015291516117c0938893169163e053ea31916024808301926020929190829003018186803b15801561178e57600080fd5b505afa1580156117a2573d6000803e3d6000fd5b505050506040513d60208110156117b857600080fd5b50518561206a565b6117ca8282611321565b61183557604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152600c60248201527f4d494e494d554d5f544945520000000000000000000000000000000000000000604482015290519081900360640190fd5b50505050565b60026020526000908152604090205460ff1681565b6000610ac6816119117f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff166370a08231866040518263ffffffff1660e01b8152600401808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060206040518083038186803b1580156118e057600080fd5b505afa1580156118f4573d6000803e3d6000fd5b505050506040513d602081101561190a57600080fd5b5051612164565b6121b5565b73ffffffffffffffffffffffffffffffffffffffff918216600090815260056020908152604080832093909416825291909152205460ff1690565b7f000000000000000000000000000000000000000000000000000000000000000081565b73ffffffffffffffffffffffffffffffffffffffff84166119e1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260258152602001806129016025913960400191505060405180910390fd5b6119e9611bc2565b73ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff161480611a295750611a2985610cd1611bc2565b611a7e576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260298152602001806128d86029913960400191505060405180910390fd5b6000611a88611bc2565b9050611aa8818787611a99886121fb565b611aa2886121fb565b87610f8e565b611afc836040518060600160405280602a8152602001612958602a9139600087815260046020908152604080832073ffffffffffffffffffffffffffffffffffffffff8d1684529091529020549190611bc6565b600085815260046020908152604080832073ffffffffffffffffffffffffffffffffffffffff8b81168552925280832093909355871681522054611b409084611c77565b600085815260046020908152604080832073ffffffffffffffffffffffffffffffffffffffff808b168086529184529382902094909455805188815291820187905280518a8416938616927fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f6292908290030190a4610f8e81878787878761223f565b3390565b60008184841115611c6f576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825283818151815260200191508051906020019080838360005b83811015611c34578181015183820152602001611c1c565b50505050905090810190601f168015611c615780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b505050900390565b600082820183811015611ceb57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b9392505050565b611d118473ffffffffffffffffffffffffffffffffffffffff1661242f565b15610f8e578373ffffffffffffffffffffffffffffffffffffffff1663bc197c8187878686866040518663ffffffff1660e01b8152600401808673ffffffffffffffffffffffffffffffffffffffff1681526020018573ffffffffffffffffffffffffffffffffffffffff168152602001806020018060200180602001848103845287818151815260200191508051906020019060200280838360005b83811015611dc6578181015183820152602001611dae565b50505050905001848103835286818151815260200191508051906020019060200280838360005b83811015611e05578181015183820152602001611ded565b50505050905001848103825285818151815260200191508051906020019080838360005b83811015611e41578181015183820152602001611e29565b50505050905090810190601f168015611e6e5780820380516001836020036101000a031916815260200191505b5098505050505050505050602060405180830381600087803b158015611e9357600080fd5b505af1925050508015611eb857506040513d6020811015611eb357600080fd5b505160015b611f8157611ec461273e565b80611ecf5750611f30565b6040517f08c379a0000000000000000000000000000000000000000000000000000000008152602060048201818152835160248401528351849391928392604401919085019080838360008315611c34578181015183820152602001611c1c565b6040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260348152602001806128206034913960400191505060405180910390fd5b7fffffffff0000000000000000000000000000000000000000000000000000000081167fbc197c81000000000000000000000000000000000000000000000000000000001461201b576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260288152602001806128546028913960400191505060405180910390fd5b50505050505050565b60008082600881111561203357fe5b141561204157506000610ac6565b6000600183600881111561205157fe5b0360200290508084901c63ffffffff1691505092915050565b6000612077846005611321565b604080516002808252606080830184529394509091602083019080368337505060408051600280825260608083018452949550909250906020830190803683370190505090506000826000815181106120cc57fe5b6020026020010181815250506001826001815181106120e757fe5b602002602001018181525050826120ff576001612102565b60025b60ff168160008151811061211257fe5b6020026020010181815250508261212a57600061212d565b60015b60ff168160018151811061213d57fe5b602002602001018181525050610f8e86838360405180602001604052806000815250612435565b6000805b60088110156121ac576121796111e8565b816008811061218457fe5b60200201518310156121a45780600881111561219c57fe5b915050610b02565b600101612168565b50600892915050565b6000808260088111156121c457fe5b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff60209190910290811c901b841791505092915050565b60408051600180825281830190925260609182919060208083019080368337019050509050828160008151811061222e57fe5b602090810291909101015292915050565b61225e8473ffffffffffffffffffffffffffffffffffffffff1661242f565b15610f8e578373ffffffffffffffffffffffffffffffffffffffff1663f23a6e6187878686866040518663ffffffff1660e01b8152600401808673ffffffffffffffffffffffffffffffffffffffff1681526020018573ffffffffffffffffffffffffffffffffffffffff16815260200184815260200183815260200180602001828103825283818151815260200191508051906020019080838360005b838110156123145781810151838201526020016122fc565b50505050905090810190601f1680156123415780820380516001836020036101000a031916815260200191505b509650505050505050602060405180830381600087803b15801561236457600080fd5b505af192505050801561238957506040513d602081101561238457600080fd5b505160015b61239557611ec461273e565b7fffffffff0000000000000000000000000000000000000000000000000000000081167ff23a6e61000000000000000000000000000000000000000000000000000000001461201b576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260288152602001806128546028913960400191505060405180910390fd5b3b151590565b73ffffffffffffffffffffffffffffffffffffffff84166124a1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260218152602001806129fc6021913960400191505060405180910390fd5b81518351146124fb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260288152602001806129d46028913960400191505060405180910390fd5b6000612505611bc2565b905061251681600087878787610f8e565b60005b8451811015612601576125ab6004600087848151811061253557fe5b6020026020010151815260200190815260200160002060008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205485838151811061259557fe5b6020026020010151611c7790919063ffffffff16565b600460008784815181106125bb57fe5b6020908102919091018101518252818101929092526040908101600090812073ffffffffffffffffffffffffffffffffffffffff8b168252909252902055600101612519565b508473ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8787604051808060200180602001838103835285818151815260200191508051906020019060200280838360005b838110156126af578181015183820152602001612697565b50505050905001838103825284818151815260200191508051906020019060200280838360005b838110156126ee5781810151838201526020016126d6565b5050505090500194505050505060405180910390a461271281600087878787611cf2565b5050505050565b6040518061010001604052806008906020820280368337509192915050565b60e01c90565b600060443d101561274e5761131e565b600481823e6308c379a06127628251612738565b1461276c5761131e565b6040517ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc3d016004823e80513d67ffffffffffffffff81602484011181841117156127ba575050505061131e565b828401925082519150808211156127d4575050505061131e565b503d830160208284010111156127ec5750505061131e565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01681016020016040529150509056fe455243313135353a207472616e7366657220746f206e6f6e2045524331313535526563656976657220696d706c656d656e746572455243313135353a204552433131353552656365697665722072656a656374656420746f6b656e73455243313135353a2062616c616e636520717565727920666f7220746865207a65726f2061646472657373455243313135353a2062617463682062616c616e636520717565727920666f7220746865207a65726f2061646472657373455243313135353a2063616c6c6572206973206e6f74206f776e6572206e6f7220617070726f766564455243313135353a207472616e7366657220746f20746865207a65726f2061646472657373455243313135353a207472616e736665722063616c6c6572206973206e6f74206f776e6572206e6f7220617070726f766564455243313135353a20696e73756666696369656e742062616c616e636520666f72207472616e73666572455243313135353a2073657474696e6720617070726f76616c2073746174757320666f722073656c66455243313135353a206163636f756e747320616e6420696473206c656e677468206d69736d61746368455243313135353a2069647320616e6420616d6f756e7473206c656e677468206d69736d61746368455243313135353a206d696e7420746f20746865207a65726f2061646472657373a2646970667358221220965d38e8bfab58812abade85f3c83328a98cd8efc473583b6c07d5ced8c8114e64736f6c634300060c0033";