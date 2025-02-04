import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useRouter  } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { fb_db, fb_auth } from '../firebaseConfig'; 
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function SymptomsScreen() {
  const router = useRouter();
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const user = fb_auth.currentUser;
        if (!user) {
          console.error('No logged-in user found');
          return;
        }

        const symptomsRef = collection(fb_db, 'Symptoms'); 
        const q = query(symptomsRef, where('userId', '==', user.uid));
        console.log(user.uid)
        const querySnapshot = await getDocs(q);

        const symptomsData = querySnapshot.docs.map((doc) => ({
          id: doc.id, 
          ...doc.data(),
        }));

        setSymptoms(symptomsData);
      } catch (error) {
        console.error('Error fetching symptoms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSymptoms();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b83db" />
        <Text>Loading symptoms...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Symptoms</Text>
      <FlatList
        data={symptoms}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>Type: {item.type}</Text>
            </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No symptoms found</Text>}
      />

      {/* Add New Symptom Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push( '/add-symptom')}
      >
        <Ionicons name="add" size={48} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#3b83db',
    margin: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 120,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#fff',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#3b83db',
    borderRadius: 50,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});
