import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Signup() {
  return (
    <ScrollView className="flex flex-1 bg-white">
      <Text>Sign up</Text>
      <TouchableOpacity>
        <Link href="/(root)/(tabs)/home">Tab Home</Link>
      </TouchableOpacity>
    </ScrollView>
  );
}
