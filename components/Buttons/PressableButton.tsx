import clsx from 'clsx';
import React, { ReactNode, useState } from 'react';
import { Pressable, Text } from 'react-native';

const PressableButton = ({
  children,
  className,
  selected,
  onPress,
}: {
  children: ReactNode;
  className?: string;
  selected?: boolean;
}) => {
  const [pressedIn, setPressedIn] = useState(false);
  return (
    <Pressable
      className={clsx(
        pressedIn && 'bg-primary-500 text-white',
        selected && 'bg-primary-500 text-white',
        'py-5 px-2',
        className,
      )}
      onPress={onPress}
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
