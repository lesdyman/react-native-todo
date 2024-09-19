/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { generateRandomKey } from '../utils/utils';
import { Step } from '../types/Step';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Todo } from '../types/Todo';

export const DetailsPage = ({ route }) => {
  const { title, status } = route.params;

  const [steps, setSteps] = useState<Step[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [newStep, setNewStep] = useState('');

  const loadTodoSteps = useCallback(async () => {
    try {
      const todos = await AsyncStorage.getItem('todos');
      if (todos) {
        const todosArray = JSON.parse(todos) as Todo[];
        const todo = todosArray.find(t => t.text === title);
        if (todo) {
          setSteps(todo.steps || []);
        }
      }
    } catch (e) {
      console.error('Error loading todo steps', e);
    }
  }, [title]);

  useEffect(() => {
    loadTodoSteps();
  }, [loadTodoSteps]);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const handleAddStep = () => {
    if (newStep.trim()) {
      const updatedSteps = [...steps, { id: generateRandomKey(), action: newStep, done: false }];
      setSteps(updatedSteps);

      updateTodoSteps(title, updatedSteps);

      setNewStep('');
      setModalVisible(false);
    }
  };

  const updateTodoSteps = async (todoTitle: string, updatedSteps: Step[]) => {
    try {
      const todos = await AsyncStorage.getItem('todos');
      if (todos) {
        const todosArray = JSON.parse(todos) as Todo[];
        const updatedTodos = todosArray.map(todo =>
          todo.text === todoTitle ? { ...todo, steps: updatedSteps } : todo
        );
        await AsyncStorage.setItem('todos', JSON.stringify(updatedTodos));
      }
    } catch (e) {
      console.error('Error updating steps', e);
    }
  };

  const toggleStatus = (itemId: string) => {
    const updatedSteps = steps.map((item) =>
      item.id === itemId ? { ...item, done: !item.done } : item
    );
    setSteps(updatedSteps);

    updateTodoSteps(title, updatedSteps);
  };

  const handleRemoveStep = (stepId: string) => {
    const updatedSteps = steps.filter(step => step.id !== stepId);
    setSteps(updatedSteps);
    updateTodoSteps(title, updatedSteps);
  };

  return (
    <View style={detailStyles.container}>
      <Image
        source={require('../assets/todo_task_img.jpg')}
        style={detailStyles.image}
        resizeMode="cover"
      />
      <Text style={detailStyles.text}>{title}:</Text>

      <View style={detailStyles.statusContainer}>
        <Text style={detailStyles.statusTitle}>Status:</Text>
        <Text style={detailStyles.statusText}>{status}</Text>
      </View>
      <Text style={detailStyles.stepsTitle}>Steps:</Text>
      <View style={detailStyles.buttonContainer}>
        <TouchableOpacity onPress={toggleModal}>
          <Text style={detailStyles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={detailStyles.listContainer}>
        <FlatList
          data={steps}
          renderItem={({ item }) => (
            <View style={detailStyles.stepItemContainer}>
              <TouchableOpacity
                onPress={() => toggleStatus(item.id)}
                style={[
                  detailStyles.stepItem,
                  { backgroundColor: item.done ? '#808080' : '#FF0000' },
                ]}
              >
                <Text
                  style={[
                    detailStyles.stepItemText,
                    { textDecorationLine: item.done ? 'line-through' : 'none' },
                  ]}
                >
                  {item.action}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={detailStyles.closeButton}
                onPress={() => handleRemoveStep(item.id)}
              >
                <Text style={detailStyles.closeButtonText}>X</Text>
              </TouchableOpacity>
            </View>
          )}
          numColumns={2}
          keyExtractor={item => item.id}
        />
      </View>
      <Modal animationType="slide" visible={modalVisible}>
        <View style={detailStyles.modalView}>
          <Text style={detailStyles.modalTitle}>Add new step:</Text>
          <TextInput
            style={detailStyles.modalInput}
            placeholder="What should be done?"
            value={newStep}
            onChangeText={setNewStep}
          />
          <View style={detailStyles.modalButtonContainer}>
            <TouchableOpacity
              style={detailStyles.modalAddButton}
              onPress={handleAddStep}
            >
              <Text style={detailStyles.ButtonTitle}>Add Step</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={detailStyles.modalCancelButton}
              onPress={toggleModal}
            >
              <Text style={detailStyles.ButtonTitle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const detailStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: 300,
    width: '100%',
    borderRadius: 15,
    position: 'absolute',
    top: 0,
  },
  text: {
    marginTop: 310,
    padding: 16,
    fontSize: 25,
    fontWeight: '700',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  stepsTitle: {
    marginLeft: 16,
    fontSize: 20,
    fontWeight: '700',
  },
  stepItem: {
    flex: 1,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  stepItemText: {
    fontSize: 20,
    color: '#fff',
  },
  stepItemContainer: {
    position: 'relative',
    margin: 3,
    width: '47%',
  },
  statusContainer: {
    paddingVertical: 10,
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF0000',
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    flex: 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    height: 20,
    width: 20,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  closeButtonText: {
    color: '#fff',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 15,
    color: '#fff',
  },
  modalInput: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    width: '80%',
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 40,
    gap: 10,
  },
  modalAddButton: {
    flex: 1,
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonTitle: {
    color: '#fff',
    fontSize: 16,
  },
});
