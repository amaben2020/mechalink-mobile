import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

export default function about() {
  return (
    <View>
      <Text>About</Text>
      <TouchableOpacity>
        <Link href="/(root)/(tabs)/home">Tab Home</Link>
      </TouchableOpacity>
    </View>
  );
}
