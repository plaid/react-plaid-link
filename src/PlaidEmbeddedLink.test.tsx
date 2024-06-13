import React from 'react';
import { render } from '@testing-library/react';
import { PlaidEmbeddedLink, PlaidLinkOptions } from './';

import useScript from 'react-script-hook';
jest.mock('react-script-hook');
const mockedUseScript = useScript as jest.Mock;

const ScriptLoadingState = {
  LOADING: [true, null],
  LOADED: [false, null],
  ERROR: [false, 'SCRIPT_LOAD_ERROR'],
};

describe('PlaidEmbeddedLink', () => {
  const config: PlaidLinkOptions = {
    token: 'test-token',
    onSuccess: jest.fn(),
    onExit: jest.fn(),
    onLoad: jest.fn(),
    onEvent: jest.fn(),
  };
  const createEmbeddedSpy = jest.fn(() => ({
    destroy: jest.fn(),
  }));

  beforeEach(() => {
    mockedUseScript.mockImplementation(() => ScriptLoadingState.LOADED);
    window.Plaid = {
      createEmbedded: createEmbeddedSpy,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not rerender if config did not change', () => {
    const styles = { height: '350px', width: '350px', backgroundColor: 'white' };
    const { rerender } = render(<PlaidEmbeddedLink {...config} style={styles} />);
    expect(createEmbeddedSpy).toHaveBeenCalledTimes(1);
    rerender(<PlaidEmbeddedLink {...config} style={{...styles, backgroundColor: 'light-blue'}} />);
    expect(createEmbeddedSpy).toHaveBeenCalledTimes(1);
  });

  it('should rerender if config did change', () => {
    const { rerender } = render(<PlaidEmbeddedLink {...config} />);
    expect(createEmbeddedSpy).toHaveBeenCalledTimes(1);
    const newConfig = { ...config, token: 'new-test-token' };
    rerender(<PlaidEmbeddedLink {...newConfig} />);
    expect(createEmbeddedSpy).toHaveBeenCalledTimes(2);
  });
});
