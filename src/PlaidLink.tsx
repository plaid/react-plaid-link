import React from 'react';
import PropTypes from 'prop-types';

import { PlaidLinkPropTypes } from './types';
import { usePlaidLink } from './usePlaidLink';

export const PlaidLink = (props: PlaidLinkPropTypes) => {
  const { children, style, ...config } = props;
  const { error, open } = usePlaidLink({ ...config });

  return (
    <button
      disabled={Boolean(error)}
      type="button"
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
PlaidLink.propTypes = {
  clientName: PropTypes.string.isRequired,
  env: PropTypes.string.isRequired,
  key: PropTypes.string.isRequired,
  product: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSuccess: PropTypes.func.isRequired,
  countryCodes: PropTypes.array,
  language: PropTypes.string,
  onEvent: PropTypes.func,
  onExit: PropTypes.func,
  onLoad: PropTypes.func,
  token: PropTypes.string,
  userEmailAddress: PropTypes.string,
  userLegalName: PropTypes.string,
  webhook: PropTypes.string,
  children: PropTypes.element,
};
