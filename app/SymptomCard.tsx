import React from 'react';
import { Card, Button, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';

const SymptomCard = ({ item, onDelete }) => {
  const renderDailyScale = (value) => {
    const max = 10;
    return (
      <View style={styles.scaleContainer}>
        {Array.from({ length: max }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.scaleDot,
              index < value ? styles.filledDot : styles.emptyDot,
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleLarge" style={styles.title}>
          {item.symptom}
        </Text>
        <Text variant="bodyMedium" style={styles.value}>
          Value: {item.value}
        </Text>
        {item.type === 'Severity' && renderDailyScale(parseInt(item.value, 10))}
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => onDelete(item.id)} icon="delete">
          Delete
        </Button>
      </Card.Actions>
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
  scaleContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  scaleDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  filledDot: {
    backgroundColor: '#007BFF',
  },
  emptyDot: {
    backgroundColor: '#D0D3D4',
  },
});

export default SymptomCard;