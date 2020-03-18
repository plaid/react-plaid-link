import React, { forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { usePlaidLink } from './usePlaidLink';

const PlaidLink = forwardRef(function PlaidLink(props, ref) {
  const {
    clientName,
    countryCodes,
    env,
    publicKey,
    product,
    language,
    token,
    userEmailAddress,
    userLegalName,
    webhook,
    onSuccess,
    onExit,
    onLoad,
    onEvent,
    children,
    action,
    ...rest
  } = props;
  const { error, open, exit } = usePlaidLink({
    clientName,
    countryCodes,
    env,
    key: publicKey,
    product,
    language,
    token,
    userEmailAddress,
    userLegalName,
    webhook,
    onSuccess,
    onExit,
    onLoad,
    onEvent,
  });

  useImperativeHandle(
    action,
    () => ({
      open,
      exit,
    }),
    [open, exit]
  );

  return (
    <button
      disabled={Boolean(error)}
      style={{
        padding: '6px 4px',
        outline: 'none',
        background: '#FFFFFF',
        border: '2px solid #F1F1F1',
        borderRadius: '4px',
      }}
      {...rest}
      ref={ref}
      onClick={e => {
        if (props.onClick) {
          props.onClick(e);
        }
        if (e.isDefaultPrevented()) {
          return;
        }
        open();
      }}
    >
      {children}
    </button>
  );
});
PlaidLink.propTypes = {
  // Displayed once a user has successfully linked their account
  clientName: PropTypes.string.isRequired,

  // List of countries to initialize Link with
  countryCodes: PropTypes.array,

  // The Plaid API environment on which to create user accounts.
  env: PropTypes.oneOf(['sandbox', 'development', 'production']).isRequired,

  // The public_key associated with your account; available from
  // the Plaid dashboard (https://dashboard.plaid.com)
  publicKey: PropTypes.string.isRequired,

  // The Plaid products you wish to use, an array containing some of connect,
  // auth, identity, income, transactions, assets, liabilities
  product: PropTypes.arrayOf(
    PropTypes.oneOf([
      'auth',
      'identity',
      'income',
      'transactions',
      'assets',
      'liabilities',
      'investments',
    ])
  ).isRequired,

  // List of countries to initialize Link with
  language: PropTypes.string,

  // Specify an existing user's public token to launch Link in update mode.
  // This will cause Link to open directly to the authentication step for
  // that user's institution.
  token: PropTypes.string,

  // Your user's legal first and last name
  // Specify to enable all Auth features.
  // Note that userEmailAddress must also be set.
  userLegalName: PropTypes.string,

  // Your user's associated email address
  // Specify to enable all Auth features.
  // Note that userLegalName must also be set.
  userEmailAddress: PropTypes.string,

  // Specify a webhook to associate with a user.
  webhook: PropTypes.string,

  // A function that is called when a user has successfully onboarded their
  // account. The function should expect two arguments, the public_key and a
  // metadata object
  onSuccess: PropTypes.func.isRequired,

  // A function that is called when a user has specifically exited Link flow
  onExit: PropTypes.func,

  // A function that is called when the Link module has finished loading.
  // Calls to plaidLinkHandler.open() prior to the onLoad callback will be
  // delayed until the module is fully loaded.
  onLoad: PropTypes.func,

  // A function that is called during a user's flow in Link.
  // See
  onEvent: PropTypes.func,
};

export default PlaidLink;
