import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const TabIcon = ({
  focused,
  iconName,
}: {
  focused: boolean;
  iconName: any;
}) => (
  <View
    style={
      Platform.OS === 'android'
        ? {
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
            marginBottom: 30,
            borderRadius: 24,
          }
        : {}
    }
    className={`flex flex-row justify-center items-center rounded-full ${
      focused ? 'bg-general-400' : ''
    }`}
  >
    <View
      className={`rounded-full w-12 h-12 items-center justify-center ${
        focused ? 'bg-general-400' : ''
      }`}
    >
      <Ionicons
        name={iconName ?? 'car'}
        size={focused ? 24 : 32}
        color={focused ? 'white' : 'green'}
      />
    </View>
  </View>
);

export default function TabLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'white',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: '#333333',
          borderRadius: 50,
          height: 78,
          marginHorizontal: 20,
          marginBottom: 20,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
          paddingVertical: 10,
          position: 'absolute',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="home" />
          ),
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: 'Jobs',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="car" />
          ),
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Requests',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="list-outline" />
          ),
        }}
      />{' '}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} iconName="settings-outline" />
          ),
        }}
      />{' '}
    </Tabs>
  );
}
