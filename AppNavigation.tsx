import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {DetailsPage} from './pages/DetailsPage';
import Main from './pages/Main';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="Main"
          component={Main}
          options={{headerShown: false}}
        />
        <Stack.Screen
        name="Details"
        component={DetailsPage}
        options={
          {
            headerTransparent: true,
            headerTitle: '',
            headerTintColor: '#000',
          }
        } />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
