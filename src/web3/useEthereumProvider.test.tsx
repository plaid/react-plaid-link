import React from 'react';
import { render, screen } from '@testing-library/react';

import { EthereumOnboardingOptions, PlaidGlobalWithWeb3 } from '../types/web3';
import { useEthereumProvider } from './useEthereumProvider';

import useScript from 'react-script-hook';
jest.mock('react-script-hook');
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
  HAS_PROVIDER_ACTIVE: 'HAS_PROVIDER_ACTIVE',
  NO_PROVIDER_ACTIVE: 'NO_PROVIDER_ACTIVE',
};

const HookComponent: React.FC<{ config: EthereumOnboardingOptions }> = ({
  config,
}) => {
  const { open, ready, error, isProviderActive } = useEthereumProvider(config);
  return (
    <div>
      <button onClick={() => open()}>Open</button>
      <div>{ready ? ReadyState.READY : ReadyState.NOT_READY}</div>
      <div>{error ? ReadyState.ERROR : ReadyState.NO_ERROR}</div>
      <div>
        {isProviderActive != null
          ? ReadyState.HAS_PROVIDER_ACTIVE
          : ReadyState.NO_PROVIDER_ACTIVE}{' '}
      </div>
    </div>
  );
};

describe('useEthereumProvider', () => {
  const config: EthereumOnboardingOptions = {
    token: 'test-token',
    chain: {
      chainId: '0x1',
      rpcUrl: 'https://rpcurl.com',
    },
    onSuccess: jest.fn(),
  };

  beforeEach(() => {
    mockedUseScript.mockImplementation(() => ScriptLoadingState.LOADED);
    window.Plaid = {
      create: ({ onLoad }) => {
        onLoad && onLoad();
        return {
          create: jest.fn(),
          open: jest.fn(),
          exit: jest.fn(),
          destroy: jest.fn(),
        };
      },
      open: jest.fn(),
      exit: jest.fn(),
      destroy: jest.fn(),
      web3: jest.fn(() =>
        Promise.resolve({
          createEthereumOnboarding: jest.fn(),
          getCurrentEthereumProvider: jest.fn(),
          isProviderActive: jest.fn(),
          disconnectEthereumProvider: jest.fn(),
        })
      ),
    } as PlaidGlobalWithWeb3;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render with token', async () => {
    render(<HookComponent config={config} />);
    expect(screen.getByRole('button'));
    await screen.findByText(ReadyState.READY);
    await screen.findByText(ReadyState.HAS_PROVIDER_ACTIVE);
    await screen.findByText(ReadyState.NO_ERROR);
  });

  it('should not be ready when script is loading', async () => {
    mockedUseScript.mockImplementation(() => ScriptLoadingState.LOADING);
    render(<HookComponent config={config} />);
    await screen.findByText(ReadyState.NOT_READY);
    await screen.findByText(ReadyState.NO_PROVIDER_ACTIVE);
    await screen.findByText(ReadyState.NO_ERROR);
  });

  it('should not be ready if both token and publicKey are missing', async () => {
    render(<HookComponent config={{ ...config, token: null }} />);
    await screen.findByText(ReadyState.NOT_READY);
    await screen.findByText(ReadyState.NO_ERROR);
  });

  it('should not be ready if script fails to load', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementationOnce(() => {});
    mockedUseScript.mockImplementation(() => ScriptLoadingState.ERROR);

    render(<HookComponent config={config} />);
    await screen.findByText(ReadyState.NOT_READY);
    await screen.findByText(ReadyState.NO_PROVIDER_ACTIVE);
    await screen.findByText(ReadyState.ERROR);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error loading Plaid',
      'SCRIPT_LOAD_ERROR'
    );
  });

  it('should be ready if token is generated async', async () => {
    const config: EthereumOnboardingOptions = {
      token: 'test-token',
      chain: {
        chainId: '0x1',
        rpcUrl: 'https://rpcurl.com',
      },
      onSuccess: jest.fn(),
    };

    const { rerender } = render(
      <HookComponent config={{ ...config, token: null }} />
    );
    await screen.findByText(ReadyState.NOT_READY);
    await screen.findByText(ReadyState.NO_PROVIDER_ACTIVE);
    await screen.findByText(ReadyState.NO_ERROR);
    config.token = 'test-token';
    rerender(<HookComponent config={config} />);
    await screen.findByText(ReadyState.READY);
    await screen.findByText(ReadyState.HAS_PROVIDER_ACTIVE);
    await screen.findByText(ReadyState.NO_ERROR);
  });

  it('should be ready if token is generated async and script loads after token', async () => {
    mockedUseScript.mockImplementation(() => ScriptLoadingState.LOADING);

    const c: EthereumOnboardingOptions = {
      token: null,
      chain: {
        chainId: '0x1',
        rpcUrl: 'https://rpcurl.com',
      },
      onSuccess: jest.fn(),
    };
    const { rerender } = render(<HookComponent config={c} />);
    await screen.findByText(ReadyState.NOT_READY);
    await screen.findByText(ReadyState.NO_PROVIDER_ACTIVE);
    await screen.findByText(ReadyState.NO_ERROR);

    c.token = 'test-token';
    rerender(<HookComponent config={config} />);
    await screen.findByText(ReadyState.NOT_READY);
    await screen.findByText(ReadyState.NO_PROVIDER_ACTIVE);
    await screen.findByText(ReadyState.NO_ERROR);

    mockedUseScript.mockImplementation(() => ScriptLoadingState.LOADED);

    rerender(<HookComponent config={config} />);
    await screen.findByText(ReadyState.READY);
    await screen.findByText(ReadyState.HAS_PROVIDER_ACTIVE);
    await screen.findByText(ReadyState.NO_ERROR);
  });
});
