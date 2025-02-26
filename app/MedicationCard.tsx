import React from 'react';
import { Card, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const MedicationCard = ({ item }) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleLarge" style={styles.title}>
          {item.name}
        </Text>
        <Text variant="bodyMedium" style={styles.value}>
          Dosage: {item.dosage} {item.unit}
        </Text>
        {item.IntakeInst && (
          <Text variant="bodyMedium" style={styles.value}>
            Instructions: {item.IntakeInst}
          </Text>
        )}
        {item.IntakeTime && (
          <Text variant="bodyMedium" style={styles.value}>
            Intake Time: {item.IntakeTime}
          </Text>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  value: {
    marginBottom: 4,
  },
});

export default MedicationCard;