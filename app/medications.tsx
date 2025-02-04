import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { fb_db, fb_auth } from '../firebaseConfig'; 
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function MedicationsScreen() {
  const router = useRouter();

  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const user = fb_auth.currentUser; 
        if (!user) {
          console.error('No logged-in user found');
          return;
        }

        const medicationsRef = collection(fb_db, 'Medications'); 
        const q = query(medicationsRef, where('userId', '==', user.uid)); 
        const querySnapshot = await getDocs(q);

        const medicationsData = querySnapshot.docs.map((doc) => ({
          id: doc.id, 
          ...doc.data(),
        }));

        setMedications(medicationsData);
      } catch (error) {
        console.error('Error fetching medications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Medications</Text>
      <FlatList
        data={medications}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>Dosage: {item.dosage}{item.unit}</Text>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/add-medication')}
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
    height: 100,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
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
  cardSubtitle: {
    fontSize: 14,
    color: '#fff',
  }
});
