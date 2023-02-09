import { CommonPlaidLinkOptions, PlaidHandler, Plaid } from './';

import { EIP1193Provider as ImportedEIP1193Provider } from './web3Provider';

export interface PlaidWeb3OnSuccessMetadata {
  link_session_id: string;
  wallet: {
    name: string;
  };
}

export interface ChainInformation {
  name: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls: string[];
}

export interface ChainOption {
  chainId: string;
  rpcUrl: string;
  chainInformation?: ChainInformation;
}

export type EIP1193Provider = Omit<ImportedEIP1193Provider, 'disconnect'>;

export type PlaidWeb3OnSuccess = (
  provider: EIP1193Provider,
  metadata: PlaidWeb3OnSuccessMetadata
) => void;

export interface EthereumOnboardingOptions
  extends CommonPlaidLinkOptions<PlaidWeb3OnSuccess> {
  token: string | null;
  chain: ChainOption;
}

export interface PlaidWeb3 {
  createEthereumOnboarding: (config: EthereumOnboardingOptions) => PlaidHandler;
  getCurrentEthereumProvider: (
    chainOption: ChainOption
  ) => Promise<EIP1193Provider | undefined>;
  isProviderActive: (provider: EIP1193Provider) => Promise<boolean>;
  disconnectEthereumProvider: (provider: EIP1193Provider) => Promise<void>;
}

export interface PlaidGlobalWithWeb3 extends Plaid {
  web3: () => Promise<PlaidWeb3>;
}
