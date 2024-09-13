/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {styles} from './styles';
import {SwipeListView} from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

function App(): React.JSX.Element {
  interface Todo {
    key: string;
    text: string;
    color: string;
    done: boolean;
  }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editItemKey, setEditItemKey] = useState<string>('');
  const [editingValue, setEditingValue] = useState<string>('');

  const rowRefs = useRef<{[key: string]: any}>({});

  useEffect(() => {
    loadTodosFromStorage();
  }, []);

  function generateRandomKey() {
    const digits = '0123456789';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';

    for (let i = 0; i < 3; i++) {
      result += digits.charAt(Math.floor(Math.random() * digits.length));
    }

    for (let i = 0; i < 2; i++) {
      result += letters.charAt(Math.floor(Math.random() * letters.length));
    }

    return result;
  }

  const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const saveTodosToStorage = async (newTodos: Todo[]) => {
    try {
      const jsonValue = JSON.stringify(newTodos);
      await AsyncStorage.setItem('todos', jsonValue);
    } catch (e) {
      console.error('Error saving todos', e);
    }
  };

  const loadTodosFromStorage = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('todos');
      if (jsonValue != null) {
        setTodos(JSON.parse(jsonValue));
      } else {
        setTodos([]);
      }
    } catch (e) {
      console.error('Error loading todos', e);
    }
  };

  const handleAddTodo = () => {
    if (inputValue.trim()) {
      let updatedTodos;
      if (isEditing && editItemKey) {
        updatedTodos = todos.map(todo =>
          todo.key === editItemKey ? {...todo, text: inputValue} : todo,
        );
        setIsEditing(false);
        setEditItemKey('');
        setInputValue('');
      } else {
        updatedTodos = [
          ...todos,
          {
            key: generateRandomKey(),
            text: inputValue,
            color: generateRandomColor(),
            done: false,
          },
        ];
        setInputValue('');
      }

      setTodos(updatedTodos);
      saveTodosToStorage(updatedTodos);
    }
  };

  const handleUpdate = (itemId: string) => {
    if (editingValue.trim()) {
      const updatedTodos = todos.map(todo =>
        todo.key === itemId ? {...todo, text: editingValue} : todo,
      );
      setTodos(updatedTodos);
      saveTodosToStorage(updatedTodos);
      setIsEditing(false);
      setEditItemKey('');
      setEditingValue('');
    }
  };

  const handleDeleteTodo = (itemId: string) => {
    const updatedTodos = todos.filter(todo => todo.key !== itemId);
    setTodos(updatedTodos);
    saveTodosToStorage(updatedTodos);
  };

  const handleEditTodo = (itemId: string) => {
    setIsEditing(true);
    setEditItemKey(itemId);
    setEditingValue(todos.find(todo => todo.key === itemId)?.text || '');
  };

  const toggleStatus = (itemId: string) => {
    const updatedTodos = todos.map(item =>
      item.key === itemId ? {...item, done: !item.done} : item,
    );
    setTodos(updatedTodos);
    saveTodosToStorage(updatedTodos);
  };

  const sortedTodos = useMemo(() => {
    return todos.sort((a, b) => {
      if (a.done === b.done) {
        return 0;
      }
      return a.done ? 1 : -1;
    });
  }, [todos]);

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
        rightOpenValue={-180}
        stopRightSwipe={-180}
        data={sortedTodos}
        renderItem={({item}) => (
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
                  }}>
                  <Text style={styles.addButtonText}>Update</Text>
                </TouchableOpacity>
              </View>
            ) : (
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
                onPress={() => handleEditTodo(data.item.key)}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteTodo(data.item.key)}>
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
