/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef } from 'react';
import {
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { styles } from './styles';
import { SwipeListView } from 'react-native-swipe-list-view';

function App(): React.JSX.Element {
  const initial_todos = [
    { key: '1', text: 'Buy it', color: '#780000', done: false },
    { key: '2', text: 'Use it', color: '#fdc500', done: false },
    { key: '3', text: 'Trash it', color: '#003049', done: true },
    { key: '4', text: 'Fix it', color: '#669BBC', done: false },
  ];

  interface Todo {
    key: string;
    text: string;
    color: string;
    done: boolean;
  }

  const [todos, setTodos] = useState<Todo[]>(initial_todos);
  const [inputValue, setInputValue] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editItemKey, setEditItemKey] = useState<string>('');
  const [editingValue, setEditingValue] = useState<string>('');

  const rowRefs = useRef<{ [key: string]: any }>({});

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
      if (isEditing && editItemKey) {
        setTodos(
          todos.map(todo =>
            todo.key === editItemKey
              ? { ...todo, text: inputValue }
              : todo
          )
        );
        setIsEditing(false);
        setEditItemKey('');
        setInputValue('');
      } else {
        setTodos([
          ...todos,
          {
            key: String(todos.length + 1),
            text: inputValue,
            color: getRandomColor(),
            done: false,
          },
        ]);
        setInputValue('');
      }
    }
  };

  const handleUpdate = (itemId: string) => {
    if (editingValue.trim()) {
      setTodos(
        todos.map(todo =>
          todo.key === itemId
            ? { ...todo, text: editingValue }
            : todo
        )
      );
      setIsEditing(false);
      setEditItemKey('');
      setEditingValue('');
    }
  };

  const handleDeleteTodo = (itemId: string) => {
    setTodos(todos.filter(todo => todo.key !== itemId));
  };

  const handleEditTodo = (itemId: string) => {
    setIsEditing(true);
    setEditItemKey(itemId);
    setEditingValue(todos.find(todo => todo.key === itemId)?.text || '');
  };

  const toggleStatus = (itemId: string) => {
    setTodos(
      todos.map(item =>
        item.key === itemId ? { ...item, done: !item.done } : item
      )
    );
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
          <Text style={styles.addButtonText}>
            Add
          </Text>
        </TouchableOpacity>
      </View>

      <SwipeListView
        disableRightSwipe={true}
        contentContainerStyle={styles.todoList}
        rightOpenValue={-180}
        stopRightSwipe={-180}
        data={todos}
        renderItem={({ item }) => (
          <Pressable onPress={() => toggleStatus(item.key)}>
            {isEditing && editItemKey === item.key ? (
              <View style={styles.editView}>
                <TextInput
                  value={editingValue}
                  style={styles.editInput}
                  onChangeText={setEditingValue}
                />
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => {
                    handleUpdate(item.key);
                  }}
                >
                  <Text style={styles.addButtonText}>Update</Text>
                </TouchableOpacity>
              </View>
            ) : (
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
                {item.done && (
                  <Image
                    source={require('./assets/check.png')}
                    style={styles.checkIcon}
                  />
                )}
              </View>
            )}
          </Pressable>
        )}
        renderHiddenItem={(data, rowMap) => {
          if (isEditing && editItemKey === data.item.key) {
            return null;
          }
          rowRefs.current[data.item.key] = rowMap[data.item.key];
          return (
            <View style={styles.hiddenButtons}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditTodo(data.item.key)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteTodo(data.item.key)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        keyExtractor={item => item.key}
      />
    </View>
  );
}

export default App;
