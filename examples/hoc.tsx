import React from 'react';
import { withKnobs, text } from '@storybook/addon-knobs';

import {
  PlaidLink,
  PlaidLinkOnExit,
  PlaidLinkOnEvent,
  PlaidLinkOnSuccess,
} from '../src';

const Link = ({ token }) => {
  const onExit: PlaidLinkOnExit = (error, metadata) => {
    console.log('onExit', error, metadata);
  };

  const onEvent: PlaidLinkOnEvent = (eventName, metadata) => {
    console.log('onEvent', eventName, metadata);
  };

  const onSuccess: PlaidLinkOnSuccess = (token, metadata) => {
    console.log('onSuccess', token, metadata);
  };

  return (
    <PlaidLink
      className="CustomButton"
      style={{ padding: '20px', fontSize: '16px', cursor: 'pointer' }}
      token={token}
      onExit={onExit}
      onSuccess={onSuccess}
      onEvent={onEvent}
    >
      Open Link and connect your bank!
    </PlaidLink>
  );
};

// storybook config
export const HOC = () => <Link token={text('Link token', '')} />;

export default {
  title: 'Examples/HOC',
  decorators: [withKnobs]
};
