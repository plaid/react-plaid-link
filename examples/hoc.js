import React from 'react';

import { PlaidLink } from '../src';

const App = props => {
  const onExit = (error, metadata) => console.log('onExit', error, metadata);
  const onEvent = (eventName, metadata) =>
    console.log('onEvent', eventName, metadata);
  const onSuccess = (token, metadata) =>
    console.log('onSuccess', token, metadata);

  return (
    <>
      <PlaidLink
        clientName={props.clientName || 'Your app name'}
        env={props.env || 'sandbox'}
        product={props.product || ['auth', 'transactions']}
        publicKey={props.publicKey || '...'}
        onExit={onExit}
        onSuccess={onSuccess}
        onEvent={onEvent}
      >
        Open Link and connect your bank!
      </PlaidLink>
    </>
  );
};

export default App;
