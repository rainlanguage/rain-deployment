/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  BalancerSafeMathMock,
  BalancerSafeMathMockInterface,
} from "../BalancerSafeMathMock";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "a",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "b",
        type: "uint256",
      },
    ],
    name: "badd",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "a",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "b",
        type: "uint256",
      },
    ],
    name: "baverage",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "a",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "b",
        type: "uint256",
      },
    ],
    name: "bdiv",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "a",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "b",
        type: "uint256",
      },
    ],
    name: "bmax",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "a",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "b",
        type: "uint256",
      },
    ],
    name: "bmin",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "a",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "b",
        type: "uint256",
      },
    ],
    name: "bmod",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "a",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "b",
        type: "uint256",
      },
    ],
    name: "bmul",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "a",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "b",
        type: "uint256",
      },
    ],
    name: "bsub",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610595806100206000396000f3fe608060405234801561001057600080fd5b50600436106100785760003560e01c80630b71b95c1461007d5780633cf3c7d4146100b25780634b293a61146100d55780637673eb11146100f85780638c051bf31461011b5780638f73b80c1461013e578063a0a034b414610161578063dd6d85c414610184575b600080fd5b6100a06004803603604081101561009357600080fd5b50803590602001356101a7565b60408051918252519081900360200190f35b6100a0600480360360408110156100c857600080fd5b50803590602001356101bc565b6100a0600480360360408110156100eb57600080fd5b50803590602001356101c8565b6100a06004803603604081101561010e57600080fd5b50803590602001356101d4565b6100a06004803603604081101561013157600080fd5b50803590602001356101e0565b6100a06004803603604081101561015457600080fd5b50803590602001356101ec565b6100a06004803603604081101561017757600080fd5b50803590602001356101f8565b6100a06004803603604081101561019a57600080fd5b5080359060200135610204565b60006101b38383610210565b90505b92915050565b60006101b3838361025d565b60006101b383836102bf565b60006101b38383610319565b60006101b38383610429565b60006101b383836104ef565b60006101b38383610505565b60006101b38383610515565b6000828201838110156101b3576040805162461bcd60e51b815260206004820152601060248201526f4552525f4144445f4f564552464c4f5760801b604482015290519081900360640190fd5b600080600061026c858561053a565b9150915080156102b7576040805162461bcd60e51b81526020600482015260116024820152704552525f5355425f554e444552464c4f5760781b604482015290519081900360640190fd5b509392505050565b600081610308576040805162461bcd60e51b81526020600482015260126024820152714552525f4d4f44554c4f5f42595f5a45524f60701b604482015290519081900360640190fd5b81838161031157fe5b069392505050565b60008161035c576040805162461bcd60e51b815260206004820152600c60248201526b4552525f4449565f5a45524f60a01b604482015290519081900360640190fd5b82610369575060006101b6565b670de0b6b3a76400008381029084828161037f57fe5b04146103c5576040805162461bcd60e51b815260206004820152601060248201526f11549497d1125597d25395115493905360821b604482015290519081900360640190fd5b60028304810181811015610413576040805162461bcd60e51b815260206004820152601060248201526f11549497d1125597d25395115493905360821b604482015290519081900360640190fd5b600084828161041e57fe5b049695505050505050565b600082610438575060006101b6565b8282028284828161044557fe5b041461048b576040805162461bcd60e51b815260206004820152601060248201526f4552525f4d554c5f4f564552464c4f5760801b604482015290519081900360640190fd5b6706f05b59d3b200008101818110156104de576040805162461bcd60e51b815260206004820152601060248201526f4552525f4d554c5f4f564552464c4f5760801b604482015290519081900360640190fd5b6000670de0b6b3a76400008261041e565b60008183106104fe57816101b3565b5090919050565b6000818310156104fe57816101b3565b6000600280830660028506018161052857fe5b04600283046002850401019392505050565b6000808383116105505750508082036000610558565b505081810360015b925092905056fea2646970667358221220092ab1575b04cc7e093a187d1268d4702d46d9ab0af018d899bfeb32acd817f064736f6c634300060c0033";

export class BalancerSafeMathMock__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<BalancerSafeMathMock> {
    return super.deploy(overrides || {}) as Promise<BalancerSafeMathMock>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): BalancerSafeMathMock {
    return super.attach(address) as BalancerSafeMathMock;
  }
  connect(signer: Signer): BalancerSafeMathMock__factory {
    return super.connect(signer) as BalancerSafeMathMock__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BalancerSafeMathMockInterface {
    return new utils.Interface(_abi) as BalancerSafeMathMockInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): BalancerSafeMathMock {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as BalancerSafeMathMock;
  }
}