# Changelog

## 3.2.0

- Improve TypeScript types (may cause minor TS errors)

## 3.1.1

- Allow React 17 in `peerDependencies` (#171)

## 3.1.0

- Ensure Link is destroyed correctly (#146)
- Export `PlaidLinkOptions` typescript types (#134)
- (Internal) Bump node-fetch from 2.6.0 to 2.6.1 (#136)
- (Internal) Bump elliptic from 6.5.2 to 6.5.3 (#127)
- (Internal) Bump lodash from 4.17.15 to 4.17.19 (#124)
- Fix a bug with the usePlaidLink `ready` state (#163)

## 3.0.0

- Add Link token options to initialization and move onEvent types to their own interface. (#116)

## 2.2.3

- (Internal) Bump websocket-extensions from 0.1.3 to 0.1.4 (#114)

## 2.2.2

- Ensure Plaid link-initialize.js is embedded only once (#109)
- Config `product` prop updates should refresh instance on change (#104)

## 2.2.1

- (Internal) Bump yarn.lock dependencies for react-script-hook version bump (#99)

## 2.2.0

- Pull in version 1.0.17 of react-script-hook (#97)
  - Fix race condition between script load and rerenders ([react-script-hook#10](https://github.com/hupe1980/react-script-hook/pull/10))

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
