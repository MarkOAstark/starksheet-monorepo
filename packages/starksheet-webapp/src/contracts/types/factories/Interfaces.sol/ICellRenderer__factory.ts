/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  ICellRenderer,
  ICellRendererInterface,
} from "../../Interfaces.sol/ICellRenderer";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "value",
        type: "bytes",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
    ],
    name: "tokenURI",
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
] as const;

export class ICellRenderer__factory {
  static readonly abi = _abi;
  static createInterface(): ICellRendererInterface {
    return new utils.Interface(_abi) as ICellRendererInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ICellRenderer {
    return new Contract(address, _abi, signerOrProvider) as ICellRenderer;
  }
}
