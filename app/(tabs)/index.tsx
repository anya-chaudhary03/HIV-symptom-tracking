import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fb_db, fb_auth } from '../../firebaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

export default IndexPage;

export function IndexPage() {
  

  return  <IndexElement />
  
}

export function IndexElement() {
  const { selectedDate } = useLocalSearchParams();
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const currentDate = selectedDate || formatDate(new Date());

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

      return logsData
    } catch (error) {
      console.error('Error fetching logs:', error);
      Alert.alert('Error', 'Failed to fetch symptoms. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  const {data,isPending,error} = useQuery({
    queryKey: ["symptoms",selectedDate],
    queryFn: () => {
      return fetchSymptoms()
    },
    refetchOnMount: true,
  });

  useEffect(() => {
    if(data) {
      setSymptoms(data);
    }
  }, [data]);

  const deleteSymptom = async (id) => {
    Alert.alert('Delete Symptom', 'Are you sure you want to remove this entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const symptomRef = doc(fb_db, 'Log', id);
            await deleteDoc(symptomRef);

            const updatedSymptoms = symptoms.filter((symptom) => symptom.id !== id);
            setSymptoms(updatedSymptoms);

            Alert.alert('Success', 'Symptom deleted successfully.');
          } catch (error) {
            console.error('Error deleting symptom:', error);
            Alert.alert('Error', 'Failed to delete the symptom. Please try again later.');
          }
        },
      },
    ]);
  };

  const renderDailyScale = (value) => {
    const max = 10;
    return (
      <View style={styles.scaleContainer}>
        {Array.from({ length: max }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.scaleDot,
              index < value ? styles.filledDot : styles.emptyDot,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        {selectedDate ? `Records for ${selectedDate}` : `Today's Records: ${currentDate}`}
      </Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text>Loading records...</Text>
        </View>
      ) : symptoms.length > 0 ? (
        <FlatList
          data={symptoms}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.symptomName}>{item.symptom}</Text>
                {item.type === 'Severity' ? (
                  renderDailyScale(parseInt(item.value, 10))
                ) : (
                  <Text style={styles.symptomValue}>{item.value} {item.unit}</Text>
                )}
              </View>
              <TouchableOpacity onPress={() => deleteSymptom(item.id)} style={styles.deleteButton}>
                <MaterialIcons name="delete" size={22} color="white" />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noDataText}>No records found for this date.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2E3A59',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'column',
  },
  symptomName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E3A59',
  },
  symptomValue: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: '600',
    marginTop: 3,
  },
  deleteButton: {
    backgroundColor: '#FF5252',
    padding: 8,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: 35,
    height: 35,
  },
  scaleContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  scaleDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  filledDot: {
    backgroundColor: '#007BFF',
  },
  emptyDot: {
    backgroundColor: '#D0D3D4',
  },
  noDataText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#6C757D',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

