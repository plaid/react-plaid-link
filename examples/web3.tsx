import React, { useCallback } from 'react';

import {
  useEthereumProvider,
  EthereumOnboardingOptions,
  PlaidWeb3OnSuccess,
  EIP1193Provider,
} from 'react-plaid-link/web3';

import { PlaidLinkOnExit } from 'react-plaid-link';

const PlaidWeb3Link = () => {
  const token = '';

  const [walletProvider, setWalletProvider] = React.useState<EIP1193Provider>();
  const [addresses, setAddresses] = React.useState<string[]>();
  const [checkedExistingProvider, setCheckedExistingProvider] = React.useState(
    false
  );

  const onSuccess = useCallback<PlaidWeb3OnSuccess>(
    async provider => {
      setWalletProvider(provider);
    },
    [setWalletProvider]
  );
  const onExit = useCallback<PlaidLinkOnExit>((error, metadata) => {
    // log onExit callbacks from Link, handle errors
    // https://plaid.com/docs/link/web/#onexit
    console.log(error, metadata);
  }, []);

  const config: EthereumOnboardingOptions = {
    token,
    chain: {
      chainId: '0x1',
      rpcUrl: 'https://rpc.com',
    },
    onSuccess,
    onExit,
  };

  const {
    open,
    ready,
    getCurrentEthereumProvider,
    isProviderActive,
    // error,
    // exit
  } = useEthereumProvider(config);

  React.useEffect(() => {
    if (!ready) {
      return;
    }
    (async () => {
      const provider = await getCurrentEthereumProvider(config.chain);
      if (!provider) {
        setCheckedExistingProvider(true);
        return;
      }
      const isActive = await isProviderActive(provider);
      if (isActive) {
        setWalletProvider(provider);
      }
      setCheckedExistingProvider(true);
    })();

    return () => {};
  }, [
    ready,
    getCurrentEthereumProvider,
    setCheckedExistingProvider,
    isProviderActive,
    setWalletProvider,
  ]);

  React.useEffect(() => {
    if (!walletProvider) {
      return;
    }
    (async () => {
      const addresses = await walletProvider.request({
        method: 'eth_accounts',
      });
      setAddresses(addresses);
    })();
  }, [walletProvider, setAddresses]);

  if (addresses) {
    return <span>{addresses.join(', ')}</span>;
  }

  return (
    <button
      onClick={() => open()}
      disabled={!ready && !checkedExistingProvider}
    >
      Connect wallet
    </button>
  );
};

export default PlaidWeb3Link;
