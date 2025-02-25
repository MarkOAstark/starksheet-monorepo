/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type { FunctionFragment, Result } from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
} from "./common";

export interface BasicCellRendererInterface extends utils.Interface {
  functions: {
    "numberToIndex(uint256)": FunctionFragment;
    "tokenURI(uint256,bytes,string)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic: "numberToIndex" | "tokenURI"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "numberToIndex",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenURI",
    values: [BigNumberish, BytesLike, string]
  ): string;

  decodeFunctionResult(
    functionFragment: "numberToIndex",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "tokenURI", data: BytesLike): Result;

  events: {};
}

export interface BasicCellRenderer extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: BasicCellRendererInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    numberToIndex(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    tokenURI(
      id: BigNumberish,
      value: BytesLike,
      name: string,
      overrides?: CallOverrides
    ): Promise<[string]>;
  };

  numberToIndex(id: BigNumberish, overrides?: CallOverrides): Promise<string>;

  tokenURI(
    id: BigNumberish,
    value: BytesLike,
    name: string,
    overrides?: CallOverrides
  ): Promise<string>;

  callStatic: {
    numberToIndex(id: BigNumberish, overrides?: CallOverrides): Promise<string>;

    tokenURI(
      id: BigNumberish,
      value: BytesLike,
      name: string,
      overrides?: CallOverrides
    ): Promise<string>;
  };

  filters: {};

  estimateGas: {
    numberToIndex(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenURI(
      id: BigNumberish,
      value: BytesLike,
      name: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    numberToIndex(
      id: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tokenURI(
      id: BigNumberish,
      value: BytesLike,
      name: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
