import React from 'react';

import { PlaidLinkPropTypes } from './types';
import { usePlaidLink } from './usePlaidLink';

export const PlaidLink: React.FC<PlaidLinkPropTypes> = props => {
  const { children, style, className, ...config } = props;
  const { error, open } = usePlaidLink({ ...config });

  return (
    <button
      disabled={Boolean(error)}
      type="button"
      className={className}
      style={{
        padding: '6px 4px',
        outline: 'none',
        background: '#FFFFFF',
        border: '2px solid #F1F1F1',
        borderRadius: '4px',
        ...style,
      }}
      onClick={() => open()}
    >
      {children}
    </button>
  );
};

PlaidLink.displayName = 'PlaidLink';
