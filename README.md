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

const App = props => {
  const onSuccess = (token, metadata) => {
    // send token to server
  };

  return (
    <PlaidLink
      clientName="Your app name"
      env="sandbox"
      product={['auth', 'transactions']}
      publicKey="<YOUR_PLAID_PUBLIC_KEY>"
      onSuccess={onSuccess}
      {...}
    >
      Connect a bank account
    </PlaidLink>
  );
};
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
  accountSubtypes?: { [key: string]: Array<string> };
  countryCodes?: Array<string>;
  language?: string;
  linkCustomizationName?: string;
  oauthNonce?: string;
  oauthRedirectUri?: string;
  oauthStateId?: string;
  paymentToken?: string;
  token?: string;
  userEmailAddress?: string;
  userLegalName?: string;
  webhook?: string;
}
```

## Typescript support

Typescript definitions for `react-plaid-link` are built into the npm packge.

## Publishing new versions

You'll need npm publishing rights for this package for your npm user.

```
npm version <version specifier>
git push origin head:<your branch> 
# create a PR to ensure everyone's happy with the version
git push --tags origin <your new tag>
# this is important - ensure you have the latest version's dependencies
npm install
make build
npm publish --registry=https://registry.npmjs.org
```

Read [semver](https://semver.org/) to determine what type of version bump to use.
