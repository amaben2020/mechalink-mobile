import { Text, View } from 'react-native';

import ClientLayout from '@/components/layout/ClientLayout';

export default function HomeScreen() {
  return (
    <ClientLayout>
      <Text className="font-JakartaBold text-center text-xl">
        Mechanics Near you
      </Text>
      {/* when you click the mechanics card, there is a request button, you make a request */}

      {/* view nearby mechs by default with a radius around you */}

      <View className="flex flex-col border rounded-md p-8 mt-3">
        <View>
          <Text>Image</Text>
        </View>
      </View>
    </ClientLayout>
  );
}
