import React, { useState } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { fb_db, fb_auth } from '../firebaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Text, FAB } from 'react-native-paper';

export default function SymptomsScreen() {
  const router = useRouter();
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const queryClient = useQueryClient();

  const fetchSymptoms = async () => {
    try {
      const user = fb_auth.currentUser;
      if (!user) {
        console.error('No logged-in user found');
        return [];
      }

      const symptomsRef = collection(fb_db, 'Symptoms');
      const q = query(symptomsRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      return [];
    }
  };

  const { data: symptoms = [], isPending } = useQuery({
    queryKey: ['stored_symptoms'],
    queryFn: fetchSymptoms,
    refetchOnMount: true,
  });

  const toggleSelectSymptom = (id) => {
    setSelectedSymptoms((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((symptomId) => symptomId !== id) : [...prevSelected, id]
    );
  };

  const deleteSelectedSymptoms = async () => {
    if (selectedSymptoms.length === 0) {
      Alert.alert('No selection', 'Please select at least one symptom to delete.');
      return;
    }

    Alert.alert(
      'Delete Symptoms',
      `Are you sure you want to delete ${selectedSymptoms.length} symptom(s) and their related log entries?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await Promise.all(
                selectedSymptoms.map(async (id) => {
                  const symptomRef = doc(fb_db, 'Symptoms', id);
                  const symptomDoc = await getDoc(symptomRef);
                  const symptomName = symptomDoc.data().name;

                  await deleteDoc(symptomRef);

                  const logsRef = collection(fb_db, 'Log');
                  const logsQuery = query(logsRef, where('symptom', '==', symptomName));
                  const logsSnapshot = await getDocs(logsQuery);

                  logsSnapshot.forEach(async (logDoc) => {
                    await deleteDoc(doc(fb_db, 'Log', logDoc.id));
                  });
                })
              );

              queryClient.invalidateQueries(['stored_symptoms']);
              setSelectedSymptoms([]);
              Alert.alert('Success', 'Selected symptoms and related log entries deleted.');
            } catch (error) {
              console.error('Error deleting symptoms or logs:', error);
              Alert.alert('Error', 'Failed to delete symptoms or logs. Please try again.');
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
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <Card
            style={[styles.card, selectedSymptoms.includes(item.id) && styles.selectedCard]}
            onPress={() => toggleSelectSymptom(item.id)}
          >
            <Card.Content>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardSubtitle}>Type: {item.type}</Text>
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No symptoms found</Text>}
      />

      {selectedSymptoms.length > 0 && (
        <FAB
          style={styles.deleteButton}
          icon="delete"
          label={`Delete (${selectedSymptoms.length})`}
          onPress={deleteSelectedSymptoms}
          color="#fff"
        />
      )}

      <FAB
        style={styles.addButton}
        icon="plus"
        onPress={() => router.push('/add-symptom')}
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