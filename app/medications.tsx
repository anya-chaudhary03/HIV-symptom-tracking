import React, { useState } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { fb_db, fb_auth } from '../firebaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Text, FAB } from 'react-native-paper';

export default function MedicationsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedMedications, setSelectedMedications] = useState([]);

  const fetchMedications = async () => {
    try {
      const user = fb_auth.currentUser;
      if (!user) {
        console.error('No logged-in user found');
        return [];
      }

      const medicationsRef = collection(fb_db, 'Medications');
      const q = query(medicationsRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching medications:', error);
      return [];
    }
  };

  const { data: medications = [], isPending } = useQuery({
    queryKey: ['medications'],
    queryFn: fetchMedications,
    refetchOnMount: true,
  });

  const toggleSelectMedication = (id) => {
    setSelectedMedications((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((medId) => medId !== id) : [...prevSelected, id]
    );
  };

  const deleteSelectedMedications = async () => {
    if (selectedMedications.length === 0) {
      Alert.alert('No Selection', 'Please select at least one medication to delete.');
      return;
    }

    Alert.alert(
      'Delete Medications',
      `Are you sure you want to delete ${selectedMedications.length} medication(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await Promise.all(
                selectedMedications.map(async (id) => {
                  const medRef = doc(fb_db, 'Medications', id);
                  await deleteDoc(medRef);
                })
              );

              queryClient.invalidateQueries(['medications']); 
              setSelectedMedications([]);
              Alert.alert('Success', 'Selected medications deleted.');
            } catch (error) {
              console.error('Error deleting medications:', error);
              Alert.alert('Error', 'Failed to delete medications. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (isPending) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b83db" />
        <Text>Loading medications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Medications</Text>

      <FlatList
        data={medications}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <Card
            style={[styles.card, selectedMedications.includes(item.id) && styles.selectedCard]}
            onPress={() => toggleSelectMedication(item.id)}
          >
            <Card.Content>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>Dosage: {item.dosage}{item.unit}</Text>
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No medications found</Text>}
      />

      {selectedMedications.length > 0 && (
        <FAB
          style={styles.deleteButton}
          icon="delete"
          label={`Delete (${selectedMedications.length})`}
          onPress={deleteSelectedMedications}
          color="#fff"
        />
      )}

      <FAB
        style={styles.addButton}
        icon="plus"
        onPress={() => router.push('/add-medication')}
        color="#fff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  card: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 3,
  },
  selectedCard: {
    backgroundColor: '#e0f7fa', 
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#3b83db',
  },
  deleteButton: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    backgroundColor: '#FF5252',
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