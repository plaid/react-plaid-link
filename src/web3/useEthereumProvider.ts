import { useEffect, useState } from 'react';
import useScript from 'react-script-hook';

import { createWeb3Plaid, PlaidFactory } from '../factory';
import {
  EthereumOnboardingOptions,
  PlaidWeb3,
  PlaidGlobalWithWeb3,
} from '../types/web3';
import { PLAID_LINK_STABLE_URL } from '../constants';

const noop = () => {};

export const useEthereumProvider = (options: EthereumOnboardingOptions) => {
  // Asynchronously load the plaid/link/stable url into the DOM
  const [loading, error] = useScript({
    src: PLAID_LINK_STABLE_URL,
    checkForExisting: true,
  });

  // internal state
  const [web3, setWeb3] = useState<PlaidWeb3 | null>(null);
  const [plaid, setPlaid] = useState<PlaidFactory | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    // If the link.js script is still loading, return prematurely
    if (loading) {
      return;
    }

    if (error || !window.Plaid) {
      // eslint-disable-next-line no-console
      console.error('Error loading Plaid', error);
      return;
    }

    if (!web3) {
      (window.Plaid as PlaidGlobalWithWeb3).web3().then(setWeb3);
      return;
    }

    // If the token is undefined, return prematurely
    if (!options.token) {
      return;
    }

    // if an old plaid instance exists, destroy it before
    // creating a new one
    if (plaid != null) {
      plaid.exit({ force: true }, () => plaid.destroy());
    }

    const next = createWeb3Plaid(
      {
        ...options,
        onLoad: () => {
          setIframeLoaded(true);
          options.onLoad && options.onLoad();
        },
      },
      web3.createEthereumOnboarding
    );

    setPlaid(next);

    // destroy the Plaid iframe factory
    return () => next.exit({ force: true }, () => next.destroy());
  }, [loading, error, options.token, web3, setWeb3]);

  const ready = plaid != null && (!loading || iframeLoaded) && web3 != null;

  const openNoOp = () => {
    if (!options.token) {
      console.warn(
        'react-plaid-link: You cannot call open() without a valid token supplied to useEthereumProvider. This is a no-op.'
      );
    }
  };

  const returnValue = {
    error,
    ready,
    exit: plaid ? plaid.exit : noop,
    open: plaid ? plaid.open : openNoOp,
    getCurrentEthereumProvider:
      web3 && ready ? web3.getCurrentEthereumProvider : null,
    isProviderActive: web3 && ready ? web3.isProviderActive : null,
    disconnectEthereumProvider:
      web3 && ready ? web3.disconnectEthereumProvider : null,
  };
  return returnValue;
};
