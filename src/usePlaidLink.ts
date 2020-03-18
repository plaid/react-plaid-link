import { useEffect, useState } from 'react';
import useScript from 'react-script-hook';

import { createPlaid, PlaidFactory } from './factory';
import { PlaidLinkOptions } from './types';

const PLAID_LINK_STABLE_URL =
  'https://cdn.plaid.com/link/v2/stable/link-initialize.js';

const noop = () => {};

/**
 * This hook loads Plaid script and manages the Plaid Link creation for you.
 * You get easy open & exit methods to call and loading & error states.
 *
 * This will destroy the Plaid UI on un-mounting so it's up to you to be
 * graceful to the user.
 *
 * A new Plaid instance is created every time the individual options change.
 * It's up to you to prevent unnecessary re-creations on re-render.
 */
export const usePlaidLink = (options: PlaidLinkOptions) => {
  // Asynchronously load the plaid/link/stable url into the DOM
  const [loading, error] = useScript({ src: PLAID_LINK_STABLE_URL });

  // internal state
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

    // if (iframeLoaded) {
    //   setIframeLoaded(false);
    // }

    const next = createPlaid({
      ...options,
      onLoad: () => {
        options.onLoad && options.onLoad();
        setIframeLoaded(true);
      },
    });

    setPlaid(next);

    // on component unmount – destroy the Plaid iframe factory
    return next.destroy;
  }, [
    // eslint-disable-next-line react-hooks/exhaustive-deps
    loading,
    error,
    // ...options
  ]);

  return {
    loading: loading || !iframeLoaded,
    error,
    open: plaid ? plaid.open : noop,
    exit: plaid ? plaid.exit : noop,
  };
};
