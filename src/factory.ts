import {
  PlaidLinkOptions,
  PlaidHandler,
  PlaidHandlerSubmissionData,
  PlaidLinkOnSuccess,
  PlaidLinkOnSuccessMetadata,
  CommonPlaidLinkOptions,
  PlaidHandlerExitOptions,
} from './types';

export interface PlaidFactory {
  open: () => void;
  submit: (data: PlaidHandlerSubmissionData) => void;
  exit: (exitOptions?: PlaidHandlerExitOptions, callback?: () => void) => void;
  destroy: () => void;
}

interface FactoryInternalState {
  plaid: PlaidHandler | null;
  open: boolean;
  onExitCallback: (() => void) | null;
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
const createPlaidHandler = <
  T extends CommonPlaidLinkOptions<PlaidLinkOnSuccess>
>(
  config: T,
  creator: (config: T) => PlaidHandler
) => {
  const state: FactoryInternalState = {
    plaid: null,
    open: false,
    onExitCallback: null,
  };

  // If Plaid is not available, throw an Error
  if (typeof window === 'undefined' || !window.Plaid) {
    throw new Error('Plaid not loaded');
  }

  state.plaid = creator({
    ...config,
    onSuccess: (
      publicToken: string | null,
      metadata: PlaidLinkOnSuccessMetadata
    ) => {
      state.open = false;
      config.onSuccess(publicToken, metadata);
    },
    onExit: (error, metadata) => {
      state.open = false;
      config.onExit && config.onExit(error, metadata);
      state.onExitCallback && state.onExitCallback();
    },
  });

  const open = () => {
    if (!state.plaid) {
      return;
    }
    state.open = true;
    state.onExitCallback = null;
    state.plaid.open();
  };

  const submit = (data: PlaidHandlerSubmissionData) => {
    if (!state.plaid) {
      return;
    }
    state.plaid.submit(data);
  };

  const exit = (
    exitOptions?: PlaidHandlerExitOptions,
    callback?: () => void
  ) => {
    if (!state.open || !state.plaid) {
      callback && callback();
      return;
    }
    state.onExitCallback = callback || null;
    state.plaid.exit(exitOptions);
    if (exitOptions && exitOptions.force) {
      state.open = false;
    }
  };

  const destroy = () => {
    if (!state.plaid) {
      return;
    }

    state.plaid.destroy();
    state.plaid = null;
  };

  return {
    open,
    submit,
    exit,
    destroy,
  };
};

export const createPlaid = (
  options: PlaidLinkOptions,
  creator: (options: PlaidLinkOptions) => PlaidHandler
) => {
  const config = renameKeyInObject(
    options,
    'publicKey',
    'key'
  ) as PlaidLinkOptions;

  return createPlaidHandler(config, creator);
};
