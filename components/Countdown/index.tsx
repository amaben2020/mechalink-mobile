import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CountdownProps = {
  minutes: number; // Countdown duration in minutes
  onCountdownEnd: () => void; // Called when the timer ends
  onStop: () => void; // Called when the timer is stopped manually
};

const Countdown: React.FC<CountdownProps> = ({
  minutes,
  onCountdownEnd,
  onStop,
}) => {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const TIMER_KEY = 'COUNTDOWN_TIMER';

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const startTimer = async () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTimeLeft = prev - 1;

          if (newTimeLeft <= 0) {
            clearInterval(intervalRef.current as NodeJS.Timeout);
            setIsRunning(false);
            onCountdownEnd();
            AsyncStorage.removeItem(TIMER_KEY);
            return 0;
          }

          saveTimerState(newTimeLeft); // Save updated time
          return newTimeLeft;
        });
      }, 1000);
    }
  };

  const pauseTimer = () => {
    if (isRunning) {
      setIsRunning(false);
      clearInterval(intervalRef.current as NodeJS.Timeout);
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
    setTimeLeft(minutes * 60);
    await saveTimerState(minutes * 60);
  };

  const saveTimerState = async (time: number) => {
    try {
      const timestamp = Date.now();
      await AsyncStorage.setItem(
        TIMER_KEY,
        JSON.stringify({ timeLeft: time, timestamp })
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
        const elapsedSeconds = Math.floor((Date.now() - timestamp) / 1000);
        const remainingTime = timeLeft - elapsedSeconds;

        if (remainingTime > 0) {
          setTimeLeft(remainingTime);
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

    return () => {
      clearInterval(intervalRef.current as NodeJS.Timeout);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
      {false && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={startTimer} style={styles.button}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={pauseTimer} style={styles.button}>
            <Text style={styles.buttonText}>Pause</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={stopTimer} style={styles.button}>
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={resetTimer} style={styles.button}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      )}
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
