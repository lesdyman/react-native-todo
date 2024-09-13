import React from 'react';
import { StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface Props {
  onPress: () => void;
  buttonText: string
  buttonTextStyle?: StyleProp<TextStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
}

export const Button: React.FC<Props> = ({ buttonText, onPress, buttonTextStyle, buttonStyle }) => (
  <TouchableOpacity
    style={buttonStyle}
    onPress={onPress}>
    <Text style={buttonTextStyle}>{buttonText}</Text>
  </TouchableOpacity>
);
