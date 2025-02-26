import React, { useState, useEffect } from 'react';
import { ScrollView, Text, Dimensions, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { fb_db, fb_auth } from '../../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const useSymptomsData = (range, setLoading) => {
  const [symptoms, setSymptoms] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        setLoading(true);
        const user = fb_auth.currentUser;
        if (!user) return;

        const symptomsRef = collection(fb_db, 'Symptoms');
        const q = query(symptomsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        const symptomsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSymptoms(symptomsData);
      } catch (error) {
        console.error('Error fetching symptoms:', error);
      }
    };

    const fetchLogs = async () => {
      try {
        const user = fb_auth.currentUser;
        if (!user) return;

        const logsRef = collection(fb_db, 'Log');
        const q = query(logsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        let logsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        logsData = filterLogsByRange(logsData, range);
        setLogs(logsData);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSymptoms();
    fetchLogs();
  }, [range]);

  return { symptoms, logs };
};

const filterLogsByRange = (logs, range) => {
  const now = new Date();
  let startDate = new Date(now);

  if (range === 'week') {
    startDate.setDate(now.getDate());
  } else if (range === 'month') {
    startDate.setMonth(now.getMonth() - 2);
  } else if (range === '3months') {
    startDate.setMonth(now.getMonth() - 3);
  }

  return logs.filter((log) => new Date(log.date) >= startDate);
};

const SymptomChart = ({ symptom, logs }) => {
  const symptomLogs = logs.filter((log) => log.symptom === symptom.name);

  if (symptomLogs.length === 0) {
    return null; 
  }

  const aggregatedData = symptomLogs.reduce((acc, log) => {
    const formattedDate = log.date;
    const value =
      symptom.type === 'Severity'
        ? ['Mild', 'Moderate', 'Severe'].indexOf(log.value) // Map severity to 0, 1, 2
        : parseFloat(log.value);

    if (acc[formattedDate]) {
      acc[formattedDate].push(value);
    } else {
      acc[formattedDate] = [value];
    }
    return acc;
  }, {});

  const sortedDates = Object.keys(aggregatedData).sort((a, b) => new Date(a) - new Date(b));
  const dates = sortedDates.map((date) => date.split('-').slice(1).join('/'));
  const values = sortedDates.map((date) => {
    const dateValues = aggregatedData[date];
    return dateValues.reduce((sum, val) => sum + val, 0) / dateValues.length;


    
  });

  const isSeverityType = symptom.type === 'Severity';
  const yAxisLabels = isSeverityType ? ['Low', 'Medium', 'High'] : null;

  return (
    <LineChart
      data={{
        labels: dates,
        datasets: [{ data: values }],
      }}
      width={Dimensions.get('window').width - 20}
      height={220}
      yAxisLabel={''}
      yAxisSuffix={''}
      //yAxisInterval={1}
      fromZero={true}
      chartConfig={{
        backgroundColor: '#007BFF',
        backgroundGradientFrom: '#0056b3',
        backgroundGradientTo: '#007BFF',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        propsForDots: {
          r: '6',
          strokeWidth: '2',
          stroke: '#ffffff',
        },
      }}
      style={{
        marginVertical: 10,
        borderRadius: 16,
      }}
    />
  );
};

const SymptomCharts = () => {
  const [range, setRange] = useState('week');
  const [loading, setLoading] = useState(false);
  const { symptoms, logs } = useSymptomsData(range, setLoading);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginBottom: 20 }}>
        <TouchableOpacity
          onPress={() => setRange('week')}
          style={[styles.filterButton, range === 'week' && styles.activeFilter]}
        >
          <Text style={range === 'week' ? styles.activeFilterText : styles.filterText}>Last Week</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setRange('month')}
          style={[styles.filterButton, range === 'month' && styles.activeFilter]}
        >
          <Text style={range === 'month' ? styles.activeFilterText : styles.filterText}>Last Month</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setRange('3months')}
          style={[styles.filterButton, range === '3months' && styles.activeFilter]}
        >
          <Text style={range === '3months' ? styles.activeFilterText : styles.filterText}>Last 3 Months</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text>Loading charts...</Text>
        </View>
      ) : (
        <ScrollView>
          {symptoms
            .filter((symptom) => logs.some((log) => log.symptom === symptom.name))
            .map((symptom) => (
              <View key={symptom.id} style={{ marginBottom: 20 }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>{symptom.name}</Text>
                <SymptomChart symptom={symptom} logs={logs} />
              </View>
            ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = {
  filterButton: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  activeFilter: {
    backgroundColor: '#007BFF',
  },
  filterText: {
    color: '#000',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
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