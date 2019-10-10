
/**
 * Wrap link handler creation and instance to clean up iframe via destroy() method
 */
export const createPlaid = options => {
  if (typeof window === 'undefined' || !window.Plaid) {
    throw new Error('Plaid not loaded');
  }

  // Use object for state so inner functions can reference
  // properties created/updated later
  const state = {
    plaid: null,
    iframe: null,
    open: false,
  };

  state.plaid = window.Plaid.create({
    ...options,
    onEvent: (eventName, metadata) => {
      if (eventName === 'EXIT' || eventName === 'HANDOFF') {
        state.open = false;
      }
      if (options.onEvent) {
        options.onEvent(eventName, metadata);
      }
    },
  });

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
  const exit = opts => {
    if (!state.open || !state.plaid) {
      return;
    }
    state.plaid.exit(opts);
    if (opts && opts.force) {
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
