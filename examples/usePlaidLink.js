import React, { useCallback } from 'react';

import { usePlaidLink } from '../src';

const App = props => {
  const onSuccess = useCallback(
    (token, metadata) => console.log('onSuccess', token, metadata),
    []
  );

  const onEvent = useCallback(
    (token, metadata) => console.log('onEvent', token, metadata),
    []
  );

  const onExit = useCallback(
    (token, metadata) => console.log('onExit', token, metadata),
    []
  );

  const config = {
    clientName: props.clientName || '',
    env: props.env || 'sandbox',
    product: props.product || ['auth'],
    key: props.key || 'a9536dd5db33d7bbbdb096c56a1593',
    onSuccess,
    onEvent,
    onExit,
    // // optional
    // webhook: props.webhook || null,
    // countryCodes: props.countryCodes || ['US'],
    // language: props.language || 'en',
    // ...
  };

  const { open, loading, error } = usePlaidLink(config);

  return (
    <>
      <button
        type="button"
        className="button"
        onClick={() => open()}
        disabled={loading}
      >
        Open Plaid Link
      </button>
    </>
  );
};

export default App;
