import { PlaidLinkOptions, Plaid } from './types';

export interface PlaidFactory {
  open: Function;
  exit: Function;
  destroy: Function;
}

interface FactoryInternalState {
  plaid: Plaid | null;
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
    open: false,
  };

  // If Plaid is not available, throw an Error
  if (typeof window === 'undefined' || !window.Plaid) {
    throw new Error('Plaid not loaded');
  }

  const config = renameKeyInObject(options, 'publicKey', 'key');
  state.plaid = window.Plaid.create(config);

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
      if (state.plaid) {
        // Removes the iframe from the DOM
        state.plaid.destroy();
        state.plaid = null;
      }
    };
    // If was open give Plaid some time to finish before killing iframe.
    if (wasOpen && state.plaid) {
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
