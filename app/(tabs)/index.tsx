import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fb_db, fb_auth } from '../../firebaseConfig';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { Card, Button, Text, useTheme } from 'react-native-paper';
import SymptomCard from '../SymptomCard';
import MedicationCard from '../MedicationCard';

export default IndexPage;

export function IndexPage() {
  return <IndexElement />;
}

export function IndexElement() {
  const { selectedDate } = useLocalSearchParams();
  const [symptoms, setSymptoms] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  };

  const currentDate = selectedDate || formatDate(new Date());

  const fetchData = async () => {
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

      const medicationsRef = collection(fb_db, 'Medications');
      const medicationsQuery = query(
        medicationsRef,
        where('userId', '==', user.uid)
      );
      const medicationsSnapshot = await getDocs(medicationsQuery);
      const medicationsData = medicationsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filteredMedications = medicationsData.filter((medication) => {
        const startDate = new Date(medication.date);
        const daysDiff = Math.floor((new Date(currentDate) - startDate) / (1000 * 60 * 60 * 24));
        console.log(daysDiff)
        return daysDiff % medication.frequency !== 0;
      });

      return { logsData, filteredMedications };
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["data", selectedDate],
    queryFn: fetchData,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (data) {
      setSymptoms(data.logsData);
      setMedications(data.filteredMedications);
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

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.header}>
        {selectedDate ? `Records for ${selectedDate}` : `Today's Records: ${currentDate}`}
      </Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text>Loading records...</Text>
        </View>
      ) : (
        <>
          {symptoms.length > 0 || medications.length > 0 ? (
            <FlatList
              data={[...symptoms, ...medications]}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                if (item.symptom) {
                  return <SymptomCard item={item} onDelete={deleteSymptom} />;
                } else {
                  return <MedicationCard item={item} />;
                }
              }}
            />
          ) : (
            <Text variant="bodyLarge" style={styles.noDataText}>
              No records found for this date.
            </Text>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F8F9FA',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});