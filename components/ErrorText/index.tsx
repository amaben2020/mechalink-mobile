import React from 'react';
import { Text } from 'react-native';

const ErrorText = ({ message }: { message: string }) => {
  return (
    <Text style={{ color: 'red', fontStyle: 'italic', marginTop: -16 }}>
      {message}
    </Text>
  );
};

export default ErrorText;
