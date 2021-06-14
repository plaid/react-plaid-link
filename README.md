# react-plaid-link [![npm version](https://badge.fury.io/js/react-plaid-link.svg)](http://badge.fury.io/js/react-plaid-link)

[React](https://facebook.github.io/react/) hooks and components for
integrating with the [Plaid Link drop module](https://blog.plaid.com/plaid-link/)

### Install

With `npm`:

```
npm install --save react-plaid-link
```

With `yarn`

```
yarn add react-plaid-link
```

## Documentation

Please refer to the [official Plaid Link docs](https://plaid.com/docs/#creating-items-with-plaid-link) for
a more holistic understanding of the various Link options.

## Examples

Head to the `react-plaid-link` [storybook](https://plaid.github.io/react-plaid-link) to try out a live demo.

### Using React hooks

This is the preferred approach for integrating with Plaid Link in React.

ℹ️ Note: `link_token` cannot be null when passed to `usePlaidLink`. Generate your `link_token`
outside of the component where the hook is initialized.

```tsx
import React, { useCallback, useState, FunctionComponent } from "react";
import {
  usePlaidLink,
  PlaidLinkOptions,
  PlaidLinkOnSuccess,
} from "react-plaid-link";

interface Props {
  token: string;
}

const PlaidLink: FunctionComponent<Props> = ({ token }) => {
  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    (public_token, metadata) => {
      // send public_token to server
    },
    []
  );

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
    // onExit
    // onEvent
  };

  const { open, ready, error } = usePlaidLink(config);

  return (
    <button onClick={() => open()} disabled={!ready}>
      Connect a bank account
    </button>
  );
};

const App: FunctionComponent = () => {
  const [token, setToken] = useState<string | null>(null);

  // generate a link_token
  React.useEffect(() => {
    async function createLinkToken() {
      let response = await fetch("/api/create_link_token");
      const { link_token } = await response.json();
      setToken(link_token);
    }
    createLinkToken();
  }, []);

  // only initialize Link once our token exists
  return token === null ? (
    // insert your loading animation here
    <div className="loader"></div>
  ) : (
    <PlaidLink token={token} />
  );
};

export default App;
```

#### OAuth / opening Link without a button click

Handling OAuth redirects requires opening Link without any user input. This can
also be useful if you simply if you want Link to open immediately when your page
or component renders.

```tsx
import React, { useCallback, useEffect, FunctionComponent } from "react";
import {
  usePlaidLink,
  PlaidLinkOptions,
  PlaidLinkOnSuccess,
} from "react-plaid-link";

interface Props {
  token: string;
}

const OpenPlaidLink: FunctionComponent<Props> = ({ token }) => {
  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    (public_token, metadata) => {
      // send public_token to server
    },
    []
  );

  const config: PlaidLinkOptions = {
    // When re-initializing Link after OAuth redirection, the same
    // Link token from the first initialization must be used
    token,
    onSuccess,
    // receivedRedirectUri: document.location.href, // required for OAuth
    // onExit
    // onEvent
  };

  const { open, ready, error } = usePlaidLink(config);

  // this opens link as soon as it's ready
  useEffect(() => {
    if (!ready) {
      return;
    }
    open();
  }, [ready, open]);

  // don't render anything, just open Link
  return null;
};

export default OpenPlaidLink;
```


### Using the pre-built component instead of the usePlaidLink hook

```tsx
import React, { useCallback, useState, FunctionComponent } from "react";
import { PlaidLink, PlaidLinkOnSuccess } from "react-plaid-link";

const App: FunctionComponent = () => {
  const [token, setToken] = useState<string | null>(null);

  // generate a link_token
  React.useEffect(() => {
    async function createLinkToken() {
      let response = await fetch("/api/create_link_token");
      const { link_token } = await response.json();
      setToken(link_token);
    }
    createLinkToken();
  }, []);

  const onSuccess = useCallback<PlaidLinkOnSuccess>(
    (public_token, metadata) => {
      // send public_token to server
    },
    []
  );

  // The pre-built PlaidLink component uses the usePlaidLink hook under the hood.
  // It renders a styled button element and accepts a `className` and/or `style` prop
  // to override the default styles. It accepts any Link config option as a prop such
  // as receivedRedirectUri, onEvent, onExit, onLoad, etc.
  return token === null ? (
    // insert your loading animation here
    <div className="loader"></div>
  ) : (
    <PlaidLink
      token={token}
      onSuccess={onSuccess}
      // onExit={...}
      // onEvent={...}
    >
      Connect a bank account
    </PlaidLink>
  );
};

export default App;
```

#### All available Link configuration options

Please refer to the [official Plaid Link docs](https://plaid.com/docs/link) for
a more holistic understanding of the various Link options and the [`link_token`](https://plaid.com/docs/api/tokens/#linktokencreate).

See also [src/types/index.ts](https://github.com/plaid/react-plaid-link/blob/master/src/types/index.ts) for exported types.

```ts
interface PlaidLinkOptionsWithLinkToken = {
  token: string;
  onSuccess: (
    public_token: string,
    metadata: PlaidLinkOnSuccessMetadata
  ) => void;
  onExit?: (
    error: null | PlaidLinkError,
    metadata: PlaidLinkOnExitMetadata
  ) => void;
  onEvent?: (
    eventName: string,
    metadata: PlaidLinkOnEventMetadata
  ) => void;
  onLoad?: () => void;
  receivedRedirectUri?: string;
}

type PlaidLinkOptions = PlaidLinkOptionsWithLinkToken;
```

## Typescript support

TypeScript definitions for `react-plaid-link` are built into the npm package. If you have previously installed `@types/react-plaid-link` before this package had types, please uninstall it in favor of built-in types.
