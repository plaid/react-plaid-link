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

const stories = storiesOf('Examples', module);
stories.addDecorator(withKnobs);

stories.add('hooks', () => {
  const props = {
    token: text('token', ''),
  };

  button('Save Link configuration', reRender);

  return (
    <div key={counter}>
      <ExampleComponent file="hooks" {...props} />
    </div>
  );
});

stories.add('Component', () => {
  const props = {
    token: text('token', ''),
  };

  button('Save Link configuration', reRender);

  return (
    <div key={counter}>
      <ExampleComponent file="hoc" {...props} />
    </div>
  );
});

stories.add('embedded Link', () => {
  const props = {
    token: text('token', ''),
  };

  button('Save Link configuration', reRender);

  return (
    <div key={counter}>
      <ExampleComponent file="embedded_link" {...props} />
    </div>
  );
});

export default {
  title: 'Storybook Knobs',
  decorators: [withKnobs],
};
