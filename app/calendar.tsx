import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useRouter } from 'expo-router';

export default function CalendarScreen() {
  const [currentDate, setCurrentDate] = useState('');
  const router = useRouter();

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    setCurrentDate(formattedDate);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>Current Date: {currentDate}</Text>
      <Calendar
        current={currentDate}
        onDayPress={(day) => {
          router.push({
            pathname: '/(tabs)',
            params: { selectedDate: day.dateString },
          });
        }}
        theme={{
          selectedDayBackgroundColor: '#e08fff',
          selectedDayTextColor: 'white',
          todayTextColor: '#e08fff',
          arrowColor: '#e08fff',
          monthTextColor: '#e08fff',
        }}
        style={styles.calendar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'flex-start', 
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20, 
  },
  calendar: {
    flex: 1,
    width: '90%', 
  },
});
