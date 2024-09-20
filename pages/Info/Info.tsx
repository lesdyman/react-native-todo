import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

export const Info = () => (
  <View style={infoStyles.container}>
    <Image
      source={require('../../assets/info.jpg')}
      style={infoStyles.infoImage}
    />
    <View style={infoStyles.textContainer}>
      <Text style={infoStyles.text}>Here is your info</Text>
    </View>
  </View>
);

const infoStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  infoImage: {
    height: 300,
    width: '100%',
    borderRadius: 15,
  },
  textContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});
