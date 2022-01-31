import React, { useCallback, useState } from 'react';

import {
  usePlaidLink,
  PlaidLinkOnSuccess,
  PlaidLinkOnEvent,
  PlaidLinkOnExit,
  PlaidLinkOptions,
} from 'react-plaid-link';

const PlaidLinkWithOAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const isOAuthRedirect = window.location.href.includes('?oauth_state_id=');

  // generate a link_token when component mounts
  React.useEffect(() => {
    // do not generate a new token if page is handling an OAuth redirect.
    // instead setLinkToken to previously generated token from localStorage
    // https://plaid.com/docs/link/oauth/#reinitializing-link
    if (isOAuthRedirect) {
      setToken(localStorage.getItem('link_token'));
      return;
    }
    const createLinkToken = async () => {
      const response = await fetch('/api/create_link_token', {
        method: 'POST',
      });
      const { link_token } = await response.json();
      setToken(link_token);
      // store link_token temporarily in case of OAuth redirect
      localStorage.setItem('link_token', link_token);
    }
    createLinkToken();
  }, []);

  const onSuccess = useCallback<PlaidLinkOnSuccess>((publicToken, metadata) => {
    // send public_token to your server
    // https://plaid.com/docs/api/tokens/#token-exchange-flow
    console.log(publicToken, metadata);
  }, []);
  const onEvent = useCallback<PlaidLinkOnEvent>((eventName, metadata) => {
    // log onEvent callbacks from Link
    // https://plaid.com/docs/link/web/#onevent
    console.log(eventName, metadata);
  }, []);
  const onExit = useCallback<PlaidLinkOnExit>((error, metadata) => {
    // log onExit callbacks from Link, handle errors
    // https://plaid.com/docs/link/web/#onexit
    console.log(error, metadata);
  }, []);

  const config: PlaidLinkOptions = {
    // token must be the same token used for the first initialization of Link
    token,
    onSuccess,
    onEvent,
    onExit,
  };
  if (isOAuthRedirect) {
    // receivedRedirectUri must include the query params
    config.receivedRedirectUri = window.location.href;
  }

  const {
    open,
    ready,
    // error,
    // exit
  } = usePlaidLink(config);

  React.useEffect(() => {
    // If OAuth redirect, instantly open link when it is ready instead of
    // making user click the button
    if (isOAuthRedirect && ready) {
      open();
    }
  }, [ready, open, isOAuthRedirect]);

  // No need to render a button on OAuth redirect as link opens instantly
  return isOAuthRedirect ? (
    <></>
  ) : (
    <button onClick={() => open()} disabled={!ready}>
      Connect a bank account
    </button>
  );
};

export default PlaidLinkWithOAuth;
