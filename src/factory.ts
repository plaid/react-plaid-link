import { PlaidLinkOptions, Plaid } from './types';

export interface PlaidFactory {
  open: Function;
  exit: Function;
  destroy: Function;
}

interface FactoryInternalState {
  plaid: Plaid | null;
  iframe: Element | null;
  open: boolean;
}

const renameKeyInObject = (
  o: { [index: string]: any },
  oldKey: string,
  newKey: string
): object => {
  const newObject = {};
  delete Object.assign(newObject, o, { [newKey]: o[oldKey] })[oldKey];
  return newObject;
};

/**
 * Wrap link handler creation and instance to clean up iframe via destroy() method
 */
export const createPlaid = (options: PlaidLinkOptions) => {
  const state: FactoryInternalState = {
    plaid: null,
    iframe: null,
    open: false,
  };

  // If Plaid is not available, throw an Error
  if (typeof window === 'undefined' || !window.Plaid) {
    throw new Error('Plaid not loaded');
  }

  const config = renameKeyInObject(options, 'publicKey', 'key');
  state.plaid = window.Plaid.create(config);

  // Keep track of Plaid DOM instance so we can clean up it for them.
  // It's reasonably safe to assume the last plaid iframe will be the one
  // just created by the line above.
  state.iframe = document.querySelector(
    'iframe[id^="plaid-link-iframe-"]:last-child'
  );

  const open = () => {
    if (!state.plaid) {
      return;
    }
    state.open = true;
    state.plaid.open();
  };

  const exit = (exitOptions: any) => {
    if (!state.open || !state.plaid) {
      return;
    }
    state.plaid.exit(exitOptions);
    if (exitOptions && exitOptions.force) {
      state.open = false;
    }
  };

  const destroy = () => {
    const wasOpen = state.open;
    exit({ force: true });
    const cleanup = () => {
      if (state.iframe) {
        state.iframe.remove();
        state.iframe = null;
      }
    };
    // If was open give Plaid some time to finish before killing iframe.
    if (wasOpen && state.iframe) {
      setTimeout(cleanup, 1000);
    } else {
      cleanup();
    }
  };

  return {
    open,
    exit,
    destroy,
  };
};
