import React, { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  

  return (
   
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false, 
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" color={color} size={30} />,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Health',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="heart-plus" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="log-symptom"
        options={{
          title: '',
          tabBarButton: (props) => (
            <TouchableOpacity
              style={styles.plusButton}
              onPress={() => router.push('/log-symptom')}
            >
              <FontAwesome name="plus" size={28} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="health-chart"
        options={{
          title: 'Charts',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-box-outline" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons name="settings" color={color} size={30} />,
        }}
      />
    </Tabs>
   
  );
}

const styles = StyleSheet.create({
  plusButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});
