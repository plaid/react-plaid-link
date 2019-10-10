import { useEffect, useState } from 'react';
import useScript from 'react-script-hook';
import { createPlaid } from './factory';

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
export const usePlaidLink = options => {
  const [loading, error] = useScript({
    src: 'https://cdn.plaid.com/link/v2/stable/link-initialize.js',
  });
  const [plaid, setPlaid] = useState(null);
  const [linkLoaded, setLinkLoaded] = useState(false);

  useEffect(() => {
    if (loading) {
      return;
    }
    if (error || !window.Plaid) {
      // eslint-disable-next-line no-console
      console.error('Error loading Plaid', error);
      return;
    }

    if (linkLoaded) {
      setLinkLoaded(false);
    }
    const next = createPlaid({
      ...options,
      onLoad: () => {
        if (options.onLoad) {
          options.onLoad();
        }
        setLinkLoaded(true);
      },
    });
    setPlaid(next);

    return next.destroy;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loading,
    error,
    options.clientName,
    options.countryCodes,
    options.env,
    options.key,
    // Be nice and handle array identity changes since it's just an array of strings.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    options.product.join(','),
    options.language,
    options.token,
    options.userLegalName,
    options.userEmailAddress,
    options.webhook,
    options.onSuccess,
    options.onExit,
    options.onLoad,
    options.onEvent,
  ]);

  return {
    loading: loading || !linkLoaded,
    error,
    open: plaid ? plaid.open : noop,
    exit: plaid ? plaid.exit : noop,
  };
};

const noop = () => {};
