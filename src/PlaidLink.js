'use strict';

const React = require('react');
const ReactScriptLoaderMixin = require('react-script-loader').ReactScriptLoaderMixin;

const PlaidLink = React.createClass({
  mixins: [ReactScriptLoaderMixin],
  getDefaultProps: function() {
    return {
      institution: null,
      longtail: false,
      selectAccount: false,
      buttonText: 'Open Link',
      style: {
        padding: '6px 4px',
        outline: 'none',
        background: '#FFFFFF',
        border: '2px solid #F1F1F1',
        borderRadius: '4px',
      },
    };
  },
  propTypes: {
    // Displayed once a user has successfully linked their account
    clientName: React.PropTypes.string.isRequired,

    // The Plaid API environment on which to create user accounts.
    // For development and testing, use tartan. For production, use production
    env: React.PropTypes.oneOf(['tartan', 'production']).isRequired,

    // Open link to a specific institution, for a more custom solution
    institution: React.PropTypes.string,

    // Set to true to launch Link with longtail institution support enabled.
    // Longtail institutions are only available with the Connect product.
    longtail: React.PropTypes.bool,

    // The public_key associated with your account; available from
    // the Plaid dashboard (https://dashboard.plaid.com)
    publicKey: React.PropTypes.string.isRequired,

    // The Plaid product you wish to use, either auth or connect.
    product: React.PropTypes.oneOf(['auth', 'connect',]).isRequired,

    // Specify an existing user's public token to launch Link in update mode.
    // This will cause Link to open directly to the authentication step for
    // that user's institution.
    token: React.PropTypes.string,

    // Set to true to launch Link with the 'Select Account' pane enabled.
    // Allows users to select an individual account once they've authenticated
    selectAccount: React.PropTypes.bool,

    // Specify a webhook to associate with a user.
    webhook: React.PropTypes.string,

    // A function that is called when a user has successfully onboarded their
    // account. The function should expect two arguments, the public_key and a
    // metadata object
    onSuccess: React.PropTypes.func.isRequired,

    // A function that is called when a user has specifically exited Link flow
    onExit: React.PropTypes.func,

    // A function that is called when the Link module has finished loading.
    // Calls to plaidLinkHandler.open() prior to the onLoad callback will be
    // delayed until the module is fully loaded.
    onLoad: React.PropTypes.func,

    // Text to display in the button
    buttonText: React.PropTypes.string,

    // Button Styles as an Object
    style: React.PropTypes.object,

    // Button Class names as a String
    className: React.PropTypes.string,
  },
  getInitialState: function() {
    return {
      disabledButton: true,
      linkLoaded: false,
    };
  },
  getScriptURL: function() {
    return 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
  },
  onScriptError: function() {
    console.error('There was an issue loading the link-initialize.js script');
  },
  onScriptLoaded: function() {
    window.linkHandler = Plaid.create({
      clientName: this.props.clientName,
      env: this.props.env,
      key: this.props.publicKey,
      longtail: this.props.longtail,
      onExit: this.props.onExit,
      onLoad: this.handleLinkOnLoad,
      onSuccess: this.props.onSuccess,
      product: this.props.product,
      selectAccount: this.props.selectAccount,
      token: this.props.token,
      webhook: this.props.webhook,
    });

    this.setState({disabledButton: false});
  },
  handleLinkOnLoad: function() {
    this.props.onLoad && this.props.onLoad();
    this.setState({linkLoaded: true});
  },
  handleOnClick: function() {
    var institution = this.props.institution || null;
    if (window.linkHandler) {
      window.linkHandler.open(institution);
    }
  },
  render: function() {
    return (
      <button
        onClick={this.handleOnClick}
        disabled={this.state.disabledButton}
        style={this.props.style}
        className={this.props.className}
      >
        <span>{this.props.buttonText}</span>
      </button>
    );
  }
});

module.exports = PlaidLink;
