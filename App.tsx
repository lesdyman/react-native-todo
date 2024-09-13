import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { styles } from './styles';
import { SwipeListView } from 'react-native-swipe-list-view';


function App(): React.JSX.Element {
  const initial_todos = [
    { key: '1', text: 'Buy it', color: '#780000'},
    { key: '2', text: 'Use it', color: '#FDF0D5'},
    { key: '3', text: 'Trash it', color: '#003049'},
    { key: '4', text: 'Fix it', color: '#669BBC'},
  ];

  interface Todo {
    key: string,
    text: string,
    color: string
  }

  const [todos, setTodos] = useState<Todo[]>(initial_todos);
  const [inputValue, setInputValue] = useState<string>('');

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleAddTodo = () => {
    if (inputValue.trim()) {
      setTodos([...todos, { key: String(todos.length + 1), text: inputValue, color: getRandomColor() }]);
      setInputValue('');
    }
  };

  const handleDeleteTodo = (itemId: string) => {
    setTodos(todos.filter(todo => todo.key !== itemId));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Todos</Text>

      <View style={styles.top_container}>
        <TextInput
          placeholder="Write something here"
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <SwipeListView
       disableRightSwipe={true}
        contentContainerStyle={styles.todoList}
        rightOpenValue={-90}
        stopRightSwipe={-90}
        data={todos}
        renderItem={({ item }) => (
          <View style={[styles.todoItem, { backgroundColor: item.color}]}>
            <Text style={styles.todoText}>{item.text}</Text>
          </View>
        )}
        renderHiddenItem={(data) => (
          <View>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteTodo(data.item.key)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.key}
      />
    </View>
  );
}

export default App;
