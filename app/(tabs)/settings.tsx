import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { fb_auth, fb_db } from '../../firebaseConfig'; // Import Firestore
import { deleteUser } from 'firebase/auth';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function SettingsPage() {
  const handleLogout = async () => {
    try {
      await fb_auth.signOut();
      router.replace('/log_out');
    } catch (error) {
      console.error('Logout Error:', error);
      alert('Failed to log out. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    const user = fb_auth.currentUser;

    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account and all associated data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {

              const userId = user.uid;

              const symptomsRef = collection(fb_db, 'Symptoms');
              const symptomsQuery = query(symptomsRef, where('userId', '==', userId));
              const symptomsSnapshot = await getDocs(symptomsQuery);
              symptomsSnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
              });

              const logsRef = collection(fb_db, 'Log');
              const logsQuery = query(logsRef, where('userId', '==', userId));
              const logsSnapshot = await getDocs(logsQuery);
              logsSnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
              });

              const medicationsRef = collection(fb_db, 'Medications');
              const medicationsQuery = query(medicationsRef, where('userId', '==', userId));
              const medicationsSnapshot = await getDocs(medicationsQuery);
              medicationsSnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
              });

              await deleteUser(user);

              Alert.alert('Success', 'Your account and all associated data have been deleted.');
              router.replace('/log_out');
            } catch (error) {
              console.error('Delete Account Error:', error);
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <TouchableOpacity onPress={() => router.push('/change_password')} style={styles.button}>
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/privacy_policy')} style={styles.button}>
        <Text style={styles.buttonText}>Privacy Policy</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={[styles.button, styles.logoutButton]}>
        <Text style={[styles.buttonText, styles.logoutButtonText]}>Logout</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleDeleteAccount} style={[styles.button, styles.deleteButton]}>
        <Text style={[styles.buttonText, styles.deleteButtonText]}>Delete Account</Text>
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
  deleteButton: {
    backgroundColor: '#DC3545', 
  },
  deleteButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});