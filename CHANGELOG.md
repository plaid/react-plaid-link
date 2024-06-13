# Changelog

## 3.5.2

- Fix rerender issue with PlaidEmbeddedLink
- Add support for handler.submit

## 3.5.1

- Fix build issue from version 3.5.0

## 3.5.0 (do not use)

Do not use version 3.5.0 because this version contains a build issue.

- Add support for Plaid embedded Link, an experimental feature [#320](https://github.com/plaid/react-plaid-link/pull/320)

## 3.4.1

- Add missing events to `PlaidLinkStableEvent` [#310](https://github.com/plaid/react-plaid-link/pull/310)
- Update function return types for `usePlaidLink` [#312](https://github.com/plaid/react-plaid-link/pull/312)
- Update early return condition in `usePlaidLink` for possible inputs [#316](https://github.com/plaid/react-plaid-link/pull/316)

## 3.4.0

- Add APIs for [Wallet Onboard](https://plaid.com/docs/wallet-onboard/) [#283](https://github.com/plaid/react-plaid-link/pull/283)

## 3.3.2

- Add `transfer_status` to `PlaidLinkOnSuccessMetadata` type [#252](https://github.com/plaid/react-plaid-link/pull/252)
- Allow React 18 in `peerDependencies` [#256](https://github.com/plaid/react-plaid-link/pull/256)

## 3.3.1

- Fix `usePlaidLink` hook for legacy `publicKey` config [#247](https://github.com/plaid/react-plaid-link/pull/247)
- Bump `react-script-hook` dependency to 1.6.0 to fix script loading bug [#246](https://github.com/plaid/react-plaid-link/pull/246)

## 3.3.0

Allow `token` to be `null` in `usePlaidLink` config [#197](https://github.com/plaid/react-plaid-link/pull/197)

## 3.2.2

- Bump react-script-hook to 1.5.0 to fix 'error loading plaid' msg (#217)

## 3.2.1

- (Internal) Fix invalid registry URLs in `yarn.lock`

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
