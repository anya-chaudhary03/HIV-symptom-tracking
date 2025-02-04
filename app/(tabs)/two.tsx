import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

export default function HealthTrackingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}> Health Tracking </Text>
      </View>
      <View style={styles.iconsContainer}>
        <TouchableOpacity
          style={styles.iconCard}
          onPress={() => router.push('/symptoms')}
        >
          <Ionicons name="heart-outline" size={60} color="#E08FFF" />
          <Text style={styles.iconText}> Symptoms </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconCard}
          onPress={() => router.push('/medications')}
        >
          <MaterialCommunityIcons name="pill" size={60} color="#6FCF97" />
          <Text style={styles.iconText}> Medications </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconCard}
          onPress={() => router.push('/support')}
        >
          <FontAwesome5 name="hands-helping" size={60} color="#FFA500" />
          <Text style={styles.iconText}> Support </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  iconsContainer: {
    flexDirection: 'column',  
    alignItems: 'center',        
    width: '100%',                 
    marginTop: 20,
  },
  iconCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: 150,       
    height: 150,                
    marginBottom: 20,          
  },
  iconText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
});

