import React, { useState, useEffect } from 'react';
import { ScrollView, Text, Dimensions, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { fb_db, fb_auth } from '../../firebaseConfig'; 

const useSymptomsData = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [logs, setLogs] = useState([]);
  const userId = fb_auth.currentUser?.uid; 

  useEffect(() => {
    if (!userId) return;

    const fetchSymptoms = async () => {
      const symptomSnapshot = await fb_db
        .collection('Symptoms')
        .where('userId', '==', userId)
        .get();
      setSymptoms(symptomSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    const fetchLogs = async () => {
      const logSnapshot = await fb_db
        .collection('Log')
        .where('userId', '==', userId)
        .get();
      setLogs(logSnapshot.docs.map(doc => doc.data()));
    };

    fetchSymptoms();
    fetchLogs();
  }, [userId]);

  return { symptoms, logs };
};

const SymptomChart = ({ symptom, logs }) => {
  const symptomLogs = logs.filter(log => log.symptom === symptom.name);

  if (symptomLogs.length === 0) {
    return null;
  }

  const dates = symptomLogs.map(log => log.date.split('-').slice(1).join('/')); 
  const values = symptomLogs.map(log =>
    symptom.type === 'Severity'
      ? ['Low', 'Moderate', 'High'].indexOf(log.value) + 1
      : parseInt(log.value, 10)
  );

  return (
    <LineChart
      data={{
        labels: dates,
        datasets: [{ data: values }],
      }}
      width={Dimensions.get('window').width - 20}
      height={220}
      yAxisLabel={symptom.type === 'DailyScale' ? '' : undefined}
      chartConfig={{
        backgroundColor: '#e26a00',
        backgroundGradientFrom: '#fb8c00',
        backgroundGradientTo: '#ffa726',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      }}
      style={{
        marginVertical: 10,
        borderRadius: 16,
      }}
    />
  );
};

const SymptomCharts = () => {
  const { symptoms, logs } = useSymptomsData();

  if (!symptoms || symptoms.length === 0) {
    return <Text style={{ textAlign: 'center', marginTop: 20 }}>No symptoms found. Add some to get started!</Text>;
  }

  return (
    <ScrollView style={{ padding: 10 }}>
      {symptoms.map(symptom => (
        <View key={symptom.id} style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>{symptom.name}</Text>
          <SymptomChart symptom={symptom} logs={logs} />
        </View>
      ))}
    </ScrollView>
  );
};

const App = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 }}>
        Symptom Tracker
      </Text>
      <SymptomCharts />
    </View>
  );
};

export default App;
