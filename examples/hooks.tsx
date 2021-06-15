import React, { useCallback } from 'react';
import { withKnobs, text } from '@storybook/addon-knobs';

import {
  PlaidLinkOnExit,
  PlaidLinkOnEvent,
  PlaidLinkOnSuccess,
  PlaidLinkOptions,
  usePlaidLink,
} from '../src';

const PlaidLink = ({ token }) => {
  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    (token, metadata) => console.log('onSuccess', token, metadata),
    []
  );

  const onEvent = useCallback<PlaidLinkOnEvent>(
    (eventName, metadata) => console.log('onEvent', eventName, metadata),
    []
  );

  const onExit = useCallback<PlaidLinkOnExit>(
    (err, metadata) => console.log('onExit', err, metadata),
    []
  );

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
    onEvent,
    onExit,
    // –– optional parameters
    // receivedRedirectUri: props.receivedRedirectUri || null,
    // ...
  };

  const { open, ready, error } = usePlaidLink(config);

  return (
    <button
      type="button"
      onClick={() => open()}
      disabled={!ready || error != null}
    >
      Open Plaid Link {error}
    </button>
  );
};

// storybook config
export const Hooks = () => <PlaidLink token={text('Link token', '')} />;
export default {
  title: 'Examples/Hooks',
  decorators: [withKnobs],
};
