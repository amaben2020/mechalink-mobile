import MapComponent from '@/components/Map';
import { useUserStore } from '@/store/auth/get-user';
import { Link } from 'expo-router';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useCallback, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function HomeScreen() {
  const { user } = useUserStore();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
      <BottomSheet
        snapPoints={['27%', '85%']}
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        style={{
          borderRadius: 10,
          backgroundColor: 'F6F8FA',
        }}
      >
        <BottomSheetView
          style={{
            flex: 1,
            padding: 12,
          }}
        >
          <Text className="font-JakartaBold text-center text-xl">
            Mechanics Near you
          </Text>

          <View className="flex flex-col border rounded-md p-8 mt-3">
            <View>
              <Text>Image</Text>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

// tab 1: location and nearby mechs
// tab 2: job creation and nearby mechs
// tab 3: jobs
// 4: settings
