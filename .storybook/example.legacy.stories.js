/* eslint-disable import/no-extraneous-dependencies */
import React, { useEffect, useState } from 'react';
import { storiesOf, module } from '@storybook/react';
import '@storybook/addon-console';
import {
  withKnobs,
  text,
  button,
  select,
  optionsKnob as options,
} from '@storybook/addon-knobs';

let counter = 0;
const reRender = () => (counter += 1);

const ExampleComponent = ({ file, ...props }) => {
  const [example, setExample] = useState(null);
  useEffect(() => {
    import(`../stories/${file}`).then(({ default: Example }) => {
      setExample(<Example {...props} />);
    });
  }, []);
  return example;
};

const stories = storiesOf('Legacy public key integrations', module);
stories.addDecorator(withKnobs);

stories.add('hooks', () => {
  const props = {
    clientName: text('clientName', 'YOUR_CLIENT_NAME'),
    env: select('env', ['sandbox', 'development', 'production'], 'sandbox'),
    publicKey: text('publicKey', '<SANDBOX_PUBLIC_KEY>'),
    token: text('token', '<LINK_TOKEN>'),
    product: options(
      'product',
      { auth: 'auth', transactions: 'transactions' },
      ['auth', 'transactions'],
      { display: 'multi-select' }
    ),
  };

  button('Save Link configuration', reRender);

  return (
    <div key={counter}>
      <ExampleComponent file="hooks.legacy" {...props} />
    </div>
  );
});

stories.add('HOC', () => {
  const props = {
    clientName: text('clientName', 'YOUR_CLIENT_NAME'),
    env: select('env', ['sandbox', 'development', 'production'], 'sandbox'),
    publicKey: text('publicKey', '<SANDBOX_PUBLIC_KEY>'),
    token: text('token', '<LINK_TOKEN>'),
    product: options(
      'product',
      { auth: 'auth', transactions: 'transactions' },
      ['auth', 'transactions'],
      { display: 'multi-select' }
    ),
  };

  button('Save Link configuration', reRender);

  return (
    <div key={counter}>
      <ExampleComponent file="hoc.legacy" {...props} />
    </div>
  );
});

export default {
  title: 'Storybook Knobs',
  decorators: [withKnobs],
};
