import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import '../global.css';
import { useEffect } from 'react';
import 'react-native-reanimated';
import {
  QueryClient,
  QueryClientProvider,
  focusManager,
} from '@tanstack/react-query';
import { AppStateStatus, Platform } from 'react-native';
import { useOnlineManager, useAppState } from '@/hooks/useAppState';
import { Audio } from 'expo-av';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    'Jakarta-Bold': require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
    'Jakarta-ExtraBold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
    'Jakarta-ExtraLight': require('../assets/fonts/PlusJakartaSans-ExtraLight.ttf'),
    'Jakarta-Light': require('../assets/fonts/PlusJakartaSans-Light.ttf'),
    'Jakarta-Medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
    'Jakarta-Regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    'Jakarta-SemiBold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
  });

  function onAppStateChange(status: AppStateStatus) {
    if (Platform.OS !== 'web') {
      focusManager.setFocused(status === 'active');
    }
  }

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 2 } },
  });

  useOnlineManager();
  // useAppState(onAppStateChange);
  // useEffect(() => {
  //   let sound: any;

  //   const playSound = async () => {
  //     sound = new Audio.Sound();
  //     try {
  //       await sound.loadAsync(require('./../assets/start.wav'));
  //       await sound.playAsync();
  //     } catch (error) {
  //       console.error('Error playing sound', error);
  //     }
  //   };

  //   playSound();

  //   return () => {
  //     // Cleanup the sound instance
  //     if (sound) {
  //       sound.unloadAsync();
  //     }
  //   };
  // }, []);

  useEffect(() => {
    let sound: Audio.Sound | null = null;

    const playSoundAndHideSplash = async () => {
      try {
        sound = new Audio.Sound();
        await sound.loadAsync(require('./../assets/start.wav'));
        await sound.playAsync();

        // Wait for the sound to finish playing or hide the splash screen after a delay
        sound.setOnPlaybackStatusUpdate(async (status) => {
          //@ts-ignore
          if (status?.didJustFinish) {
            await SplashScreen.hideAsync(); // Hide the splash screen after sound finishes
          }
        });
      } catch (error) {
        console.error('Error playing sound', error);
        // Ensure the splash screen hides even if sound fails
        await SplashScreen.hideAsync();
      }
    };

    playSoundAndHideSplash();

    return () => {
      // Cleanup the sound instance
      if (sound) {
        sound.unloadAsync();
        sound = null;
      }
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(root)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </QueryClientProvider>
  );
}
