lay out ::

import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const currentColor = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[currentColor ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab, 
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Timer',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="timer" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}



// index  


import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FOCUS_TIME = .2 * 60;
const BREAK_TIME = .1 * 60;

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export default function PomodoroTimer() {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(FOCUS_TIME);
  const [isFocusMode, setIsFocusMode] = useState(true);

  // load all save data and notification request
  useEffect(() => {
    requestPermissions();
    loadState();
  }, []);

  useEffect(() => {
    saveState();
  }, [seconds, isActive, isFocusMode]);

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (isActive && seconds === 0) {
      handleSessionComplete();
    }
    // for clear prevent mutliple same time  1000 java script in mili sec
    return () => clearInterval(interval);
  }, [isActive, seconds, isFocusMode]);

  async function requestPermissions() {
    if (Platform.OS === 'web') return;
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Notification permissions not granted');
    }
  }

  async function handleSessionComplete() {
    const nextMode = !isFocusMode;
    setIsFocusMode(nextMode);
    setSeconds(nextMode ? FOCUS_TIME : BREAK_TIME);

    if (Platform.OS !== 'web') {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Pomodoro Timer",
          body: nextMode ? "Break over! Time to focus." : "Work session completed! Time for a break!",
        },
        trigger: null,
      });
    } else {
      alert(nextMode ? "Break over! Time to focus." : "Work session completed! Time for a break!");
    }
  }

  const saveState = async () => {
    try {
      const state = JSON.stringify({ seconds, isFocusMode });
      await AsyncStorage.setItem('pomodoro_state', state);
    } catch (e) {
      console.error('Failed to save state');
    }
  };

  const loadState = async () => {
    try {
      const saved = await AsyncStorage.getItem('pomodoro_state');
      if (saved) {
        const { seconds: s, isFocusMode: m } = JSON.parse(saved);
        setSeconds(s);
        setIsFocusMode(m);
      }
    } catch (e) {
      console.error('Failed to load state');
    }
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setIsFocusMode(true);
    setSeconds(FOCUS_TIME);
  };

  const formatTime = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: isFocusMode ? '#ffffffff' : '#3caf89ff' }]}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.modeText}>
        {isFocusMode ? 'Focus' : 'Break'}
        {"\n"}
        <Text style={styles.smallText}>
          {isFocusMode ? "Let's focus" : "Let's take a break"}
        </Text>
      </Text>

      <View style={styles.timerCircle}>
        <Text style={styles.timer}>{formatTime(seconds)}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleTimer}>
          <Text style={styles.buttonText}>{isActive ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={resetTimer}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modeText: {
    fontSize: 32,
    color: 'black',
    fontWeight: '600',
    marginBottom: 20,
  },
  smallText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: 'gray',
  },
  timer: {
    fontSize: 72,
    color: 'black',
    fontWeight: 'bold',
  },
  timerCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 6,
    borderColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
});
 


 ///  add ing 


  // my added
  'timer': 'timer',
  // 'chart.bar.fill': 'bar-chart',
  'gearshape.fill': 'settings',