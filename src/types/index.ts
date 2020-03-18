export interface PlaidLinkOptions {
  clientName: string;
  env: string;
  key: string;
  product: Array<string>;
  onSuccess: Function;
  // optional configuration options
  countryCodes?: Array<string>;
  language?: string;
  linkCustomizationName?: string;
  oauthNonce?: string;
  oauthRedirectUri?: string;
  oauthStateId?: string;
  token?: string;
  userEmailAddress?: string;
  userLegalName?: string;
  webhook?: string;
  onExit?: Function;
  onLoad?: Function;
  onEvent?: Function;
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
