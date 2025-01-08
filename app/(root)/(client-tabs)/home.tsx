import { useUserStore } from '@/store/auth/get-user';
import { Link } from 'expo-router';
import { SafeAreaView, Text, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const { user } = useUserStore();
  return (
    <SafeAreaView>
      <Text>
        CLIENT
        {JSON.stringify(user)}
      </Text>

      <TouchableOpacity>
        <Link href="/(root)/about" className="text-red-900 p-3">
          About
        </Link>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
