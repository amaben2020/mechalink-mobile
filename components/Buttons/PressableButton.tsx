import clsx from 'clsx';
import React, { ReactNode, useState } from 'react';
import { Pressable, Text } from 'react-native';

const PressableButton = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const [pressedIn, setPressedIn] = useState(false);
  return (
    <Pressable
      className={clsx(
        pressedIn && 'bg-primary-500 text-white',
        'border py-5 px-2',
        className
      )}
      onPress={() => {}}
      onPressIn={() => {
        setPressedIn(true);
      }}
      onPressOut={() => {
        setPressedIn(false);
      }}
    >
      {children}
    </Pressable>
  );
};

export default PressableButton;
