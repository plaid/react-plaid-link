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

Head to the `react-plaid-link` [storybook](https://plaid.github.io/react-plaid-link) to try it out for yourself, or
checkout:

- [Storybook](https://plaid.github.io/react-plaid-link)
- [`/examples/hooks.js`](./examples/hooks.js)
- [`/examples/hoc.js`](./examples/hoc.js)

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

class App extends React.Component {
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

#### All available Link configuration options

Please refer to the [official Plaid Link docs](https://plaid.com/docs/#creating-items-with-plaid-link) for
a more holistic understanding of the various Link options.

```ts
// src/types/index.ts
interface PlaidLinkOptions {
  clientName: string;
  env: string;
  publicKey: string;
  product: Array<string>;
  onSuccess: Function;
  // optional
  onExit?: Function;
  onLoad?: Function;
  onEvent?: Function;
  countryCodes?: Array<string>;
  language?: string;
  token?: string;
  userEmailAddress?: string;
  userLegalName?: string;
  webhook?: string;
  linkCustomizationName?: string;
  oauthNonce?: string;
  oauthRedirectUri?: string;
  oauthStateId?: string;
  paymentToken?: string;
}
```

## Typescript support

Typescript definitions for `react-plaid-link` are built into the npm packge.
