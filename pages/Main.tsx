import React, {useState, useEffect, useRef, useMemo} from 'react';
import {Pressable, Text, View} from 'react-native';

import {SwipeListView} from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {styles} from '../styles';
import {generateRandomColor, generateRandomKey} from '../utils/utils';
import {InputSection} from '../components/InputSection';
import {Todo} from '../types/Todo';
import {TodoItem} from '../components/TodoItem';
import {Button} from '../components/Button';

const Main = ({ navigation }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editItemKey, setEditItemKey] = useState<string>('');
  const [editingValue, setEditingValue] = useState<string>('');

  const rowRefs = useRef<{[key: string]: any}>({});

  useEffect(() => {
    loadTodosFromStorage();
  }, []);

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
            steps: [],
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
        <InputSection
          inputValue={inputValue}
          setInputValue={setInputValue}
          onPress={handleAddTodo}
          buttonText="Add"
          inputStyle={styles.input}
          buttonStyle={styles.addButton}
          buttonTextStyle={styles.addButtonText}
        />
      </View>

      <SwipeListView
        disableRightSwipe={true}
        contentContainerStyle={styles.todoList}
        rightOpenValue={-180}
        stopRightSwipe={-180}
        data={sortedTodos}
        renderItem={({item}) => (
          <View>
          <Pressable onPress={() => navigation.navigate('Details', { title: item.text, status: item.done ? 'Done' : 'Not Done' })}>
            {isEditing && editItemKey === item.key ? (
              <View style={styles.editView}>
                <InputSection
                  inputValue={editingValue}
                  setInputValue={setEditingValue}
                  onPress={() => handleUpdate(item.key)}
                  buttonText="Update"
                  inputStyle={styles.editInput}
                  buttonStyle={styles.addButton}
                  buttonTextStyle={styles.addButtonText}
                />
              </View>
            ) : (
              <TodoItem item={item} toggleStatus={toggleStatus} />
            )}
          </Pressable>
          </View>
        )}
        renderHiddenItem={(data, rowMap) => {
          if (isEditing && editItemKey === data.item.key) {
            return null;
          }
          rowRefs.current[data.item.key] = rowMap[data.item.key];
          return (
            <View style={styles.hiddenButtons}>
              <Button
                buttonText="Edit"
                buttonStyle={styles.editButton}
                buttonTextStyle={styles.buttonText}
                onPress={() => handleEditTodo(data.item.key)}
              />

              <Button
                buttonText="Delete"
                buttonStyle={styles.deleteButton}
                buttonTextStyle={styles.buttonText}
                onPress={() => handleDeleteTodo(data.item.key)}
              />
            </View>
          );
        }}
        keyExtractor={item => item.key}
      />
    </View>
  );
};

export default Main;
