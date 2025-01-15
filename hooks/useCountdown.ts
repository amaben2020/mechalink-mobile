import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

//TODO: Refactor this component

type UseCountdownProps = {
  minutes: number;
  onCountdownEnd: () => void;
  onStop: () => void;
};

type UseCountdownReturn = {
  timeLeft: number;
  isRunning: boolean;
  startTimer: () => void;
  pauseTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  formatTime: (seconds: number) => string;
};

const TIMER_KEY = 'COUNTDOWN_TIMER';

export const useCountdown = ({
  minutes,
  onCountdownEnd,
  onStop,
}: UseCountdownProps): UseCountdownReturn => {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

          saveTimerState(newTimeLeft);
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
    setTimeLeft(0);
    await AsyncStorage.removeItem(TIMER_KEY);
    onStop();
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
          await AsyncStorage.removeItem(TIMER_KEY);
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

  return {
    timeLeft,
    isRunning,
    startTimer,
    pauseTimer,
    stopTimer,
    resetTimer,
    formatTime,
  };
};
