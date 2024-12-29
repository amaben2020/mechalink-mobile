import { Link } from 'expo-router';
import { SafeAreaView, Text, TouchableOpacity } from 'react-native';

export default function Home() {
  return (
    <SafeAreaView>
      <Text>
        HOME: Lorem ipsum dolor, sit amet consectetur adipisicing elit. Officiis
        iure aperiam ut ex! Non tenetur nostrum quidem quam voluptas debitis
        earum quos quis amet quasi? Adipisci atque nam nostrum nesciunt.
      </Text>

      <TouchableOpacity>
        <Link href="/(root)/(tabs)/home">Tabs</Link>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
