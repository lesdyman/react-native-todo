/* eslint-disable react-native/no-inline-styles */
import { Image, Pressable, Text, View } from 'react-native';
import React from 'react';
import { Todo } from '../types/Todo';
import { styles } from '../styles';

interface Props {
  item: Todo;
  toggleStatus: (itemId: string) => void;
}

export const TodoItem: React.FC<Props> = ({ item, toggleStatus }) => (
  <View style={styles.todoContainer}>
    <Pressable
      style={[
        styles.radioButtonContainer,
        { backgroundColor: item.done ? '#adb5bd' : item.color },
      ]}
      onPress={() => toggleStatus(item.key)}
    >
      {item.done && (
        <Image
          source={require('../assets/check.png')}
          style={styles.checkIcon}
        />
      )}
    </Pressable>
    <View
      style={[
        styles.todoItem,
        { backgroundColor: item.done ? '#adb5bd' : item.color },
      ]}
    >
      <Text
        style={[
          styles.todoText,
          {
            textDecorationLine: item.done ? 'line-through' : 'none',
          },
        ]}
      >
        {item.text}
      </Text>
    </View>
  </View>
);
