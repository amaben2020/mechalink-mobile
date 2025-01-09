import ClientLayout from '@/components/layout/ClientLayout';
import { Text, View } from 'react-native';

export default function JobsScreen() {
  return (
    <ClientLayout>
      <Text className="font-JakartaBold text-center text-xl">Jobs</Text>

      <View className="flex flex-col border rounded-md p-8 mt-3">
        {/* Tab component for create and view */}
      </View>
    </ClientLayout>
  );
}
