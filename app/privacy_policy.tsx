import React from 'react';
import { ScrollView, StyleSheet, Text, Linking } from 'react-native';
import { Card } from 'react-native-paper';

const PrivacyNotice = () => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:2649173c@student.gla.ac.uk');
  };

  const handleICOLinkPress = () => {
    Linking.openURL('https://www.ico.org.uk/make-a-complaint');
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Privacy Notice</Text>
          <Text style={styles.sectionTitle}>Contact Details</Text>
          <Text style={styles.text}>
            Email:{' '}
            <Text style={styles.link} onPress={handleEmailPress}>
              2649173c@student.gla.ac.uk
            </Text>
          </Text>

          <Text style={styles.sectionTitle}>What Information We Collect, Use, and Why</Text>
          <Text style={styles.text}>
            We collect or use the following personal information for patient app or portal functionality:
          </Text>
          <Text style={styles.bullet}>• Medical history</Text>
          <Text style={styles.bullet}>• Account information, including registration details</Text>
          <Text style={styles.bullet}>• Health information</Text>

          <Text style={styles.sectionTitle}>Lawful Bases and Data Protection Rights</Text>
          <Text style={styles.text}>
            Under UK data protection law, we must have a “lawful basis” for collecting and using your personal information. There is a list of possible lawful bases in the UK GDPR. You can find out more about lawful bases on the ICO’s website.
          </Text>
          <Text style={styles.text}>
            Which lawful basis we rely on may affect your data protection rights, which are in brief set out below. You can find out more about your data protection rights and the exemptions which may apply on the ICO’s website:
          </Text>
          <Text style={styles.bullet}>• Your right of access</Text>
          <Text style={styles.bullet}>• Your right to rectification</Text>
          <Text style={styles.bullet}>• Your right to erasure</Text>
          <Text style={styles.bullet}>• Your right to restriction of processing</Text>
          <Text style={styles.bullet}>• Your right to object to processing</Text>
          <Text style={styles.bullet}>• Your right to data portability</Text>
          <Text style={styles.bullet}>• Your right to withdraw consent</Text>
          <Text style={styles.text}>
            If you make a request, we must respond to you without undue delay and in any event within one month.
          </Text>
          <Text style={styles.text}>
            To make a data protection rights request, please contact us using the contact details at the top of this privacy notice.
          </Text>

          <Text style={styles.sectionTitle}>Our Lawful Bases for the Collection and Use of Your Data</Text>
          <Text style={styles.text}>
            Our lawful bases for collecting or using personal information for patient app or portal functionality are:
          </Text>
          <Text style={styles.bullet}>• Consent - we have permission from you after we gave you all the relevant information. All of your data protection rights may apply, except the right to object. To be clear, you do have the right to withdraw your consent at any time.</Text>

          <Text style={styles.sectionTitle}>Where We Get Personal Information From</Text>
          <Text style={styles.bullet}>• Directly from you</Text>

          <Text style={styles.sectionTitle}>How Long We Keep Information</Text>
          <Text style={styles.text}>
            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Statement, unless a longer retention period is required or permitted by law. If you delete your account, we will remove your account information within 1 day unless we are required to retain it for legal or regulatory purposes.
          </Text>

          <Text style={styles.sectionTitle}>Duty of Confidentiality</Text>
          <Text style={styles.text}>
            We are subject to a common law duty of confidentiality. However, there are circumstances where we will share relevant health and care information. These are where:
          </Text>
          <Text style={styles.bullet}>• You’ve provided us with your consent (we have taken it as implied to provide you with care, or you have given it explicitly for other uses);</Text>
          <Text style={styles.bullet}>• We have a legal requirement (including court orders) to collect, share or use the data;</Text>
          <Text style={styles.bullet}>• On a case-by-case basis, the public interest to collect, share and use the data overrides the public interest served by protecting the duty of confidentiality (for example sharing information with the police to support the detection or prevention of serious crime);</Text>
          <Text style={styles.bullet}>• If in England or Wales – the requirements of The Health Service (Control of Patient Information) Regulations 2002 are satisfied; or</Text>
          <Text style={styles.bullet}>• If in Scotland – we have the authority to share provided by the Chief Medical Officer for Scotland, the Chief Executive of NHS Scotland, the Public Benefit and Privacy Panel for Health and Social Care or other similar governance and scrutiny process.</Text>

          <Text style={styles.sectionTitle}>How to Complain</Text>
          <Text style={styles.text}>
            If you have any concerns about our use of your personal data, you can make a complaint to us using the contact details at the top of this privacy notice.
          </Text>
          <Text style={styles.text}>
            If you remain unhappy with how we’ve used your data after raising a complaint with us, you can also complain to the ICO.
          </Text>
          <Text style={styles.text}>
            The ICO’s address:
          </Text>
          <Text style={styles.text}>
            Information Commissioner’s Office{'\n'}
            Wycliffe House{'\n'}
            Water Lane{'\n'}
            Wilmslow{'\n'}
            Cheshire{'\n'}
            SK9 5AF{'\n'}
            Helpline number: 0303 123 1113{'\n'}
            Website:{' '}
            <Text style={styles.link} onPress={handleICOLinkPress}>
              https://www.ico.org.uk/make-a-complaint
            </Text>
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  bullet: {
    fontSize: 14,
    marginLeft: 16,
    marginBottom: 4,
  },
  link: {
    color: '#1e90ff',
    textDecorationLine: 'underline',
  },
});

export default PrivacyNotice;