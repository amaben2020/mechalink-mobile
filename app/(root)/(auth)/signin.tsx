import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Signin() {
  return (
    <SafeAreaView>
      <Text>About</Text>
      <TouchableOpacity>
        <Link href="/(root)/(tabs)/home">Tab Home</Link>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
