/* eslint-disable react-native/no-inline-styles */
import { Image, Text, View } from 'react-native';
import React from 'react';
import { Todo } from '../types/Todo';
import { styles } from '../styles';

interface Props {
  item: Todo;
}

export const TodoItem: React.FC<Props> = ({ item }) => (
  <View
  style={[
    styles.todoItem,
    {backgroundColor: item.done ? '#adb5bd' : item.color},
  ]}>
  <Text
    style={[
      styles.todoText,
      {
        textDecorationLine: item.done ? 'line-through' : 'none',
      },
    ]}>
    {item.text}
  </Text>
  {item.done && (
    <Image
      source={require('../assets/check.png')}
      style={styles.checkIcon}
    />
  )}
</View>
);
