import React, { useCallback } from 'react';

import { useEthereumProvider } from '../src/web3';

const App = props => {
  const [addresses, setAddresses] = React.useState(undefined);

  const onSuccess = useCallback(
    async provider => {
      const accounts = await provider.request({ method: 'eth_accounts' });
      setAddresses(accounts);
    },
    [setAddresses]
  );

  const onExit = useCallback(
    (err, metadata) => console.log('onExit', err, metadata),
    []
  );

  const config = {
    token: props.token,
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
    error,
    getCurrentEthereumProvider,
  } = useEthereumProvider(config);

  const checkProvider = useCallback(() => {
    if (!ready) {
      return;
    }

    (async () => {
      const provider = await getCurrentEthereumProvider(config.chain);
      if (provider) {
        const accounts = await provider.request({ method: 'eth_accounts' });
        setAddresses(accounts);
      }
    })();
  }, [ready, getCurrentEthereumProvider, setAddresses]);

  if (addresses) {
    return <div>{addresses.join(', ')}</div>;
  }

  return (
    <>
      <button
        type="button"
        className="button"
        onClick={() => open()}
        disabled={!ready || error}
      >
        Open Plaid Link
      </button>
      <button
        type="button"
        className="button"
        onClick={() => checkProvider()}
        disabled={!ready}
      >
        Check existing provider
      </button>
    </>
  );
};

export default App;
