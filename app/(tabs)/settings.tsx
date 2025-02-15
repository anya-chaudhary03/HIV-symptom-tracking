import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { fb_auth } from '../../firebaseConfig'; 
import { Link } from 'expo-router';

export default function SettingsPage() {
  
  const handleLogout = async () => {
    try {
      await fb_auth.signOut(); 
      router.replace('/'); 
    } catch (error) {
      console.error('Logout Error:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <Link href="/index">logouttt</Link>

      <TouchableOpacity onPress={() => router.push('/change_password')} style={styles.button}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Privacy Policy</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={[styles.button, styles.logoutButton]}>
        <Text style={[styles.buttonText, styles.logoutButtonText]}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F5F7',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E3A59',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF5252',
  },
  logoutButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
