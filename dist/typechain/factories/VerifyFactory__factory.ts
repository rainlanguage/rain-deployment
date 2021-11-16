/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { VerifyFactory, VerifyFactoryInterface } from "../VerifyFactory";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_contract",
        type: "address",
      },
    ],
    name: "NewContract",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "data_",
        type: "bytes",
      },
    ],
    name: "createChild",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "admin_",
        type: "address",
      },
    ],
    name: "createChild",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "maybeChild_",
        type: "address",
      },
    ],
    name: "isChild",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506001600055611f42806100256000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80632ea72a4914610046578063eaa744d7146100df578063fc91a89714610112575b600080fd5b6100b66004803603602081101561005c57600080fd5b81019060208101813564010000000081111561007757600080fd5b82018360208201111561008957600080fd5b803590602001918460018302840111640100000000831117156100ab57600080fd5b509092509050610159565b6040805173ffffffffffffffffffffffffffffffffffffffff9092168252519081900360200190f35b6100b6600480360360208110156100f557600080fd5b503573ffffffffffffffffffffffffffffffffffffffff16610266565b6101456004803603602081101561012857600080fd5b503573ffffffffffffffffffffffffffffffffffffffff16610382565b604080519115158252519081900360200190f35b6000600260005414156101cd57604080517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c00604482015290519081900360640190fd5b600260009081556101de84846103ad565b73ffffffffffffffffffffffffffffffffffffffff8116600081815260016020819052604080832080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00169092179091555192935090917f387ea218537e939551af33bbc2dd6c53b1fee55d377a0dce288258f972cb3a9c9190a260016000559392505050565b6040805173ffffffffffffffffffffffffffffffffffffffff8316602080830191909152825180830382018152828401938490527f2ea72a4900000000000000000000000000000000000000000000000000000000909352604482018181528351606484015283516000943094632ea72a499491939283926084909201918501908083838b5b838110156103045781810151838201526020016102ec565b50505050905090810190601f1680156103315780820380516001836020036101000a031916815260200191505b5092505050602060405180830381600087803b15801561035057600080fd5b505af1158015610364573d6000803e3d6000fd5b505050506040513d602081101561037a57600080fd5b505192915050565b73ffffffffffffffffffffffffffffffffffffffff1660009081526001602052604090205460ff1690565b600080838360208110156103c057600080fd5b50604051903573ffffffffffffffffffffffffffffffffffffffff16915060009082906103ec90610430565b73ffffffffffffffffffffffffffffffffffffffff909116815260405190819003602001906000f080158015610426573d6000803e3d6000fd5b5095945050505050565b611acf8061043e8339019056fe60806040523480156200001157600080fd5b5060405162001acf38038062001acf8339810160408190526200003491620002d5565b6200006f7f5ff1fb0ce9089603e6e193667ed17164e0360a6148f4a39fc194055588948a3160008051602062001a6f8339815191526200016f565b6200008a60008051602062001a6f83398151915282620001c1565b620000c57f794e4221ebb6dd4e460d558b4ec709511d44017d6610ba89daa896c0684ddfac60008051602062001aaf8339815191526200016f565b620000e060008051602062001aaf83398151915282620001c1565b6200011b7f5a686c9d070917be517818979fb56f451f007e3ae83e96fb5a22a304929b070d60008051602062001a8f8339815191526200016f565b6200013660008051602062001a8f83398151915282620001c1565b6001600160a01b038116620001685760405162461bcd60e51b81526004016200015f9062000305565b60405180910390fd5b5062000328565b600082815260208190526040808220600201549051839285917fbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff9190a460009182526020829052604090912060020155565b620001cd8282620001d1565b5050565b600082815260208181526040909120620001f691839062000e816200024a821b17901c565b15620001cd57620002066200026a565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b600062000261836001600160a01b0384166200026e565b90505b92915050565b3390565b60006200027c8383620002bd565b620002b45750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915562000264565b50600062000264565b60009081526001919091016020526040902054151590565b600060208284031215620002e7578081fd5b81516001600160a01b0381168114620002fe578182fd5b9392505050565b6020808252600990820152680c17d050d0d3d5539560ba1b604082015260600190565b61173780620003386000396000f3fe608060405234801561001057600080fd5b50600436106101825760003560e01c80637547a867116100d857806397c3ccd81161008c578063ca15c87311610066578063ca15c87314610301578063d547741f14610314578063daea85c51461032757610182565b806397c3ccd8146102de578063a217fddf146102f1578063b8c55bfa146102f957610182565b806381e45d9a116100bd57806381e45d9a146102895780639010d07c1461029e57806391d14854146102be57610182565b80637547a8671461027957806381792e441461028157610182565b806329092d0e1161013a57806336568abe1161011457806336568abe1461023e5780633d111c7e146102515780636be018c31461025957610182565b806329092d0e146101f85780632f2ff15d1461020b57806331e658a51461021e57610182565b8063100ec9981161016b578063100ec998146101c85780631e210912146101dd578063248a9ca3146101e557610182565b806302a22337146101875780631003e2d2146101b3575b600080fd5b61019a6101953660046111d0565b61033a565b6040516101aa94939291906116b7565b60405180910390f35b6101c66101c1366004611204565b610375565b005b6101d061050f565b6040516101aa91906112fe565b6101d0610533565b6101d06101f3366004611204565b610557565b6101c66102063660046111d0565b61056c565b6101c661021936600461121c565b610695565b61023161022c3660046111d0565b6106f7565b6040516101aa919061167e565b6101c661024c36600461121c565b61076f565b6101d06107e5565b61026c610267366004611284565b610809565b6040516101aa9190611307565b6101d06108b5565b6101d06108d9565b6102916108fd565b6040516101aa91906116db565b6102b16102ac366004611263565b610921565b6040516101aa91906112d2565b6102d16102cc36600461121c565b610940565b6040516101aa91906112f3565b6101c66102ec3660046111d0565b610958565b6101d0610b6c565b6101d0610b71565b6101d061030f366004611204565b610b95565b6101c661032236600461121c565b610bac565b6101c66103353660046111d0565b610c00565b6001602081905260009182526040909120805491015463ffffffff808216916401000000008104821691680100000000000000009091041684565b806103b5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103ac906114b1565b60405180910390fd5b33600090815260016020819052604090912081015463ffffffff1610610407576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103ac9061147a565b604080516080810182528281524363ffffffff908116602080840191825283850183815260608501848152336000818152600194859052888120975188559451969093018054925191517fffffffffffffffffffffffffffffffffffffffffffffffffffffffff00000000909316968616969096177fffffffffffffffffffffffffffffffffffffffffffffffff00000000ffffffff1664010000000091861691909102177fffffffffffffffffffffffffffffffffffffffff00000000ffffffffffffffff166801000000000000000091909416029290921790925591518392917f2728c9d3205d667bbc0eefdfeda366261b4d021949630c047f3e5834b30611ab91a350565b7f9d65f741849e7609dd1e2c70f0d7da5f5433b36bfcf3ba4d27d2bb08ad2155b181565b7f2d4d1d70bd81797c3479f5c3f873a5c9203d249659c3b317cdad46367472783c81565b60009081526020819052604090206002015490565b73ffffffffffffffffffffffffffffffffffffffff81166105b9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103ac9061151f565b6105e37f794e4221ebb6dd4e460d558b4ec709511d44017d6610ba89daa896c0684ddfac33610940565b610619576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103ac9061140c565b73ffffffffffffffffffffffffffffffffffffffff8116600081815260016020819052604080832083815590910180547fffffffffffffffffffffffffffffffffffffffff000000000000000000000000169055517fbe7c7ac3248df4581c206a84aab3cb4e7d521b5398b42b681757f78a5a7d411e9190a250565b6000828152602081905260409020600201546106b3906102cc610ea3565b6106e9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103ac90611378565b6106f38282610ea7565b5050565b6106ff6111a9565b5073ffffffffffffffffffffffffffffffffffffffff1660009081526001602081815260409283902083516080810185528154815292015463ffffffff80821692840192909252640100000000810482169383019390935268010000000000000000909204909116606082015290565b610777610ea3565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16146107db576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103ac90611621565b6106f38282610f2a565b7f5ff1fb0ce9089603e6e193667ed17164e0360a6148f4a39fc194055588948a3181565b600061081b60408401602085016112b6565b63ffffffff1661082d575060006108af565b63ffffffff821661084460808501606086016112b6565b63ffffffff1611610857575060036108af565b63ffffffff821661086e60608501604086016112b6565b63ffffffff1611610881575060026108af565b63ffffffff821661089860408501602086016112b6565b63ffffffff16116108ab575060016108af565b5060005b92915050565b7f794e4221ebb6dd4e460d558b4ec709511d44017d6610ba89daa896c0684ddfac81565b7fbb496ca6fee71a17f78592fbc6fc7f04a436edb9c709c4289d6bbfbc5fd45f4d81565b7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81565b60008281526020819052604081206109399083610fad565b9392505050565b60008281526020819052604081206109399083610fb9565b73ffffffffffffffffffffffffffffffffffffffff81166109a5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103ac9061151f565b6109cf7f5a686c9d070917be517818979fb56f451f007e3ae83e96fb5a22a304929b070d33610940565b610a05576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103ac906115b3565b73ffffffffffffffffffffffffffffffffffffffff81166000908152600160208190526040909120015463ffffffff16610a6b576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103ac906115ea565b73ffffffffffffffffffffffffffffffffffffffff81166000908152600160208190526040909120015468010000000000000000900463ffffffff90811614610ae0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103ac906113d5565b73ffffffffffffffffffffffffffffffffffffffff8116600081815260016020819052604080832090910180547fffffffffffffffffffffffffffffffffffffffff00000000ffffffffffffffff16680100000000000000004363ffffffff1602179055517f9a4e757235705bd178419abc9fa645392c5c7dce5b09940a81ef76794b84bd689190a250565b600081565b7f5a686c9d070917be517818979fb56f451f007e3ae83e96fb5a22a304929b070d81565b60008181526020819052604081206108af90610fdb565b600082815260208190526040902060020154610bca906102cc610ea3565b6107db576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103ac90611556565b73ffffffffffffffffffffffffffffffffffffffff8116610c4d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103ac9061151f565b610c777f5ff1fb0ce9089603e6e193667ed17164e0360a6148f4a39fc194055588948a3133610940565b610cad576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103ac906114e8565b73ffffffffffffffffffffffffffffffffffffffff81166000908152600160208190526040909120015463ffffffff16610d13576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103ac906115ea565b73ffffffffffffffffffffffffffffffffffffffff811660009081526001602081905260409091200154640100000000900463ffffffff90811614610d84576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103ac90611443565b73ffffffffffffffffffffffffffffffffffffffff81166000908152600160208190526040909120015468010000000000000000900463ffffffff90811614610df9576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103ac906113d5565b73ffffffffffffffffffffffffffffffffffffffff8116600081815260016020819052604080832090910180547fffffffffffffffffffffffffffffffffffffffffffffffff00000000ffffffff166401000000004363ffffffff1602179055517f96bfcd230b7ff6b6fae05762edc541f5cb32225984541cf1a9c0b04bac427a5e9190a250565b60006109398373ffffffffffffffffffffffffffffffffffffffff8416610fe6565b3390565b6000828152602081905260409020610ebf9082610e81565b156106f357610ecc610ea3565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b6000828152602081905260409020610f429082611028565b156106f357610f4f610ea3565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16837ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b60405160405180910390a45050565b6000610939838361104a565b60006109398373ffffffffffffffffffffffffffffffffffffffff84166110a9565b60006108af826110c1565b6000610ff283836110a9565b6108ab575081546001818101845560008481526020808220909301849055845484825282860190935260409020919091556108af565b60006109398373ffffffffffffffffffffffffffffffffffffffff84166110c5565b81546000908210611087576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103ac9061131b565b82600001828154811061109657fe5b9060005260206000200154905092915050565b60009081526001919091016020526040902054151590565b5490565b6000818152600183016020526040812054801561119f5783547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff808301919081019060009087908390811061111657fe5b906000526020600020015490508087600001848154811061113357fe5b60009182526020808320909101929092558281526001898101909252604090209084019055865487908061116357fe5b600190038181906000526020600020016000905590558660010160008781526020019081526020016000206000905560019450505050506108af565b60009150506108af565b60408051608081018252600080825260208201819052918101829052606081019190915290565b6000602082840312156111e1578081fd5b813573ffffffffffffffffffffffffffffffffffffffff81168114610939578182fd5b600060208284031215611215578081fd5b5035919050565b6000806040838503121561122e578081fd5b82359150602083013573ffffffffffffffffffffffffffffffffffffffff81168114611258578182fd5b809150509250929050565b60008060408385031215611275578182fd5b50508035926020909101359150565b60008082840360a0811215611297578283fd5b60808112156112a4578283fd5b508291506080830135611258816116ec565b6000602082840312156112c7578081fd5b8135610939816116ec565b73ffffffffffffffffffffffffffffffffffffffff91909116815260200190565b901515815260200190565b90815260200190565b602081016004831061131557fe5b91905290565b60208082526022908201527f456e756d657261626c655365743a20696e646578206f7574206f6620626f756e60408201527f6473000000000000000000000000000000000000000000000000000000000000606082015260800190565b6020808252602f908201527f416363657373436f6e74726f6c3a2073656e646572206d75737420626520616e60408201527f2061646d696e20746f206772616e740000000000000000000000000000000000606082015260800190565b60208082526009908201527f5052494f525f42414e0000000000000000000000000000000000000000000000604082015260600190565b6020808252600c908201527f4f4e4c595f52454d4f5645520000000000000000000000000000000000000000604082015260600190565b6020808252600d908201527f5052494f525f415050524f564500000000000000000000000000000000000000604082015260600190565b60208082526009908201527f5052494f525f4144440000000000000000000000000000000000000000000000604082015260600190565b60208082526004908201527f305f494400000000000000000000000000000000000000000000000000000000604082015260600190565b6020808252600d908201527f4f4e4c595f415050524f56455200000000000000000000000000000000000000604082015260600190565b60208082526009908201527f305f414444524553530000000000000000000000000000000000000000000000604082015260600190565b60208082526030908201527f416363657373436f6e74726f6c3a2073656e646572206d75737420626520616e60408201527f2061646d696e20746f207265766f6b6500000000000000000000000000000000606082015260800190565b6020808252600b908201527f4f4e4c595f42414e4e4552000000000000000000000000000000000000000000604082015260600190565b60208082526009908201527f4e4f545f41444445440000000000000000000000000000000000000000000000604082015260600190565b6020808252602f908201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560408201527f20726f6c657320666f722073656c660000000000000000000000000000000000606082015260800190565b8151815260208083015163ffffffff90811691830191909152604080840151821690830152606092830151169181019190915260800190565b93845263ffffffff9283166020850152908216604084015216606082015260800190565b63ffffffff91909116815260200190565b63ffffffff811681146116fe57600080fd5b5056fea2646970667358221220217476e50129bd9fc5034c28f7a57366524b2b7290506d55d42997003371037a64736f6c634300060c00332d4d1d70bd81797c3479f5c3f873a5c9203d249659c3b317cdad46367472783cbb496ca6fee71a17f78592fbc6fc7f04a436edb9c709c4289d6bbfbc5fd45f4d9d65f741849e7609dd1e2c70f0d7da5f5433b36bfcf3ba4d27d2bb08ad2155b1a2646970667358221220fff02b77df48470fd6b7d4669b53c8993526d5fa9d071158de3bf637d5a2e60864736f6c634300060c0033";

export class VerifyFactory__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<VerifyFactory> {
    return super.deploy(overrides || {}) as Promise<VerifyFactory>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): VerifyFactory {
    return super.attach(address) as VerifyFactory;
  }
  connect(signer: Signer): VerifyFactory__factory {
    return super.connect(signer) as VerifyFactory__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): VerifyFactoryInterface {
    return new utils.Interface(_abi) as VerifyFactoryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): VerifyFactory {
    return new Contract(address, _abi, signerOrProvider) as VerifyFactory;
  }
}