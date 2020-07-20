const path = require('path');

module.exports = {
  stories: ['./example.stories.js', './example.legacy.stories.js'],
  addons: [
    {
      name: '@storybook/preset-typescript',
      options: { include: [path.resolve(__dirname, '..')] },
    },
    '@storybook/addon-actions',
    '@storybook/addon-knobs/register',
  ],
};
