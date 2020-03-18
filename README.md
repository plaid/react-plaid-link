# react-plaid-link [![npm version](https://badge.fury.io/js/react-plaid-link.svg)](http://badge.fury.io/js/react-plaid-link)

[React](https://facebook.github.io/react/) hooks and components for
integrating with the [Plaid Link drop module](https://blog.plaid.com/plaid-link/)

### Install

With `npm`:

```
npm install react-plaid-link --save
```

With `yarn`

```
yarn add -S react-plaid-link
```

## Documentation

Please refer to the [official Plaid Link docs](https://plaid.com/docs/#creating-items-with-plaid-link) for
a more holistic understanding of the various Link options.

### Examples

Head to the `react-plaid-link` [storybook]() to try it out for yourself, or
checkout:

- `/examples/hooks.js`
- `/examples/hoc.js`

### Using React hooks

This is the new and preferred approach for integrating with Plaid Link in React.

```jsx
import React, { useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';

const App = () => {
  const onSuccess = useCallback((token, metadata) => {
    // send token to server
  }, []);

  const config = {
    clientName: 'Your app name',
    env: 'sandbox',
    product: ['auth', 'transactions'],
    publicKey: '<YOUR_PLAID_PUBLIC_KEY>',
    onSuccess,
    // ...
  };

  const { open, ready, error } = usePlaidLink(config);

  return (
    <MyButton onClick={() => open()} disabled={!ready}>
      Connect a bank account
    </MyButton>
  );
};
export default App;
```

### Using a React component

```jsx
import React from 'react';
import { PlaidLink } from 'react-plaid-link';

const App = () => {
  const onSuccess = (token, metadata) => {
    // send token to server
  }
  render() {
    return (
      <PlaidLink
        clientName='Your app name'
        env='sandbox'
        product={['auth', 'transactions']}
        publicKey='<YOUR_PLAID_PUBLIC_KEY>'
        onSuccess={onSuccess}
      >
        Connect a bank account
      </PlaidLink>
    );
  }
}
export default App;
```

### All Props

Please refer to the [official Plaid Link docs](https://plaid.com/docs/#creating-items-with-plaid-link) for
a more holistic understanding of the various Link options.

```jsx
<PlaidLink
  clientName="Your app name"
  env="sandbox"
  publicKey={PLAID_PUBLIC_KEY}
  product={['auth', 'transactions']}
  apiVersion={'v1' || 'v2'}
  token={'public-token-123...'}
  selectAccount={true} // deprecated – use https://dashboard.plaid.com/link
  webhook="https://webhooks.test.com"
  onEvent={this.handleOnEvent}
  onExit={this.handleOnExit}
  onLoad={this.handleOnLoad}
  onSuccess={this.handleOnSuccess}
  style={{ width: '100px' }}
  countryCodes={['US', 'CA']}
  language="en"
  user={{ legalName: 'Jane Doe', emailAddress: 'jane@example.com' }}
  webhook="https://example.com/plaid-webhook"
  oauthNonce={'627ddf99...'}
  oauthRedirectUri="https://example.com/plaid-oauth-callback"
  oauthStateId={'1b748f9e...'}
  paymentToken={'payment-token-sandbox-1b748f9e...'}
>
  Open Link and connect a bank account to Plaid
</PlaidLink>
```

## Typescript support

Typescript definitions for `react-plaid-link` are built into the npm packge.
