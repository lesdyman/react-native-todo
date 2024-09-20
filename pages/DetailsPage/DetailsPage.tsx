/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {generateRandomKey, loadDataFromStorage} from '../../utils/utils';
import {Step} from '../../types/Step';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Todo} from '../../types/Todo';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../types/RootStackParamList';
import {detailStyles} from './detailStyles';

type DetailsPageRouteProp = RouteProp<RootStackParamList, 'DetailsPage'>;

interface DetailsPageProps {
  route: DetailsPageRouteProp;
}

export const DetailsPage: React.FC<DetailsPageProps> = ({route}) => {
  const {title, status} = route.params;

  const [steps, setSteps] = useState<Step[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [newStep, setNewStep] = useState('');

  const loadTodoSteps = useCallback(async () => {
    const todos = await loadDataFromStorage<Todo[]>('todos');
    if (todos) {
      const todo = todos.find(t => t.text === title);
      if (todo) {
        setSteps(todo.steps || []);
      }
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
      const updatedSteps = [
        ...steps,
        {id: generateRandomKey(), action: newStep, done: false},
      ];
      setSteps(updatedSteps);

      updateTodoSteps(title, updatedSteps);

      setNewStep('');
      setModalVisible(false);
    }
  };

  const updateTodoSteps = async (todoTitle: string, updatedSteps: Step[]) => {
    try {
      const todos = await loadDataFromStorage<Todo[]>('todos');
      if (todos) {
        const updatedTodos = todos.map(todo =>
          todo.text === todoTitle ? {...todo, steps: updatedSteps} : todo,
        );
        await AsyncStorage.setItem('todos', JSON.stringify(updatedTodos));
      }
    } catch (e) {
      console.error('Error updating steps', e);
    }
  };

  const toggleStatus = (itemId: string) => {
    const updatedSteps = steps.map(item =>
      item.id === itemId ? {...item, done: !item.done} : item,
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
        source={require('../../assets/todo_task_img.jpg')}
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
          renderItem={({item}) => (
            <View style={detailStyles.stepItemContainer}>
              <TouchableOpacity
                onPress={() => toggleStatus(item.id)}
                style={[
                  detailStyles.stepItem,
                  {backgroundColor: item.done ? '#808080' : '#FF0000'},
                ]}>
                <Text
                  style={[
                    detailStyles.stepItemText,
                    {textDecorationLine: item.done ? 'line-through' : 'none'},
                  ]}>
                  {item.action}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={detailStyles.closeButton}
                onPress={() => handleRemoveStep(item.id)}>
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
              onPress={handleAddStep}>
              <Text style={detailStyles.ButtonTitle}>Add Step</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={detailStyles.modalCancelButton}
              onPress={toggleModal}>
              <Text style={detailStyles.ButtonTitle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
