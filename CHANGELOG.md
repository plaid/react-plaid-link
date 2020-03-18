# Changelog

## v2.0

#### New

- Add `usePlaidLink` hook for simpler and more configurable use-cases
- Add Typescript support
- Add Storybook support
- Improve and simplify examples (located at `./examples`)
- Simplify `PlaidLink` HOC internals and import

#### Breaking changes

For the `PlaidLink` button component, we've removed the default import:

##### Before:

```jsx
import PlaidLink from 'react-plaid-link';
```

##### After

```jsx
import { PlaidLink } from 'react-plaid-link';
```
