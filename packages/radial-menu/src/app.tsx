import React, { useState } from 'react';
import { RadialMenu } from './radial-menu';
import './app/app.css';

export const App: React.FC = () => {
  const [active, setActive] = useState<string>();
  return (
    <>
      {active && (
        <span
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            color: 'white',
          }}
        >
          Active item: {active}
        </span>
      )}
      <RadialMenu
        trigger="z"
        label="Shading"
        items={['first', 'second', 'third', 'fourth', 'fifth'].map(v => ({
          label: v[0].toUpperCase() + v.substr(1),
          value: v,
        }))}
        active={active}
        onChange={value => {
          setActive(value);
        }}
      />
    </>
  );
};
