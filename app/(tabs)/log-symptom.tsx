import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fb_db, fb_auth } from '../../firebaseConfig';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';

export default function LogSymptomScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [selectedSymptomType, setSelectedSymptomType] = useState(null);
  const [selectedValue, setSelectedValue] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
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
      alert('Please fill out all fields!');
      return;
    }

    try {
      const user = fb_auth.currentUser;
      if (!user) {
        alert('You must be logged in to log a symptom!');
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

      alert('Symptom logged successfully!');
    } catch (error) {
      console.error('Error logging symptom:', error);
      alert('An error occurred while logging the symptom. Please try again.');
    }
  };
  return (
    <View style={styles.container}>
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
        items={symptoms.map((symptom) => ({ label: symptom.name, value: symptom.name}))}
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
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.severityButton,
                    selectedValue === level && styles.selectedSeverityButton,
                  ]}
                  onPress={() => setSelectedValue(level)}
                >
                  <Text
                    style={[
                      styles.severityButtonText,
                      selectedValue === level && styles.selectedSeverityButtonText,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {selectedSymptomType === 'Daily Count' && (
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="Enter a number"
              value={selectedValue}
              onChangeText={(text) => setSelectedValue(text)}
            />
          )}
        </>
      )}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F4F5F7',
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
  severityScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  severityButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    backgroundColor: '#E8E8E8',
    borderRadius: 5,
    alignItems: 'center',
  },
  selectedSeverityButton: {
    backgroundColor: '#838383',
  },
  severityButtonText: {
    color: '#2E3A59',
    fontSize: 14,
  },
  selectedSeverityButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
