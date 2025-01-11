import { Text, View } from 'react-native';

import ClientLayout from '@/components/layout/ClientLayout';
import { useMechanicsStore } from '@/store/mechanics/mechanics';

export default function HomeScreen() {
  const { mechanics } = useMechanicsStore();

  return (
    <ClientLayout>
      <Text className="font-JakartaBold text-center text-xl">
        Mechanics Near you
      </Text>
      {/* when you click the mechanics card, there is a request button, you make a request */}

      <View className="flex flex-col">
        {mechanics?.map((mech) => (
          <View className="shadow-md border rounded-md p-8 mt-3">
            <Text>{mech?.username ?? mech?.id}</Text>
          </View>
        ))}
      </View>
    </ClientLayout>
  );
}
