import React, { useState } from 'react';
import { View, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { TextInput, Button, Text, Card, Menu, Divider, Provider, DefaultTheme } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { fb_db, fb_auth } from '../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { useQueryClient } from '@tanstack/react-query';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007BFF', 
    accent: '#007BFF',  
  },
};

export default function AddMedicationScreen() {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [unit, setUnit] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [IntakeInst, setIntakeInst] = useState('');
  const [IntakeTime, setIntakeTime] = useState('');
  const [menuVisible, setMenuVisible] = useState(false); 
  const [timeMenuVisible, setTimeMenuVisible] = useState(false); 
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleSave = async () => {
    if (!name || !dosage || !frequency || !unit || !date || !IntakeInst || !IntakeTime) {
      Alert.alert('Please fill out all fields!');
      return;
    }

    try {
      const user = fb_auth.currentUser;
      if (!user) {
        Alert.alert('You must be logged in to add a medication!');
        return;
      }

      const newMedication = {
        name,
        dosage,
        unit,
        date: date.toISOString(),
        frequency,
        userId: user.uid,
        IntakeInst,
        IntakeTime,
      };

      const medicationsRef = collection(fb_db, 'Medications');
      await addDoc(medicationsRef, newMedication);

      Alert.alert('Medication added successfully!');
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      router.back();
    } catch (error) {
      console.error('Error adding medication:', error);
      Alert.alert('An error occurred while adding the medication. Please try again.');
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <Provider theme={theme}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="headlineMedium" style={styles.title}>
                Add New Medication
              </Text>

              <TextInput
                label="Name"
                value={name}
                onChangeText={(text) => setName(text)}
                mode="outlined"
                style={styles.input}
                placeholder="Enter medication name"
              />

              <Button
                mode="outlined"
                onPress={() => setShowPicker(true)}
                style={styles.input}
              >
                {date.toDateString()}
              </Button>
              {showPicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}

              <TextInput
                label="Dosage"
                value={dosage}
                onChangeText={(text) => setDosage(text)}
                mode="outlined"
                style={styles.input}
                placeholder="Enter dosage (e.g., 500)"
                keyboardType="numeric"
              />

              <TextInput
                label="Unit"
                value={unit}
                onChangeText={(text) => setUnit(text)}
                mode="outlined"
                style={styles.input}
                placeholder="Enter unit (e.g., mg, ml)"
              />

              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setMenuVisible(true)}
                    style={styles.input}
                  >
                    {IntakeInst || 'Select instructions'}
                  </Button>
                }
              >
                <Menu.Item
                  onPress={() => {
                    setIntakeInst('After meal');
                    setMenuVisible(false);
                  }}
                  title="After meal"
                />
                <Divider />
                <Menu.Item
                  onPress={() => {
                    setIntakeInst('Before meal');
                    setMenuVisible(false);
                  }}
                  title="Before meal"
                />
                <Divider />
                <Menu.Item
                  onPress={() => {
                    setIntakeInst('During meal');
                    setMenuVisible(false);
                  }}
                  title="During meal"
                />
              </Menu>

              <Menu
                visible={timeMenuVisible}
                onDismiss={() => setTimeMenuVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setTimeMenuVisible(true)}
                    style={styles.input}
                  >
                    {IntakeTime || 'Select intake time'}
                  </Button>
                }
              >
                <Menu.Item
                  onPress={() => {
                    setIntakeTime('Morning');
                    setTimeMenuVisible(false);
                  }}
                  title="Morning"
                />
                <Divider />
                <Menu.Item
                  onPress={() => {
                    setIntakeTime('Afternoon');
                    setTimeMenuVisible(false);
                  }}
                  title="Afternoon"
                />
                <Divider />
                <Menu.Item
                  onPress={() => {
                    setIntakeTime('Evening');
                    setTimeMenuVisible(false);
                  }}
                  title="Evening"
                />
              </Menu>

              <TextInput
                label="Frequency (days)"
                value={frequency}
                onChangeText={(text) => setFrequency(text)}
                mode="outlined"
                style={styles.input}
                placeholder="Enter frequency (e.g., 7)"
                keyboardType="numeric"
              />

              <Button
                mode="contained"
                onPress={handleSave}
                style={styles.button}
                labelStyle={styles.buttonLabel}
              >
                Save Medication
              </Button>
            </Card.Content>
          </Card>
        </View>
      </TouchableWithoutFeedback>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    padding: 16,
    borderRadius: 8,
    elevation: 4,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    color: '#007BFF', 
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#007BFF', 
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 16,
  },
});