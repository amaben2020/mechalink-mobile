// import NetInfo from '@react-native-community/netinfo';
// import { onlineManager } from '@tanstack/react-query';

// // This enables auto-refetch when the app reconnects to the internet.
// onlineManager.setEventListener((setOnline) => {
//   return NetInfo.addEventListener((state) => {
//     setOnline(!!state.isConnected);
//   });
// });

import { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { onlineManager, focusManager } from '@tanstack/react-query';

// Utility function to handle app state changes
export function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

// Hook to handle app state focus management
export function useAppState() {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, []);
}

// Hook to handle online state management
export function useOnlineManager() {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      onlineManager.setOnline(!!state.isConnected);
    });
    return () => unsubscribe();
  }, []);
}

// Exported setup function to initialize all react-query integrations
export function initializeReactQueryIntegrations() {
  useOnlineManager();
  useAppState();
}
