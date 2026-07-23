# react-plaid-link [![npm version](https://badge.fury.io/js/react-plaid-link.svg)](https://www.npmjs.com/package/react-plaid-link)

[React](https://react.dev/) hooks and components for integrating
with [Plaid Link](https://plaid.com/docs/link/)

### Compatibility

React 16.8-19.x.x

### Install

With `npm`:

```
npm install --save react-plaid-link
```

With `yarn`:

```
yarn add react-plaid-link
```

## Documentation

Please refer to the [official Plaid Link docs](https://plaid.com/docs/link/)
for a more holistic understanding of Plaid Link.

## Examples

Head to the `react-plaid-link`
[storybook](https://plaid.github.io/react-plaid-link) to try out a live demo.

See the [examples folder](examples) for various complete source code examples.

## Using React hooks

This is the preferred approach for integrating with Plaid Link in React.

**Note:** `token` can be `null` initially and then set once you fetch or generate
a `link_token` asynchronously.

ℹ️ See full source code examples of using hooks:

- [examples/simple.tsx](examples/simple.tsx): minimal example of using hooks
- [examples/hooks.tsx](examples/hooks.tsx): example using hooks with all
  available callbacks
- [examples/oauth.tsx](examples/oauth.tsx): example handling OAuth with hooks
- [examples/layer.tsx](examples/layer.tsx): example implementing Plaid Layer

```tsx
import React from 'react';
import { usePlaidLink } from 'react-plaid-link';

// ...

const { open, ready } = usePlaidLink({
  token: '<GENERATED_LINK_TOKEN>',
  onSuccess: (public_token, metadata) => {
    // send public_token to server
  },
});

return (
  <button onClick={() => open()} disabled={!ready}>
    Connect a bank account
  </button>
);
```

### Using Plaid Layer

Create a Layer Link token with
[`/session/token/create`](https://plaid.com/docs/api/products/layer/#sessiontokencreate)
on your server, then initialize `usePlaidLink` as early as possible so Link can
preload. Submit the user's phone number and wait for a Layer event before
opening Link:

```tsx
import { PlaidLinkStableEvent, usePlaidLink } from 'react-plaid-link';

const [layerReady, setLayerReady] = React.useState(false);
const { open, ready, submit } = usePlaidLink({
  token: layerLinkToken,
  onSuccess,
  onEvent: eventName => {
    if (eventName === PlaidLinkStableEvent.LAYER_READY) {
      setLayerReady(true);
    }
  },
});

React.useEffect(() => {
  if (ready && layerReady) {
    open();
  }
}, [layerReady, open, ready]);

const submitPhoneNumber = () => {
  submit({ phone_number: '+14155550123' });
};
```

If the phone number produces `LAYER_NOT_AVAILABLE`, Layer Extended Autofill
can be attempted with a separate submission:

```tsx
const submitDateOfBirth = () => {
  submit({ date_of_birth: '1975-01-18' });
};
```

Fall back to a non-Layer onboarding flow if Extended Autofill produces
`LAYER_AUTOFILL_NOT_AVAILABLE`. See the
[complete Layer example](examples/layer.tsx) and
[Plaid Layer integration guide](https://plaid.com/docs/layer/add-to-app/) for
the full flow.

### Available Link configuration options

ℹ️ See [src/types/index.ts][types] for exported types.

Please refer to the [official Plaid Link
docs](https://plaid.com/docs/link/web/) for a more holistic understanding of
the various Link options and the
[`link_token`](https://plaid.com/docs/api/link/#linktokencreate).

#### `usePlaidLink` arguments

| key                   | type                                                                                      |
| --------------------- | ----------------------------------------------------------------------------------------- |
| `token`               | `string \| null`                                                                          |
| `onSuccess`           | `(public_token: string \| null, metadata: PlaidLinkOnSuccessMetadata) => void`             |
| `onExit`              | `(error: null \| PlaidLinkError, metadata: PlaidLinkOnExitMetadata) => void`              |
| `onEvent`             | `(eventName: PlaidLinkStableEvent \| string, metadata: PlaidLinkOnEventMetadata) => void` |
| `onLoad`              | `() => void`                                                                              |
| `receivedRedirectUri` | `string \| undefined`                                                                     |
| `cspNonce`            | `string \| undefined`                                                                     |

`public_token` is `null` for products such as Identity Verification and
Beacon that do not create an Item.

#### Content Security Policy nonce

If your app uses a nonce-based Content Security Policy, generate a fresh nonce
per page response and pass it as `cspNonce`
on `usePlaidLink` or `PlaidEmbeddedLink`. Only mount these components once
`cspNonce` is known.

Allow that nonce in `script-src`, `style-src`, and `style-src-elem`. Link still
requires `style-src-attr 'unsafe-inline'` today. You will also need `frame-src` and `connect-src` as
[documented for Link Web](https://plaid.com/docs/link/web/#csp-directives); for
example:

```html
default-src https://cdn.plaid.com/;
script-src 'nonce-<PAGE_RESPONSE_NONCE>' https://cdn.plaid.com/link/v2/stable/link-initialize.js;
style-src 'nonce-<PAGE_RESPONSE_NONCE>';
style-src-elem 'nonce-<PAGE_RESPONSE_NONCE>';
style-src-attr 'unsafe-inline';
frame-src https://cdn.plaid.com/;
connect-src https://production.plaid.com/;
```

If you omit `cspNonce`, behavior is unchanged (including for embedded Link).

```tsx
const { open, ready } = usePlaidLink({
  token: '<GENERATED_LINK_TOKEN>',
  cspNonce: '<PER_RESPONSE_NONCE>',
  onSuccess: (public_token, metadata) => {
    // send public_token to server
  },
});
```

#### `usePlaidLink` return value

| key      | type                                                            |
|----------|-----------------------------------------------------------------|
| `open`   | `() => void`                                                    |
| `ready`  | `boolean`                                                       |
| `submit` | `(data: PlaidHandlerSubmissionData) => void`                    |
| `error`  | `ErrorEvent \| null`                                            |
| `exit`   | `(options?: { force?: boolean }, callback?: () => void) => void` |

### Handling an invalid Link token

If `onExit` receives an `INVALID_LINK_TOKEN` error, fetch a new Link token and
update the token in state. `usePlaidLink` destroys the old Link instance and
creates a new one whenever the token changes. See Plaid's guide to
[handling an invalid Link token](https://plaid.com/docs/link/handle-invalid-link-token/)
for more context.

```tsx
import React from 'react';
import { PlaidLinkError, usePlaidLink } from 'react-plaid-link';

const [token, setToken] = React.useState<string | null>(null);

const onExit = React.useCallback(async (error: PlaidLinkError | null) => {
  if (error?.error_code === 'INVALID_LINK_TOKEN') {
    setToken(null);
    const response = await fetch('/api/create_link_token', { method: 'POST' });
    const { link_token } = await response.json();
    setToken(link_token);
  }
}, []);

const { open, ready } = usePlaidLink({
  token,
  onExit,
  onSuccess: (public_token, metadata) => {
    // send public_token to server
  },
});
```

### OAuth / opening Link without a button click

Handling OAuth redirects requires opening Link without any user input (such as
clicking a button). This can also be useful if you simply want Link to open
immediately when your page or component renders.

ℹ️ See full source code example at [examples/oauth.tsx](examples/oauth.tsx)

```tsx
import React from 'react';
import { usePlaidLink } from 'react-plaid-link';

// ...

const { open, ready } = usePlaidLink(config);

// open Link immediately when ready
React.useEffect(() => {
  if (ready) {
    open();
  }
}, [ready, open]);

return <></>;
```

## Using the pre-built component instead of the usePlaidLink hook

If you cannot use React hooks for legacy reasons such as incompatibility with
class components, you can use the `PlaidLink` component.

ℹ️ See full source code example at [examples/component.tsx](examples/component.tsx)

```tsx
import React from 'react';
import { PlaidLink } from 'react-plaid-link';

const App extends React.Component {
  // ...
  render() {
    return (
      <PlaidLink
        token={this.state.token}
        onSuccess={this.onSuccess}
        // onEvent={...}
        // onExit={...}
      >
        Link your bank account
      </PlaidLink>
    );
  }
}
```

## TypeScript support

TypeScript definitions for `react-plaid-link` are built into the npm package.
If you have previously installed `@types/react-plaid-link` before this package
had types, please uninstall it in favor of built-in types.

[types]: https://github.com/plaid/react-plaid-link/blob/master/src/types/index.ts
