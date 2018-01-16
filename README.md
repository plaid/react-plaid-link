# react-plaid-link

A simple [React](https://facebook.github.io/react/) component for easy
integration with the [Plaid Link drop-in module](https://plaid.com/docs/link/)


## Install

```
npm install react-plaid-link --save
```

## Example Usage

```jsx
import React, { Component } from 'react'
import PlaidLink from 'react-plaid-link'

class App extends Component {
  handleOnSuccess(token, metadata) {
    // send token to client server
  }
  handleOnExit() {
    // handle the case when your user exits Link
  }
  render() {
    return (
      <PlaidLink
        clientName="Your app name"
        env="sandbox"
        product=["auth", "transactions"]
        publicKey="PLAID_PUBLIC_KEY"
        onExit={this.handleOnExit}
        onSuccess={this.handleOnSuccess}>
        Open Link and connect your bank!
      </PlaidLink>
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
  clientName="Your app name"
  env="sandbox"
  institution={null}
  publicKey={PLAID_PUBLIC_KEY}
  product={['auth', 'transactions']}
  apiVersion={'v1' || 'v2'}
  token={'public-token-123...'}
  selectAccount={true} // deprecated – use https://dashboard.plaid.com/link
  webhook="https://webhooks.test.com"
  onEvent={this.handleOnEvent}
  onExit={this.handleOnExit}
  onLoad={this.handleOnLoad}
  onSuccess={this.handleOnSuccess}>
  Open Link and connect a bank account to Plaid
</PlaidLink>
```


## Contributing

Run tests:

```
make test
```

## Development

```bash
# install dependencies
make setup

# run a local server
make start

# open localhost:3000
```
