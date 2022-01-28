import React, { useState } from 'react';
import { ComponentStory } from '@storybook/react';
import SplitWindows from '.';

export default {
  title: 'Components/SplitWindows',
  component: SplitWindows,
  parameters: {
    layout: 'fullscreen',
  },
};

const Template: ComponentStory<typeof SplitWindows> = (args) => {
  const [pane, setPane] = useState(args.pane);

  return (
    <div style={{ height: '100vh' }}>
      <SplitWindows pane={pane} onChange={setPane} />
    </div>
  );
};

export const Main = Template.bind({});
Main.args = {
  pane: {
    splits: [
      { size: 30, component: <p>Hello</p> },
      {
        size: 70,
        direction: 'column',
        splits: [
          { size: 20, component: <p>Hello 2</p> },
          {
            size: 80,
            direction: 'row',
            splits: [
              { size: 50, component: <p>Hello 3</p> },
              { size: 50, component: <p>Hello 4</p> },
              { size: 50, component: <p>Hello 5</p> },
            ],
          },
        ],
      },
    ],
    direction: 'row',
  },
};

export const One = Template.bind({});
One.args = { pane: { size: 100, component: <p>Hello</p> } };
