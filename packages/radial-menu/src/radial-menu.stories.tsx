import React from 'react';
import { action } from '@storybook/addon-actions';
import RadialMenu from '.';

export default {
  title: 'RadialMenu',
  component: RadialMenu,
};

export const ZBound = () => (
  <RadialMenu
    trigger="z"
    label="Topping"
    items={[
      { label: 'Pepperoni', value: 'pepperoni' },
      { label: 'Cheese', value: 'cheese' },
      { label: 'Green Pepper', value: 'green-pepper' },
      { label: 'Pineapple', value: 'pineapple' },
    ]}
    onChange={action('changed')}
  />
);
