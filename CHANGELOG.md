# Changelog

## 2.1.0

- Allows public_key to be optional if a token is provided (#95)
- Fix `token` initialization (#95)
- Use the new link handler `.destroy()` method instead of custom internal method (#95)

## 2.0.3

- Add `accountSubtypes` prop to configuration options (#91)

## 2.0.2

- Fix `publicKey` prop and auto-generate PropTypes for React component (#87)

## 2.0.1

- Add `className` prop to `PlaidLink` React component (#83)
- Add `type=button` to `PlaidLink` React component (#83)

## 2.0.0

#### New

- Add `usePlaidLink` hook for simpler and more configurable use-cases
- Add Typescript support
- Add Storybook support
- Improve and simplify examples (located at `./examples`)
- Simplify `PlaidLink` HOC internals and import

#### Breaking changes

- Remove support for React versions below `<16.8.x`
- For the `PlaidLink` button component, we've removed the default import:

##### Before:

```jsx
import PlaidLink from 'react-plaid-link';
```

##### After

```jsx
import { PlaidLink } from 'react-plaid-link';
```
