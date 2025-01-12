import { useEffect } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { focusManager } from '@tanstack/react-query';

// This updates the app state when the app is active

export function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    focusManager.setFocused(status === 'active');
  }
}

useEffect(() => {
  const subscription = AppState.addEventListener('change', onAppStateChange);
  return () => subscription.remove();
}, []);
