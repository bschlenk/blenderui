import React from 'react';
import { ComponentStory } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import RadialMenu from '.';

export default {
  title: 'Components/RadialMenu',
  component: RadialMenu,
};

const Template: ComponentStory<typeof RadialMenu> = (args) => {
  const [active, setActive] = React.useState<string | undefined>(undefined);

  return (
    <div>
      <p>Press {args.trigger} to trigger</p>
      <RadialMenu
        {...args}
        onChange={(val) => {
          setActive(val);
          action('onChange')(val);
        }}
        active={active}
      />
    </div>
  );
};

export const Primary = Template.bind({});
Primary.args = {
  trigger: 'z',
  label: 'Topping',
  items: [
    { label: 'Pepperoni', value: 'pepperoni' },
    { label: 'Cheese', value: 'cheese' },
    { label: 'Green Pepper', value: 'green-pepper' },
    { label: 'Pineapple', value: 'pineapple' },
  ],
};
