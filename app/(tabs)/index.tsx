import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fb_db, fb_auth } from '../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function IndexPage() {
  const { selectedDate } = useLocalSearchParams();
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSymptom, setEditingSymptom] = useState(null);

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const currentDate = selectedDate || formatDate(new Date());

  useEffect(() => {
    const fetchSymptoms = async () => {
      setLoading(true);
      try {
        const user = fb_auth.currentUser;
        if (!user) {
          console.error('No logged-in user found');
          return;
        }
        const logsRef = collection(fb_db, 'Log');
        const q = query(
          logsRef,
          where('userId', '==', user.uid),
          where('date', '==', currentDate) 
        );
        const querySnapshot = await getDocs(q);

        const logsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSymptoms(logsData);
      } catch (error) {
        console.error('Error fetching logs:', error);
        Alert.alert('Error', 'Failed to fetch symptoms. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSymptoms();
  }, [currentDate]);

  const deleteSymptom = (id) => {
    Alert.alert('Delete Symptom', 'Are you sure you want to delete this symptom?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updatedSymptoms = symptoms.filter((symptom) => symptom.id !== id);
          setSymptoms(updatedSymptoms);
        },
      },
    ]);
  };

  const saveEditedSymptom = () => {
    const updatedSymptoms = symptoms.map((symptom) => {
      if (symptom.id === editingSymptom.id) {
        return editingSymptom;
      }
      return symptom;
    });

    setSymptoms(updatedSymptoms);
    setEditingSymptom(null); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {selectedDate ? `Selected Date: ${selectedDate}` : `Today: ${currentDate}`}
      </Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b83db" />
          <Text>Loading symptoms...</Text>
        </View>
      ) : symptoms.length > 0 ? (
        <FlatList
          data={symptoms}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {editingSymptom && editingSymptom.id === item.id ? (
                <View>
                  <TextInput
                    style={styles.input}
                    value={editingSymptom.value.toString()}
                    onChangeText={(text) =>
                      setEditingSymptom({
                        ...editingSymptom,
                        value: text,
                      })
                    }
                  />
                  <TextInput
                    style={styles.input}
                    value={editingSymptom.unit}
                    onChangeText={(text) =>
                      setEditingSymptom({
                        ...editingSymptom,
                        unit: text,
                      })
                    }
                  />
                  <TouchableOpacity style={styles.saveButton} onPress={saveEditedSymptom}>
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <Text style={styles.cardTitle}>{item.symptom}</Text>
                  <Text style={styles.cardSubtitle}>
                    Value: {item.value} {item.unit}
                  </Text>
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => setEditingSymptom(item)}
                    >
                      <Text style={styles.actionText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteSymptom(item.id)}
                    >
                      <Text style={styles.actionText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}
        />
      ) : (
        <Text>No symptoms logged for this date.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#007BFF',
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#FF5252',
    padding: 5,
    borderRadius: 5,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
