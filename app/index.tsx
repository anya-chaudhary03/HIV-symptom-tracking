import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { fb_auth } from '../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const router = useRouter(); 

  const handleAuth = () => {
    if (isSignup) {
      createUserWithEmailAndPassword(fb_auth, email, password)
        .then(() => {
          Alert.alert('Success', 'Account created successfully!');
          router.push('(tabs)'); 
        })
        .catch((error) => Alert.alert('Error', error.message));
    } else {
      signInWithEmailAndPassword(fb_auth, email, password)
        .then(() => {
          router.push('(tabs)'); 
        })
        .catch((error) => Alert.alert('Error', error.message));
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>{isSignup ? 'Sign Up' : 'Login'}</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleAuth}>
          <Text style={styles.buttonText}>{isSignup ? 'Sign Up' : 'Login'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
          <Text style={styles.toggleText}>
            {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    height: 50,
    backgroundColor: '#3b83db',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  toggleText: {
    textAlign: 'center',
    color: '#007BFF',
    marginTop: 10,
  },
});

export default LoginScreen;