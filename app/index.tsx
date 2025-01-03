import { Link, Redirect } from 'expo-router';
import { SafeAreaView, Text, TouchableOpacity } from 'react-native';

export default function Home() {
  const isSignedIn = false;

  if (!isSignedIn) {
    return <Redirect href="/(root)/(auth)/welcome" />;
  }

  return <Redirect href="/(root)/(tabs)/home" />;
}
