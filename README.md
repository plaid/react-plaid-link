# react-plaid-link

**This is still a WIP – stay tuned for updates, and please feel free to open a PR as you see fit**

A simple [React](https://facebook.github.io/react/) component for easy
integration with the [Plaid Link drop-in module](https://plaid.com/docs/link/)


## Install

```
npm install react-plaid-link
```

## Example Usage

```jsx
import React, { Component } from 'react'
import PlaidLink from 'react-plaid-link'

class App extends Component {
  handleOnSuccess(token, metadata) {
    // send token to client server
  }
  render() {
    return (
      <PlaidLink
        publicKey="PLAID_PUBLIC_KEY"
        product="auth"
        env="tartan"
        clientName="plaidname"
        onSuccess={this.handleOnSuccess}
        />
    )
  }
}
export default App
```

## All Props

Please refer to the [official Plaid Link docs](https://plaid.com/docs/link/) for
a more holistic understanding of the various Link options.

```jsx
<PlaidLink
  clientName="plaidname"
  env="tartan"
  institution={null}
  publicKey="test_key"
  product="auth"
  apiVersion={'v1' | 'v2'}
  token="test,wells,connected"
  selectAccount={true}
  webhook="https://webhooks.test.com"
  onSuccess={this.handleOnSuccess}
  onExit={this.handleOnExit}
  onLoad={this.handleOnLoad}
  />
```


## Contributing

Run tests:

```
make test
```
