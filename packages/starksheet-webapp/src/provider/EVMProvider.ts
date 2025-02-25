import { JsonRpcProvider } from "@ethersproject/providers";
import BN from "bn.js";
import { ethers } from "ethers";
import { MetaTransaction, OperationType, encodeMulti } from "ethers-multisend";
import { number } from "starknet";
import { EvmSpreadsheetContract, EvmWorksheetContract } from "../contracts";
import { MultiSendCallOnly__factory } from "../contracts/types";
import {
  Abi,
  ChainConfig,
  ChainId,
  ChainProvider,
  ChainType,
  ContractAbi,
  ContractCall,
  TransactionReceipt,
  WorksheetContract,
} from "../types";
import { bn2hex, bn2uint } from "../utils/hexUtils";
import { chainConfig } from "./chains";

/**
 * Represents an EVM-compatible implementation of the chain provider.
 */
export class EVMProvider implements ChainProvider {
  /**
   * Constructs an EVM Provider.
   */
  constructor(private provider: JsonRpcProvider, private config: ChainConfig) {}

  async addressAlreadyDeployed(address: string) {
    return (await this.provider.getCode(address)).length > 2;
  }

  /**
   * Builds an EVM provider for the given rpc and config
   */
  public static build(rpcUrl: string, config: ChainConfig): EVMProvider {
    const provider = new JsonRpcProvider(rpcUrl);
    return new EVMProvider(provider, config);
  }

  /**
   * @inheritDoc
   */
  async callContract(call: ContractCall): Promise<string> {
    const result = await this.provider.call({
      to: call.to,
      data: this.contractCallToEVMCalldata(call),
    });
    return result;
  }

  /**
   *
   * Convert a ContractCall to an EVM call. The BN are converted using bn2uint (ie. padding with 0 at left) because
   * they come from hex strings,
   * @param call
   * @returns
   */
  contractCallToEVMCalldata(call: ContractCall): string {
    return (
      "0x" +
      bn2uint(4)(call.selector! as BN) +
      (call.calldata as BN[]).map(bn2uint(32)).join("")
    );
  }

  /**
   * @inheritDoc
   */
  async getAbi(address: string): Promise<Abi> {
    // build the query parameters
    const params = new URLSearchParams({
      action: "getabi",
      address,
      apikey: process.env.REACT_APP_EXPLORER_KEY || "",
      module: "contract",
    });
    // build the query url
    const url = new URL(this.config.explorerApiUrl!);
    url.search = params.toString();

    let abi = [];
    try {
      const rawAbi = await fetch(url)
        // check the response is not an error and decode its content to json
        .then((response) => {
          if (!response.ok) {
            return { result: [] };
          }
          return response.json();
        })
        // check the body of the response contains a "result" and returns it
        .then((data) => {
          if (!data.result) {
            throw new Error(`Unexpected error, got ${JSON.stringify(data)}`);
          }
          return data.result;
        });

      if (rawAbi === "Contract source code not verified") {
        return [];
        // todo: throw error
      }

      if (rawAbi === "Invalid Address format") {
        return [];
        // todo: throw error
      }

      // parse the raw abi and return it
      abi = JSON.parse(rawAbi);
    } catch (error) {
      abi = [];
    }
    return abi;
  }

  parseAbi(abi: Abi): ContractAbi {
    try {
      const iface = new ethers.utils.Interface(abi);
      return iface.fragments.reduce(
        (prev, cur) => ({
          ...prev,
          [iface.getSighash(cur)]: cur,
        }),
        {}
      );
    } catch {
      return {};
    }
  }

  /**
   * @inheritDoc
   */
  getChainId(): ChainId {
    return this.config.chainId;
  }

  /**
   * @inheritDoc
   */
  getChainType(): ChainType {
    return this.config.chainType;
  }

  /**
   * @inheritDoc
   */
  getExplorerAddress(contractAddress: string): string {
    return `${this.config.explorerBaseUrl}${contractAddress}`;
  }

  /**
   * @inheritDoc
   */
  getNftMarketplaceAddress(contractAddress: string): string {
    return `${this.config.nftBaseUrl}${contractAddress}`;
  }

  /**
   * @inheritDoc
   */
  getSpreadsheetContract(): EvmSpreadsheetContract {
    const address = this.config.addresses.spreadsheet;
    return new EvmSpreadsheetContract(address, this.provider);
  }

  /**
   * @inheritDoc
   */
  async getTransactionReceipt(hash: string): Promise<TransactionReceipt> {
    const receipt = await this.provider.getTransactionReceipt(hash);
    return {
      transaction_hash: receipt.transactionHash,
      status: receipt.status,
    };
  }

  /**
   * @inheritDoc
   */
  getWorksheetContractByAddress(address: string): WorksheetContract {
    return new EvmWorksheetContract(address, this.provider);
  }

  /**
   * @inheritDoc
   */
  async waitForTransaction(hash: string): Promise<void> {
    const transaction = await this.provider.getTransaction(hash);
    await transaction.wait();
  }

  /**
   * @inheritDoc
   */
  execute = async (
    calls: ContractCall[],
    options: { value: number | string }
  ) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const transactions: MetaTransaction[] = calls.map((call) => ({
      to: call.to,
      value: call.value ? bn2hex(call.value) : "0x0",
      data: call.calldata as string,
      operation: OperationType.Call,
    }));

    const transaction =
      "0x" +
      encodeMulti(transactions, chainConfig.addresses.multisend).data.slice(
        2 * (1 + 4 + 32 + 32)
      );

    const value = transactions
      .map((tx) => number.toBN(tx.value))
      .reduce((prev, cur) => prev.add(cur), number.toBN(0));

    const multisend = MultiSendCallOnly__factory.connect(
      chainConfig.addresses.multisend!,
      signer
    );
    const overrides = value.gt(number.toBN(0)) ? { value: bn2hex(value) } : {};
    const tx = await multisend.multiSend(
      // encodeMulti creates a new MetaTransaction, and the data includes to bytes selector and bytes lengths
      // So we slices "0x" + bytes4 + 2 times bytes.length
      transaction,
      overrides
    );
    const receipt = await tx.wait();

    return {
      transaction_hash: receipt.transactionHash,
    };
  };

  async login(): Promise<string> {
    if (!window.ethereum) {
      throw new Error("Metamask not detected");
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      return accounts[0];
    } catch (error) {
      throw new Error("login failed");
    }
  }
}
