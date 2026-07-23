import React from 'react';
import {
  PlaidLinkOnEvent,
  PlaidLinkOnSuccess,
  PlaidLinkStableEvent,
  usePlaidLink,
} from 'react-plaid-link';

interface LayerExampleProps {
  linkToken: string;
  onSuccess: PlaidLinkOnSuccess;
  onFallback: () => void;
}

export const LayerExample: React.FC<LayerExampleProps> = ({
  linkToken,
  onSuccess,
  onFallback,
}) => {
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [dateOfBirth, setDateOfBirth] = React.useState('');
  const [
    layerEvent,
    setLayerEvent,
  ] = React.useState<PlaidLinkStableEvent | null>(null);

  const onEvent = React.useCallback<PlaidLinkOnEvent>(eventName => {
    switch (eventName) {
      case PlaidLinkStableEvent.LAYER_READY:
        setLayerEvent(PlaidLinkStableEvent.LAYER_READY);
        break;
      case PlaidLinkStableEvent.LAYER_NOT_AVAILABLE:
        setLayerEvent(PlaidLinkStableEvent.LAYER_NOT_AVAILABLE);
        break;
      case PlaidLinkStableEvent.LAYER_AUTOFILL_NOT_AVAILABLE:
        setLayerEvent(PlaidLinkStableEvent.LAYER_AUTOFILL_NOT_AVAILABLE);
        break;
      default:
        break;
    }
  }, []);

  // Initialize Link as soon as the view mounts so Layer can preload.
  const { open, ready, submit } = usePlaidLink({
    token: linkToken,
    onSuccess,
    onEvent,
  });

  React.useEffect(() => {
    if (ready && layerEvent === PlaidLinkStableEvent.LAYER_READY) {
      open();
    }
  }, [layerEvent, open, ready]);

  React.useEffect(() => {
    if (layerEvent === PlaidLinkStableEvent.LAYER_AUTOFILL_NOT_AVAILABLE) {
      onFallback();
    }
  }, [layerEvent, onFallback]);

  const submitPhoneNumber = (event: React.FormEvent) => {
    event.preventDefault();
    submit({ phone_number: phoneNumber });
  };

  const submitDateOfBirth = (event: React.FormEvent) => {
    event.preventDefault();
    submit({ date_of_birth: dateOfBirth });
  };

  if (layerEvent === PlaidLinkStableEvent.LAYER_NOT_AVAILABLE) {
    return (
      <form onSubmit={submitDateOfBirth}>
        <label>
          Date of birth
          <input
            type="date"
            value={dateOfBirth}
            onChange={event => setDateOfBirth(event.target.value)}
          />
        </label>
        <button type="submit" disabled={!ready || !dateOfBirth}>
          Continue
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={submitPhoneNumber}>
      <label>
        Phone number
        <input
          type="tel"
          value={phoneNumber}
          onChange={event => setPhoneNumber(event.target.value)}
        />
      </label>
      <button type="submit" disabled={!ready || !phoneNumber}>
        Continue
      </button>
    </form>
  );
};
