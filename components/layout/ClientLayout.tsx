import MapComponent from '@/components/Map';
import { useUserStore } from '@/store/auth/get-user';
import { Link } from 'expo-router';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { ReactNode, useCallback, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MechanicMapComponent from '../MechanicMap';

export default function ClientLayout({
  children,
  breakPoints,
  variant,
}: {
  children: ReactNode;
  breakPoints?: string[] | undefined;
  variant?: 'mechanic' | 'client';
}) {
  const { user } = useUserStore();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {variant === 'client' || !variant ? (
        <MapComponent />
      ) : (
        <MechanicMapComponent />
      )}

      <TouchableOpacity>
        <Link href="/(root)/about" className="text-red-900 p-3">
          About
        </Link>
      </TouchableOpacity>

      <BottomSheet
        snapPoints={breakPoints || ['27%', '85%']}
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        style={{
          borderRadius: 24,
          backgroundColor: 'F6F8FA',
        }}
      >
        <BottomSheetView
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 24,
          }}
        >
          {children}
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}
