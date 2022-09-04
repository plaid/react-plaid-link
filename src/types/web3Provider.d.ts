// This is a partial version of @web3-onboard/common's EIP-1193 type
// https://github.com/blocknative/web3-onboard/blob/v2-web3-onboard-develop/packages/common/src/types.ts#L345
// Importing the types via the module would be preferred, but this creates issues when generating a
// rolled up .d.ts.
// Specifically, the default rollup-plugin-ts uses the default tsc --declaration output,
// which does not roll up module type definitions. rollup-plugin-dts only rolls up the immediately
// imported modules, but does not roll-up nested/transitive modules, which these EIP-1193 types
// have via the `eip-712` package.
// So, for now we copy the EIP-1193 types here and change the `eth_signTypedData` type to be
// `unknown`

declare type ChainId = string;
interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}
interface ProviderMessage {
  type: string;
  data: unknown;
}
interface ProviderInfo {
  chainId: ChainId;
}
declare type AccountAddress = string;
/**
 * An array of addresses
 */
declare type ProviderAccounts = AccountAddress[];
declare type ProviderEvent =
  | 'connect'
  | 'disconnect'
  | 'message'
  | 'chainChanged'
  | 'accountsChanged';
interface SimpleEventEmitter {
  on(
    event: ProviderEvent,
    listener:
      | ConnectListener
      | DisconnectListener
      | MessageListener
      | ChainListener
      | AccountsListener
  ): void;
  removeListener(
    event: ProviderEvent,
    listener:
      | ConnectListener
      | DisconnectListener
      | MessageListener
      | ChainListener
      | AccountsListener
  ): void;
}
declare type ConnectListener = (info: ProviderInfo) => void;
declare type DisconnectListener = (error: ProviderRpcError) => void;
declare type MessageListener = (message: ProviderMessage) => void;
declare type ChainListener = (chainId: ChainId) => void;
declare type AccountsListener = (accounts: ProviderAccounts) => void;
/**
 * The hexadecimal representation of the users
 */
declare type Balance = string;
interface TransactionObject {
  data?: string;
  from: string;
  gas?: string;
  gasLimit?: string;
  gasPrice?: string;
  to: string;
  chainId: number;
  value?: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  nonce?: string;
}
interface BaseRequest {
  params?: never;
}
interface EthAccountsRequest extends BaseRequest {
  method: 'eth_accounts';
}
interface EthChainIdRequest extends BaseRequest {
  method: 'eth_chainId';
}
interface EthSignTransactionRequest {
  method: 'eth_signTransaction';
  params: [TransactionObject];
}
declare type Address = string;
declare type Message = string;
interface EthSignMessageRequest {
  method: 'eth_sign';
  params: [Address, Message];
}
interface PersonalSignMessageRequest {
  method: 'personal_sign';
  params: [Message, Address];
}
interface EIP712Request {
  method: 'eth_signTypedData';
  // This is marked as unknown in this fork
  params: [Address, unknown];
}
interface EthBalanceRequest {
  method: 'eth_getBalance';
  params: [string, (number | 'latest' | 'earliest' | 'pending')?];
}
interface EIP1102Request extends BaseRequest {
  method: 'eth_requestAccounts';
}
interface SelectAccountsRequest extends BaseRequest {
  method: 'eth_selectAccounts';
}
interface EIP3085Request {
  method: 'wallet_addEthereumChain';
  params: AddChainParams[];
}
interface EIP3326Request {
  method: 'wallet_switchEthereumChain';
  params: [
    {
      chainId: ChainId;
    }
  ];
}
declare type AddChainParams = {
  chainId: ChainId;
  chainName?: string;
  nativeCurrency: {
    name?: string;
    symbol?: string;
    decimals: number;
  };
  rpcUrls: string[];
};
export interface EIP1193Provider extends SimpleEventEmitter {
  on(event: 'connect', listener: ConnectListener): void;
  on(event: 'disconnect', listener: DisconnectListener): void;
  on(event: 'message', listener: MessageListener): void;
  on(event: 'chainChanged', listener: ChainListener): void;
  on(event: 'accountsChanged', listener: AccountsListener): void;
  request(args: EthAccountsRequest): Promise<ProviderAccounts>;
  request(args: EthBalanceRequest): Promise<Balance>;
  request(args: EIP1102Request): Promise<ProviderAccounts>;
  request(args: SelectAccountsRequest): Promise<ProviderAccounts>;
  request(args: EIP3326Request): Promise<null>;
  request(args: EIP3085Request): Promise<null>;
  request(args: EthChainIdRequest): Promise<ChainId>;
  request(args: EthSignTransactionRequest): Promise<string>;
  request(args: EthSignMessageRequest): Promise<string>;
  request(args: PersonalSignMessageRequest): Promise<string>;
  request(args: EIP712Request): Promise<string>;
  request(args: { method: string; params?: Array<unknown> }): Promise<unknown>;
  disconnect?(): void;
}
