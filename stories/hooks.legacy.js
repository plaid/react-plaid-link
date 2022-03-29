import React, { useCallback } from 'react';

import { usePlaidLink } from '../src';

const App = (props) => {
  const onSuccess = useCallback(
    (token, metadata) => console.log('onSuccess', token, metadata),
    []
  );

  const onEvent = useCallback(
    (eventName, metadata) => console.log('onEvent', eventName, metadata),
    []
  );

  const onExit = useCallback(
    (err, metadata) => console.log('onExit', err, metadata),
    []
  );

  const config = {
    clientName: props.clientName || '',
    env: props.env || 'sandbox',
    product: props.product || ['auth'],
    publicKey: props.publicKey,
    token: props.token,
    onSuccess,
    onEvent,
    onExit,
    // –– optional parameters
    // webhook: props.webhook || null,
    // countryCodes: props.countryCodes || ['US'],
    // language: props.language || 'en',
    // ...
  };

  const { open, ready, error } = usePlaidLink(config);

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
    </>
  );
};

export default App;
