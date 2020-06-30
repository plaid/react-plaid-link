import React from 'react';

interface CommonPlaidLinkOptions {
  // A function that is called when a user has successfully connecter an Item.
  // The function should expect two arguments, the public_key and a metadata object
  onSuccess: Function;
  // A callback that is called when a user has specifically exited Link flow
  onExit?: Function;
  // A callback that is called when the Link module has finished loading.
  // Calls to plaidLinkHandler.open() prior to the onLoad callback will be
  // delayed until the module is fully loaded.
  onLoad?: Function;
  // A callback that is called during a user's flow in Link.
  onEvent?: Function;
}

export type PlaidLinkOptionsWithPublicKey = (CommonPlaidLinkOptions & {
  // The public_key associated with your account; available from
  // the Plaid dashboard (https://dashboard.plaid.com)
  publicKey: string;
  // Provide a public_token to initialize Link in update mode.
  token?: string;
  // Displayed once a user has successfully linked their account
  clientName: string;
  // The Plaid API environment on which to create user accounts.
  env: string;
  // The Plaid products you wish to use, an array containing some of connect,
  // auth, identity, income, transactions, assets, liabilities
  product: Array<string>;
  // An array of countries to filter institutions
  countryCodes?: Array<string>;
  // A local string to change the default Link display language
  language?: string;
  // Your user's associated email address - specify to enable all Auth features.
  // Note that userLegalName must also be set.
  userEmailAddress?: string;
  // Your user's legal first and last name – specify to enable all Auth features.
  // Note that userEmailAddress must also be set.
  userLegalName?: string;
  // Specify a webhook to associate with a user.
  webhook?: string;
  linkCustomizationName?: string;
  accountSubtypes?: { [key: string]: Array<string> };
  oauthNonce?: string;
  oauthRedirectUri?: string;
  oauthStateId?: string;
  paymentToken?: string;
});

export type PlaidLinkOptionsWithLinkToken = (CommonPlaidLinkOptions & {
  // Provide a link_token associated with your account. Create one
  // using the /link/token/create endpoint.
  token: string;
  receivedRedirectUri?: string;
});

// Either the publicKey or the token field must be configured. The publicKey
// is deprecated so prefer to initialize Link with a Link Token instead.
export type PlaidLinkOptions = 
  PlaidLinkOptionsWithPublicKey | PlaidLinkOptionsWithLinkToken;

export type PlaidLinkPropTypes = PlaidLinkOptions & {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export interface Plaid {
  open: Function;
  exit: Function;
  create: Function;
  destroy: Function;
}

declare global {
  interface Window {
    Plaid: Plaid;
  }
}
