import React, {useRef} from 'react';
import {StyleSheet, Text, View, Animated, TouchableOpacity} from 'react-native';

const BASIC_HEIGHT = 300;

export const Info = () => {
  const scrollRef = useRef(new Animated.Value(0)).current;

  const getImageTransformStyle = (scroll: Animated.Value) => ({
    transform: [
      {
        translateY: scroll.interpolate({
          inputRange: [-BASIC_HEIGHT, 0, BASIC_HEIGHT, BASIC_HEIGHT + 1],
          outputRange: [
            -BASIC_HEIGHT / 2,
            0,
            BASIC_HEIGHT * 0.7,
            BASIC_HEIGHT * 0.7,
          ],
        }),
      },
    ],
  });

  return (
    <Animated.ScrollView
      onScroll={Animated.event(
        [{nativeEvent: {contentOffset: {y: scrollRef}}}],
        {useNativeDriver: true},
      )}
      scrollEventThrottle={16}>
      <View style={infoStyles.container}>
        <Animated.Image
          source={require('../../assets/info.jpg')}
          style={[infoStyles.infoImageBase, getImageTransformStyle(scrollRef)]}
        />
        <View style={infoStyles.textContainer}>
          <Text style={infoStyles.text}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam aut
            quisquam error enim cum mollitia explicabo animi est porro ipsam,
            consectetur id similique? Et in neque quasi, veniam vel explicabo.
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            <TouchableOpacity style={infoStyles.clickNow}>
              <Text style={infoStyles.clickNowText}>And NOW Click this!!!</Text>
            </TouchableOpacity>
            Quam aut quisquam error enim cum mollitia explicabo animi est porro
            ipsam, consectetur id similique? Et in neque quasi, veniam vel
            explicabo. Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Quam aut quisquam error enim cum mollitia explicabo animi est porro
            ipsam, consectetur id similique? Et in neque quasi, veniam vel
            explicabo.
          </Text>
        </View>
      </View>
    </Animated.ScrollView>
  );
};

const infoStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  infoImageBase: {
    height: BASIC_HEIGHT,
    width: '100%',
  },
  textContainer: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    padding: 10,
    lineHeight: 40,
  },
  clickNow: {
    paddingLeft: 10,
  },
  clickNowText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});
