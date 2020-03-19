import React from 'react';

export interface PlaidLinkOptions {
  // Displayed once a user has successfully linked their account
  clientName: string;
  // The Plaid API environment on which to create user accounts.
  env: string;
  // The public_key associated with your account; available from
  // the Plaid dashboard (https://dashboard.plaid.com)
  publicKey: string;
  // The Plaid products you wish to use, an array containing some of connect,
  // auth, identity, income, transactions, assets, liabilities
  product: Array<string>;
  // A function that is called when a user has successfully connecter an Item.
  // The function should expect two arguments, the public_key and a metadata object
  onSuccess: Function;
  // An array of countries to filter institutions
  countryCodes?: Array<string>;
  // A local string to change the default Link display language
  language?: string;
  // Specify an existing user's public token to launch Link in update mode.
  // This will cause Link to open directly to the authentication step for
  // that user's institution.
  token?: string;
  // Your user's associated email address - specify to enable all Auth features.
  // Note that userLegalName must also be set.
  userEmailAddress?: string;
  // Your user's legal first and last name – specify to enable all Auth features.
  // Note that userEmailAddress must also be set.
  userLegalName?: string;
  // Specify a webhook to associate with a user.
  webhook?: string;
  linkCustomizationName?: string;
  oauthNonce?: string;
  oauthRedirectUri?: string;
  oauthStateId?: string;
  paymentToken?: string;
  // A callback that is called when a user has specifically exited Link flow
  onExit?: Function;
  // A callbac that is called when the Link module has finished loading.
  // Calls to plaidLinkHandler.open() prior to the onLoad callback will be
  // delayed until the module is fully loaded.
  onLoad?: Function;
  // A callback that is called during a user's flow in Link.
  onEvent?: Function;
}

export interface PlaidLinkPropTypes extends PlaidLinkOptions {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export interface Plaid {
  open: Function;
  exit: Function;
  create: Function;
}

declare global {
  interface Window {
    Plaid: Plaid;
  }
}
