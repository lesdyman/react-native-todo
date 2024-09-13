import React from 'react';
import {
  TextInput,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import {Button} from './Button';

interface Props {
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  onPress: () => void;
  buttonText: string;
  inputStyle?: StyleProp<TextStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTextStyle?: StyleProp<TextStyle>;
}

export const InputSection: React.FC<Props> = ({
  inputValue,
  setInputValue,
  onPress,
  buttonText,
  inputStyle,
  buttonStyle,
  buttonTextStyle,
}) => (
  <>
    <TextInput
      placeholder="Write something here"
      style={inputStyle}
      value={inputValue}
      onChangeText={setInputValue}
    />
    <Button
      buttonStyle={buttonStyle}
      buttonText={buttonText}
      buttonTextStyle={buttonTextStyle}
      onPress={onPress}
    />
  </>
);
