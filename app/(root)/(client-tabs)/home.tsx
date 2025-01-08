import MapComponent from '@/components/Map';
import { useUserStore } from '@/store/auth/get-user';
import { Link } from 'expo-router';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const { user } = useUserStore();
  return (
    <View>
      <MapComponent />
      {/* <Text>
        CLIENT
        {JSON.stringify(user)}
      </Text> */}

      <TouchableOpacity>
        <Link href="/(root)/about" className="text-red-900 p-3">
          About
        </Link>
      </TouchableOpacity>

      {/* nearby mechs inside safe area */}

      {/* cards of mechs and online availabilities */}
    </View>
  );
}

// tab 1: location and nearby mechs
// tab 2: job creation and nearby mechs
// tab 3: jobs
// 4: settings
