import React, { useState } from 'react';
import { Box, Input, Button, Text, Select, SelectTrigger, SelectContent, SelectItem, SelectInput, SelectPortal, SelectBackdrop, SelectDragIndicatorWrapper, SelectDragIndicator, InputField } from '@gluestack-ui/themed';
import { collection, addDoc } from 'firebase/firestore';
import { fb_db, fb_auth } from '../firebaseConfig'; 
import { useRouter } from 'expo-router';

export default function AddSymptomScreen() {
  const [name, setName] = useState('');
  const [type, setType] = useState(''); 
  const router = useRouter();

  const handleSave = async () => {
    if (!name || !type) {
      alert('Please fill out all fields!');
      return;
    }

    try {
      const user = fb_auth.currentUser; 
      if (!user) {
        alert('You must be logged in to add a symptom!');
        return;
      }

      const newSymptom = {
        name,
        type,
        userId: user.uid, 
      };

      const symptomsRef = collection(fb_db, 'Symptoms'); 
      await addDoc(symptomsRef, newSymptom);

      alert('Symptom added successfully!');
      router.back(); 
    } catch (error) {
      console.error('Error adding symptom:', error);
      alert('An error occurred while adding the symptom. Please try again.');
    }
  };

  return (
    <Box flex={1} bg="$gray100" px={5} py={10} justifyContent="center">
      <Text size="3xl" fontWeight="bold" mb={8} textAlign="center" color="$primary">
        Add a New Symptom
      </Text>
      <Box mb={5}>
        <Text size="lg" fontWeight="semibold" mb={2} color="$gray700">
          Symptom Name
        </Text>
        <Input size="lg" variant="outline" isInvalid={false} isDisabled={false}>
          <InputField
            onChange={(e: any) => setName(e.nativeEvent.text)}
            value={name}
            placeholder="Enter symptom name"
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: 10,
              fontSize: 16,
            }}
          />
        </Input>
      </Box>

      <Box mb={8}>
        <Text size="lg" fontWeight="semibold" mb={2} color="$gray700">
          Symptom Type
        </Text>
        <Select
          isInvalid={false}
          isDisabled={false}
          onValueChange={(value) => setType(value)}
        >
          <SelectTrigger>
            <SelectInput placeholder="Select type" />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              <SelectItem label="Severity e.g., Low, Medium, High" value="Severity" />
              <SelectItem label="Daily Scale e.g., 1-10" value="Daily Scale" />
              <SelectItem label="Daily Count e.g., 3" value="Daily Count" />
            </SelectContent>
          </SelectPortal>
        </Select>
      </Box>

      <Box alignItems="center">
        <Button
          bg="$primary"
          borderRadius="full"
          paddingX={6}
          paddingY={4}
          onPress={handleSave}
          shadow="md"
        >
          <Text color="$white" fontWeight="semibold" size="lg">
            Save Symptom
          </Text>
        </Button>
      </Box>
    </Box>
  );
}
