import React, { useCallback } from 'react';

import { PlaidEmbeddedLink } from '../src';

const App = props => {
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
    token: props.token,
    onSuccess,
    onEvent,
    onExit,
  };

  return (
    <PlaidEmbeddedLink
      {...config}
      style={{
        height: '350px',
        width: '350px',
      }}
    />
  );
};

export default App;
