import React from 'react';
import { RadialMenu } from './radial-menu';
import { KeyboardActivator } from './keyboard-activator';
import './app/app.css';

const log = (msg: string) => () => {
  console.log(msg);
};

export const App: React.FC = () => {
  return (
    <KeyboardActivator char="z">
      <RadialMenu
        label="Shading"
        items={[
          { label: 'first', active: true, onClick: log('first') },
          { label: 'second', onClick: log('second') },
          { label: 'third', onClick: log('third') },
          { label: 'fourth', onClick: log('fourth') },
          { label: 'fifth', onClick: log('fifth') },
        ]}
      />
    </KeyboardActivator>
  );
};
