import { useEffect, useState } from 'react';
import useScript from 'react-script-hook';

import { createPlaid, PlaidFactory } from './factory';
import {
  PlaidLinkOptions,
  PlaidLinkOptionsWithLinkToken,
  PlaidLinkOptionsWithPublicKey,
} from './types';
import { PLAID_LINK_STABLE_URL } from './constants';

const noop = () => {};

/**
 * This hook loads Plaid script and manages the Plaid Link creation for you.
 * You get easy open & exit methods to call and loading & error states.
 *
 * This will destroy the Plaid UI on un-mounting so it's up to you to be
 * graceful to the user.
 *
 * A new Plaid instance is created every time the token and products options change.
 * It's up to you to prevent unnecessary re-creations on re-render.
 */
export const usePlaidLink = (options: PlaidLinkOptions) => {
  // Asynchronously load the plaid/link/stable url into the DOM
  const [loading, error] = useScript({
    src: PLAID_LINK_STABLE_URL,
    checkForExisting: true,
  });

  // internal state
  const [plaid, setPlaid] = useState<PlaidFactory | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const products = ((options as PlaidLinkOptionsWithPublicKey).product || [])
    .slice()
    .sort()
    .join(',');

  useEffect(() => {
    // If the link.js script is still loading, return prematurely
    if (loading) {
      return;
    }

    // If the token, publicKey, and received redirect URI are undefined, return prematurely
    if (
      !options.token &&
      !(options as PlaidLinkOptionsWithPublicKey).publicKey &&
      !(options as PlaidLinkOptionsWithLinkToken).receivedRedirectUri
    ) {
      return;
    }

    if (error || !window.Plaid) {
      // eslint-disable-next-line no-console
      console.error('Error loading Plaid', error);
      return;
    }

    // if an old plaid instance exists, destroy it before
    // creating a new one
    if (plaid != null) {
      plaid.exit({ force: true }, () => plaid.destroy());
    }

    const next = createPlaid(
      {
        ...options,
        onLoad: () => {
          setIframeLoaded(true);
          options.onLoad && options.onLoad();
        },
      },
      window.Plaid.create
    );

    setPlaid(next);

    // destroy the Plaid iframe factory
    return () => next.exit({ force: true }, () => next.destroy());
  }, [
    loading,
    error,
    (options as PlaidLinkOptionsWithPublicKey).publicKey,
    options.token,
    products,
  ]);

  const ready = plaid != null && (!loading || iframeLoaded);

  const openNoOp = () => {
    if (!options.token) {
      console.warn(
        'react-plaid-link: You cannot call open() without a valid token supplied to usePlaidLink. This is a no-op.'
      );
    }
  };

  return {
    error,
    ready,
    submit: plaid ? plaid.submit : noop,
    exit: plaid ? plaid.exit : noop,
    open: plaid ? plaid.open : openNoOp,
  };
};
