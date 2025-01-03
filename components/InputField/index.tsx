import React from 'react';
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Button,
  Keyboard,
  TextInputProps,
} from 'react-native';
import clsx from 'clsx';

interface TInputField extends TextInputProps {
  onChangeText: (text: string) => void;
  label: string;
  placeholder: string;
  className?: string;
}

const InputField = ({
  onChangeText,
  label,
  placeholder,
  className,
  ...otherProps
}: TInputField) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex gap-2">
          <Text>{label}</Text>
          <TextInput
            onChangeText={onChangeText}
            placeholder={placeholder}
            className={clsx('border border-gray-500 p-4 rounded-xl', className)}
            {...otherProps}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default InputField;
