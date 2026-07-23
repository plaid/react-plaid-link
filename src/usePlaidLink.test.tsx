import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { usePlaidLink, PlaidLinkOptions, PlaidLinkOptionsWithLinkToken } from './';

import useScript from './react-script-hook';
jest.mock('./react-script-hook');
const mockedUseScript = useScript as jest.Mock;

const ScriptLoadingState = {
  LOADING: [true, null],
  LOADED: [false, null],
  ERROR: [false, 'SCRIPT_LOAD_ERROR'],
};

const ReadyState = {
  READY: 'READY',
  NOT_READY: 'NOT_READY',
  ERROR: 'ERROR',
  NO_ERROR: 'NO_ERROR',
};

const HookComponent: React.FC<{ config: PlaidLinkOptions }> = ({ config }) => {
  const { open, ready, error } = usePlaidLink(config);
  return (
    <div>
      <button onClick={() => open()}>Open</button>
      <div>{ready ? ReadyState.READY : ReadyState.NOT_READY}</div>
      <div>{error ? ReadyState.ERROR : ReadyState.NO_ERROR}</div>
    </div>
  );
};

describe('usePlaidLink', () => {
  const config: PlaidLinkOptions = {
    token: 'test-token',
    onSuccess: jest.fn(),
  };

  beforeEach(() => {
    mockedUseScript.mockClear();
    mockedUseScript.mockImplementation(() => ScriptLoadingState.LOADED);
    window.Plaid = {
      create: jest.fn(({ onLoad }) => {
        onLoad && onLoad();
        return {
          create: jest.fn(),
          open: jest.fn(),
          submit: jest.fn(),
          exit: jest.fn(),
          destroy: jest.fn(),
        };
      }),
      open: jest.fn(),
      submit: jest.fn(),
      exit: jest.fn(),
      destroy: jest.fn(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render with token', async () => {
    render(<HookComponent config={config} />);
    expect(screen.getByRole('button'));
    expect(screen.getByText(ReadyState.READY));
    expect(screen.getByText(ReadyState.NO_ERROR));
  });

  it('should pass cspNonce to the Plaid script tag only', async () => {
    render(<HookComponent config={{ ...config, cspNonce: 'test-csp-nonce' }} />);

    expect(mockedUseScript).toHaveBeenCalledWith({
      src: 'https://cdn.plaid.com/link/v2/stable/link-initialize.js',
      checkForExisting: true,
      nonce: 'test-csp-nonce',
    });
    expect(window.Plaid.create).toHaveBeenCalledWith(
      expect.not.objectContaining({ cspNonce: 'test-csp-nonce' })
    );
  });

  it('should render with publicKey', async () => {
    const configWithPubKey: PlaidLinkOptions = {
      publicKey: 'test-public-key',
      env: 'sandbox',
      product: ['auth'],
      clientName: 'TEST',
      onSuccess: jest.fn(),
    };
    render(<HookComponent config={configWithPubKey} />);
    expect(screen.getByRole('button'));
    expect(screen.getByText(ReadyState.READY));
    expect(screen.getByText(ReadyState.NO_ERROR));
  });

  it('should render with receivedRedirectUri', async () => {
    const configWithRedUri: PlaidLinkOptionsWithLinkToken = {
      token: null,
      receivedRedirectUri: 'test-received-redirect-uri',
      onSuccess: jest.fn(),
    };
    render(<HookComponent config={configWithRedUri} />);
    expect(screen.getByRole('button'));
    expect(screen.getByText(ReadyState.READY));
    expect(screen.getByText(ReadyState.NO_ERROR));
  });

  it('should not be ready when script is loading', async () => {
    mockedUseScript.mockImplementation(() => ScriptLoadingState.LOADING);
    render(<HookComponent config={config} />);
    expect(screen.getByText(ReadyState.NOT_READY));
    expect(screen.getByText(ReadyState.NO_ERROR));
  });

  it('should not be ready if token, publicKey, and receivedRedirectUri are all missing', async () => {
    render(<HookComponent config={{ ...config, token: null }} />);
    expect(screen.getByText(ReadyState.NOT_READY));
    expect(screen.getByText(ReadyState.NO_ERROR));
  });

  it('should not be ready if script fails to load', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementationOnce(() => {});
    mockedUseScript.mockImplementation(() => ScriptLoadingState.ERROR);

    render(<HookComponent config={config} />);
    expect(screen.getByText(ReadyState.NOT_READY));
    expect(screen.getByText(ReadyState.ERROR));
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error loading Plaid',
      'SCRIPT_LOAD_ERROR'
    );
  });

  it('should be ready if token is generated async', async () => {
    const { rerender } = render(
      <HookComponent config={{ ...config, token: null }} />
    );
    expect(screen.getByText(ReadyState.NOT_READY));
    expect(screen.getByText(ReadyState.NO_ERROR));
    config.token = 'test-token';
    rerender(<HookComponent config={config} />);
    expect(screen.getByText(ReadyState.READY));
    expect(screen.getByText(ReadyState.NO_ERROR));
  });

  it('should be ready if token is generated async and script loads after token', async () => {
    mockedUseScript.mockImplementation(() => ScriptLoadingState.LOADING);

    const c: PlaidLinkOptions = {
      token: null,
      onSuccess: jest.fn(),
    };
    const { rerender } = render(<HookComponent config={c} />);
    expect(screen.getByText(ReadyState.NOT_READY));
    expect(screen.getByText(ReadyState.NO_ERROR));

    c.token = 'test-token';
    rerender(<HookComponent config={config} />);
    expect(screen.getByText(ReadyState.NOT_READY));
    expect(screen.getByText(ReadyState.NO_ERROR));

    mockedUseScript.mockImplementation(() => ScriptLoadingState.LOADED);

    rerender(<HookComponent config={config} />);
    expect(screen.getByText(ReadyState.READY));
    expect(screen.getByText(ReadyState.NO_ERROR));
  });

  it('should destroy the Plaid instance on unmount after success', () => {
    const { unmount } = render(<HookComponent config={config} />);
    const plaidHandler = (window.Plaid.create as jest.Mock).mock.results[0]
      .value;
    const plaidConfig = (window.Plaid.create as jest.Mock).mock.calls[0][0];

    fireEvent.click(screen.getByRole('button'));
    plaidConfig.onSuccess('public-token', {});
    unmount();

    expect(plaidHandler.exit).not.toHaveBeenCalled();
    expect(plaidHandler.destroy).toHaveBeenCalledTimes(1);
  });
});
