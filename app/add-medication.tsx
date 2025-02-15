import React, { useState } from 'react';
import { Box, Button, Input, InputField, Text } from '@gluestack-ui/themed';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { fb_db, fb_auth } from '../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { useQueryClient } from '@tanstack/react-query';
import {  Select, SelectTrigger, SelectContent, SelectItem, SelectInput, SelectPortal, SelectBackdrop, SelectDragIndicatorWrapper, SelectDragIndicator } from '@gluestack-ui/themed';

export default function AddMedicationScreen() {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [unit, setUnit] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const queryClient = useQueryClient();
  const [IntakeInst, setIntakeInst] = useState('');
  const [IntakeTime, setIntakeTime] = useState('');

  const router = useRouter();

  const handleSave = async () => {
    if (!name || !dosage || !frequency || !unit || !date || !IntakeInst || !IntakeTime)  {
      alert('Please fill out all fields!');
      return;
    }

    try {
      const user = fb_auth.currentUser;
      if (!user) {
        alert('You must be logged in to add a medication!');
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
        IntakeTime
      };

      const medicationsRef = collection(fb_db, 'Medications');
      await addDoc(medicationsRef, newMedication);

      alert('Medication added successfully!');
      queryClient.invalidateQueries({queryKey: ["medications"]});
      router.back();
    } catch (error) {
      console.error('Error adding medication:', error);
      alert('An error occurred while adding the medication. Please try again.');
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <Box flex={1} bg="$gray100" px={6} py={8} justifyContent="flex-start">
  
      <Text size="3xl" fontWeight="bold" mb={6} textAlign="center" color="$primary">
        Add New Medication
      </Text>

      <Box mb={5}>
        <Text size="lg" fontWeight="semibold" mb={2} color="$gray700">
          Name
        </Text>
        <Input size="lg" variant="outline">
          <InputField
            onChange={(e: any) => setName(e.nativeEvent.text)}
            value={name}
            placeholder="Enter medication name"
          />
        </Input>
      </Box>

      <Box mb={5}>
        <Text size="lg" fontWeight="semibold" mb={2} color="$gray700">
          Start Date
        </Text>
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      </Box>

      <Box mb={5}>
        <Text size="lg" fontWeight="semibold" mb={2} color="$gray700">
          Dosage
        </Text>
        <Input size="lg" variant="outline">
          <InputField
            onChange={(e: any) => setDosage(e.nativeEvent.text)}
            value={dosage}
            placeholder="Enter dosage (e.g., 500)"
          />
        </Input>
      </Box>

      <Box mb={5}>
        <Text size="lg" fontWeight="semibold" mb={2} color="$gray700">
          Unit
        </Text>
        <Input size="lg" variant="outline">
          <InputField
            onChange={(e: any) => setUnit(e.nativeEvent.text)}
            value={unit}
            placeholder="Enter unit (e.g., mg, ml)"
          />
        </Input>
      </Box>

      <Box mb={8}>
        <Text size="lg" fontWeight="semibold" mb={2} color="$gray700">
          Frequency (days)
        </Text>
        <Input size="lg" variant="outline">
          <InputField
            onChange={(e: any) => setFrequency(e.nativeEvent.text)}
            value={frequency}
            placeholder="Enter frequency (e.g., 7)"
          />
        </Input>
      </Box>

      
    
      <Box mb={8}>
              <Text size="lg" fontWeight="semibold" mb={2} color="$gray700">
                Instructions for use
              </Text>
              <Select
                isInvalid={false}
                isDisabled={false}
                onValueChange={(value) => setIntakeInst(value)}
              >
                <SelectTrigger>
                  <SelectInput placeholder="Select instructions" />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectItem label="After meal" value="After meal" />
                    <SelectItem label="Before meal" value="Before meal" />
                    <SelectItem label="During meal" value="During meal" />
                  </SelectContent>
                </SelectPortal>
              </Select>
            </Box>

            <Box mb={8}>
              <Text size="lg" fontWeight="semibold" mb={2} color="$gray700">
                Intake time
              </Text>
              <Select
                isInvalid={false}
                isDisabled={false}
                onValueChange={(value) => setIntakeTime(value)}
              >
                <SelectTrigger>
                  <SelectInput placeholder="Select intake time" />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectItem label="Morning" value="Morning" />
                    <SelectItem label="Afternoon" value="Afternoon" />
                    <SelectItem label="Evening" value="Evening" />
                  </SelectContent>
                </SelectPortal>
              </Select>
            </Box>

      <Box alignItems="center">
        <Button
          bg="$blue600"
          paddingX={6}
          paddingY={4}
          borderRadius="full"
          shadow="md"
          onPress={handleSave}
        >
          <Text color="$white" fontWeight="semibold" size="lg">
            Save Medication
          </Text>
        </Button>
      </Box>
    </Box>
  );
}
