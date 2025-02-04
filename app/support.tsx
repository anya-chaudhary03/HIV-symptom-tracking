import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';

export default function SupportPage() {
  const openLink = (url) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't open link", err));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Support</Text>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Helpful Articles</Text>

        <TouchableOpacity onPress={() => openLink('https://positivelyuk.org/')}>
          <Text style={styles.linkText}>Support with diagnosis, care, and life with HIV - Positively UK</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openLink('https://www.nhs.uk/conditions/hiv-and-aids/living-with/')}>
          <Text style={styles.linkText}>NHS: Living with HIV and AIDS</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openLink('https://www.aetna.com/health-guide/chronic-disease-management-tips.html')}>
          <Text style={styles.linkText}>5 Steps to Living Well with a Chronic Illness</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Find a Clinic</Text>

        <TouchableOpacity onPress={() => openLink('https://www.nhs.uk/service-search/sexual-health-services/find-hiv-treatment/')}>
          <Text style={styles.linkText}>Find an HIV Clinic (England) - NHS</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openLink('https://www.aidsmap.com/uk-service-finder')}>
          <Text style={styles.linkText}>Find an HIV Clinic (UK) - Aidsmap</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F5F7',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2E3A59',
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  linkText: {
    fontSize: 16,
    color: '#007BFF',
    marginBottom: 8,
    textDecorationLine: 'underline',
  },
});
