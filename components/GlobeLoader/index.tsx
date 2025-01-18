import LottieView from 'lottie-react-native';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

const GlobeLoader = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
      }}
    >
      //TODO: move to component
      <LottieView
        source={require('./../../assets/globe.json')}
        autoPlay
        loop
        style={{
          height: 250,
          width: 500,
        }}
      />
      <Text className="text-white font-JakartaBold text-lg flex items-center">
        Loading map data... <ActivityIndicator size="large" color="#fff" />
      </Text>
    </View>
  );
};

export default GlobeLoader;
