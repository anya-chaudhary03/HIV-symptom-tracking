import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.dateText}>Current Date: {currentDate}</Text>
        <View style={styles.calendarContainer}>
          <Calendar
            current={currentDate}
            onDayPress={(day) => {
              router.push({
                pathname: '/(tabs)',
                params: { selectedDate: day.dateString },
              });
            }}
            theme={{
              selectedDayBackgroundColor: '#2200cf',
              selectedDayTextColor: 'white',
              todayTextColor: '#007BFF',
              arrowColor: '#007BFF',
              monthTextColor: '#007BFF',
            }}
            style={styles.calendar}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  calendarContainer: {
    width: width * 0.6, 
    transform: [{ scale: 1.5 }], 
  },
  calendar: {
    width: '100%', 
  },
});