# react-plaid-link [![npm version](https://badge.fury.io/js/react-plaid-link.svg)](http://badge.fury.io/js/react-plaid-link)

[React](https://facebook.github.io/react/) hook and components for integrating
with [Plaid Link](https://plaid.com/docs/link/)

### Compatibility

React 16.8+

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

ℹ️ See a full source code examples of using hooks:

- [examples/simple.tsx](examples/simple.tsx): minimal example of using hooks
- [examples/hooks.tsx](examples/hooks.tsx): example using hooks with all
  available callbacks
- [examples/oauth.tsx](examples/oauth.tsx): example handling OAuth with hooks

```tsx
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

### Available Link configuration options

ℹ️ See [src/types/index.ts][types] for exported types.

Please refer to the [official Plaid Link
docs](https://plaid.com/docs/link/web/) for a more holistic understanding of
the various Link options and the
[`link_token`](https://plaid.com/docs/api/tokens/#linktokencreate).

#### `usePlaidLink` arguments

| key                   | type                                                                                      |
| --------------------- | ----------------------------------------------------------------------------------------- |
| `token`               | `string \| null`                                                                          |
| `onSuccess`           | `(public_token: string, metadata: PlaidLinkOnSuccessMetadata) => void`                    |
| `onExit`              | `(error: null \| PlaidLinkError, metadata: PlaidLinkOnExitMetadata) => void`              |
| `onEvent`             | `(eventName: PlaidLinkStableEvent \| string, metadata: PlaidLinkOnEventMetadata) => void` |
| `onLoad`              | `() => void`                                                                              |
| `receivedRedirectUri` | `string \| null \| undefined`                                                             |

#### `usePlaidLink` return value

| key      | type                                                            |
|----------|-----------------------------------------------------------------|
| `open`   | `() => void`                                                    |
| `ready`  | `boolean`                                                       |
| `submit` | `(data: PlaidHandlerSubmissionData) => void`                    |
| `error`  | `ErrorEvent \| null`                                            |
| `exit`   | `(options?: { force: boolean }, callback?: () => void) => void` |

### OAuth / opening Link without a button click

Handling OAuth redirects requires opening Link without any user input (such as
clicking a button). This can also be useful if you simply want Link to open
immediately when your page or component renders.

ℹ️ See full source code example at [examples/oauth.tsx](examples/oauth.tsx)

```tsx
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
import { PlaidLink } from "react-plaid-link";

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

## Typescript support

TypeScript definitions for `react-plaid-link` are built into the npm package.
If you have previously installed `@types/react-plaid-link` before this package
had types, please uninstall it in favor of built-in types.

[types]: https://github.com/plaid/react-plaid-link/blob/master/src/types/index.ts
