import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';

type CountdownProps = {
  minutes: number; // Countdown duration in minutes
  onCountdownEnd: () => void; // Called when the timer ends
  onStop: () => void; // Called when the timer is stopped manually
  startCounter: boolean;
};

const Countdown: React.FC<CountdownProps> = ({
  minutes,
  onCountdownEnd,
  onStop,
  startCounter,
}) => {
  const [timeLeft, setTimeLeft] = useState(minutes * 60); // Initialize with countdown time in seconds
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const TIMER_KEY = 'COUNTDOWN_TIMER';
  const startTimestampRef = useRef<number | null>(null); // Tracks the start timestamp when the timer starts

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const startTimer = async () => {
    if (!isRunning) {
      setIsRunning(true);
      startTimestampRef.current = Date.now(); // Save start timestamp when the timer starts
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const elapsedTime = Math.floor(
            (Date.now() - startTimestampRef.current!) / 1000,
          );
          const newTimeLeft = Math.max(prev - 1, 0); // Ensure timeLeft doesn't go below 0

          if (newTimeLeft <= 0) {
            clearInterval(intervalRef.current as NodeJS.Timeout);
            setIsRunning(false);
            onCountdownEnd();
            AsyncStorage.removeItem(TIMER_KEY); // Clear stored timer state
            return 0;
          }

          saveTimerState(newTimeLeft, elapsedTime); // Save updated time and elapsed time
          return newTimeLeft;
        });
      }, 1000);
    }
  };

  const pauseTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      clearInterval(intervalRef.current as NodeJS.Timeout);
      const elapsedTime = Math.floor(
        (Date.now() - startTimestampRef.current!) / 1000,
      );
      saveTimerState(timeLeft, elapsedTime); // Save current state when paused
    }
  };

  const stopTimer = async () => {
    pauseTimer();
    setTimeLeft(0); // Reset the timer
    await AsyncStorage.removeItem(TIMER_KEY); // Clear storage
    onStop(); // Trigger reassignment logic
  };

  const resetTimer = async () => {
    pauseTimer();
    setTimeLeft(minutes * 60); // Reset to initial time
    await saveTimerState(minutes * 60, 0); // Save reset time and reset elapsed time
  };

  const saveTimerState = async (time: number, elapsedTime: number) => {
    try {
      const timestamp = Date.now() - elapsedTime * 1000; // Adjust the timestamp based on elapsed time
      await AsyncStorage.setItem(
        TIMER_KEY,
        JSON.stringify({ timeLeft: time, timestamp }),
      );
    } catch (error) {
      console.error('Failed to save timer state:', error);
    }
  };

  const loadTimerState = async () => {
    try {
      const savedState = await AsyncStorage.getItem(TIMER_KEY);
      if (savedState) {
        const { timeLeft, timestamp } = JSON.parse(savedState);
        const elapsedTime = Math.floor((Date.now() - timestamp) / 1000);
        const remainingTime = timeLeft - elapsedTime;

        if (remainingTime > 0) {
          setTimeLeft(remainingTime);
          if (!isRunning) {
            startTimer(); // Restart the timer if there is still time left and it's not already running
          }
        } else {
          onCountdownEnd();
          await AsyncStorage.removeItem(TIMER_KEY); // Clear storage if expired
        }
      }
    } catch (error) {
      console.error('Failed to load timer state:', error);
    }
  };

  useEffect(() => {
    loadTimerState();

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalRef.current as NodeJS.Timeout);
    };
  }, []);

  useEffect(() => {
    if (startCounter) {
      startTimer();
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={isRunning ? pauseTimer : startTimer}>
          <Ionicons name={isRunning ? 'pause' : 'play'} size={40} />
        </TouchableOpacity>
        <TouchableOpacity onPress={stopTimer}>
          <Ionicons name={'stop'} size={40} />
        </TouchableOpacity>
        <TouchableOpacity onPress={resetTimer}>
          <Ionicons name={'infinite'} size={40} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Countdown;
