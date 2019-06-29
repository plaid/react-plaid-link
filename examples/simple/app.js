import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PlaidLink from 'react-plaid-link';

import util from '../util';


class App extends Component {
  constructor(props) {
    super(props);
  }
  handleOnSuccess(token, metadata) {
    util.makeRequest({
      parameters: {
        token: token,
        metadata: metadata,
      },
      url: 'https://clientwebsite.com/exchangeLinkToken/',
      method: 'POST',
      onError: function() {},
      onLoad: function(statusCode, responseBody) {},
    });
  }
  handleOnExit(error, metadata) {
    console.log('link: user exited');
    console.log(error, metadata);
  }
  handleOnLoad() {
    console.log('link: loaded');
  }
  handleOnEvent(eventname, metadata) {
    console.log('link: user event', eventname, metadata);
  }
  render() {
    return (
      <PlaidLink
        clientName="Plaid Client"
        env="sandbox"
        product={['auth', 'transactions']}
        publicKey="614be98f819e9bd8d0db9abec1c08a"
        className="some-class-name"
        apiVersion="v2"
        onSuccess={this.handleOnSuccess}
        onExit={this.handleOnExit}
        onEvent={this.handleOnEvent}
        onLoad={this.handleOnLoad}>
        Open Plaid Link button
      </PlaidLink>
    );
  }
}

const appElement = document.getElementById('root');

ReactDOM.render(<App />, appElement);
