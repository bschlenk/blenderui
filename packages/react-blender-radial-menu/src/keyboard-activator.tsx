import React from 'react';
import { useKeyboardTrigger } from './hooks/use-keyboard-trigger';

export interface Props {
  char: string;
}

/**
 * Show a component on a keypress, and hide it on escape.
 */
export const KeyboardActivator: React.FC<Props> = ({ char, children }) => {
  const active = useKeyboardTrigger(char, () => {
    console.log('triggered!');
  });

  return active ? <>{children}</> : null;
};
