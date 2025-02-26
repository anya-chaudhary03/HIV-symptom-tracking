import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, Text, Card, ActivityIndicator } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fb_db, fb_auth } from '../../firebaseConfig';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useQueryClient } from '@tanstack/react-query';

export default function LogSymptomScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [selectedSymptomType, setSelectedSymptomType] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

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

  const handleDateChange = (event, date) => {
    setShowPicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleSymptomChange = (value) => {
    const symptom = symptoms.find((s) => s.name === value);
    setSelectedSymptom(value);
    setSelectedSymptomType(symptom?.type || null);
    setSelectedValue(null);
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedSymptom || !selectedValue) {
      Alert.alert('Please fill out all fields!');
      return;
    }

    setIsSaving(true); 
    try {
      const user = fb_auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'You must be logged in to log a symptom!');
        return;
      }

      const logData = {
        date: selectedDate.toISOString().split('T')[0],
        symptom: selectedSymptom,
        value: selectedValue,
        userId: user.uid,
      };

      const logsRef = collection(fb_db, 'Log');
      await addDoc(logsRef, logData);

      Alert.alert('Success', 'Symptom logged successfully!');
      queryClient.invalidateQueries({ queryKey: ['data'] });
    } catch (error) {
      console.error('Error logging symptom:', error);
      Alert.alert('Error', 'An error occurred while logging the symptom. Please try again.');
    } finally {
      setIsSaving(false); 
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Log Symptom</Text>

          <Text style={styles.label}>Select Date:</Text>
          <DateTimePicker
            value={selectedDate}
            mode="date"
            onChange={handleDateChange}
          />

          <Text style={styles.label}>Symptom:</Text>
          <RNPickerSelect
            onValueChange={handleSymptomChange}
            items={symptoms.map((symptom) => ({ label: symptom.name, value: symptom.name }))}
            placeholder={{ label: 'Select a symptom', value: null }}
            style={pickerSelectStyles}
          />

          {selectedSymptomType && (
            <>
              <Text style={styles.label}>Value:</Text>
              {selectedSymptomType === 'Daily Scale' && (
                <RNPickerSelect
                  onValueChange={(value) => setSelectedValue(value)}
                  items={Array.from({ length: 10 }, (_, i) => ({
                    label: `${i + 1}`,
                    value: i + 1,
                  }))}
                  placeholder={{ label: 'Select a value', value: null }}
                  style={pickerSelectStyles}
                />
              )}

              {selectedSymptomType === 'Severity' && (
                <View style={styles.severityScale}>
                  {['Mild', 'Moderate', 'Severe'].map((level) => (
                    <Button
                      key={level}
                      mode={selectedValue === level ? 'contained' : 'outlined'}
                      onPress={() => setSelectedValue(level)}
                      style={styles.severityButton}
                    >
                      {level}
                    </Button>
                  ))}
                </View>
              )}

              {selectedSymptomType === 'Daily Count' && (
                <TextInput
                  label="Enter a number"
                  mode="outlined"
                  value={selectedValue}
                  onChangeText={(text) => setSelectedValue(text)}
                  keyboardType="numeric"
                  style={styles.input}
                />
              )}
            </>
          )}

          <Button mode="contained" onPress={handleSubmit} style={styles.button} disabled={isSaving}>
            Submit
          </Button>
        </Card.Content>
      </Card>

      {isSaving && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator animating={true} size="large" color="#fff" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F4F5F7',
    position: 'relative',
  },
  card: {
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2E3A59',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#2E3A59',
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007BFF',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  severityScale: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  severityButton: {
    marginHorizontal: 5,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 8,
    backgroundColor: '#fff',
    color: '#2E3A59',
    marginBottom: 15,
  },
  inputAndroid: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 8,
    backgroundColor: '#fff',
    color: '#2E3A59',
    marginBottom: 15,
  },
};
