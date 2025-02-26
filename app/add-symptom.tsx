import React, { useState } from 'react';
import { View, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { TextInput, Button, Text, Card, Menu, Divider, Provider, DefaultTheme } from 'react-native-paper';
import { collection, addDoc } from 'firebase/firestore';
import { fb_db, fb_auth } from '../firebaseConfig';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007BFF', 
    accent: '#007BFF',  
  },
};

export default function AddSymptomScreen() {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [visible, setVisible] = useState(false); 
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSave = async () => {
    if (!name || !type) {
      Alert.alert('Please fill out all fields!');
      return;
    }

    try {
      const user = fb_auth.currentUser;
      if (!user) {
        Alert.alert('You must be logged in to add a symptom!');
        return;
      }

      const newSymptom = {
        name,
        type,
        userId: user.uid,
      };

      const symptomsRef = collection(fb_db, 'Symptoms');
      await addDoc(symptomsRef, newSymptom);

      Alert.alert('Success', 'Symptom added successfully!');
      queryClient.invalidateQueries({ queryKey: ['stored_symptoms'] });
      router.back();
    } catch (error) {
      console.error('Error', 'Error adding symptom:', error);
      Alert.alert('Error', 'An error occurred while adding the symptom. Please try again.');
    }
  };

  return (
    <Provider theme={theme}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="headlineMedium" style={styles.title}>
                Add a New Symptom
              </Text>

              <TextInput
                label="Symptom Name"
                value={name}
                onChangeText={(text) => setName(text)}
                mode="outlined"
                style={styles.input}
                placeholder="Enter symptom name"
              />

              <Menu
                visible={visible}
                onDismiss={() => setVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setVisible(true)}
                    style={styles.dropdownButton}
                  >
                    {type || 'Select Symptom Type'}
                  </Button>
                }
              >
                <Menu.Item
                  onPress={() => {
                    setType('Severity');
                    setVisible(false);
                  }}
                  title="Severity e.g., Low, Medium, High"
                />
                <Divider />
                <Menu.Item
                  onPress={() => {
                    setType('Daily Scale');
                    setVisible(false);
                  }}
                  title="Daily Scale e.g., 1-10"
                />
                <Divider />
                <Menu.Item
                  onPress={() => {
                    setType('Daily Count');
                    setVisible(false);
                  }}
                  title="Daily Count e.g., 3"
                />
              </Menu>

              <Button
                mode="contained"
                onPress={handleSave}
                style={styles.button}
                labelStyle={styles.buttonLabel}
              >
                Save Symptom
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
  dropdownButton: {
    marginBottom: 16,
    justifyContent: 'flex-start',
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