import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { validateUser } from '../../utils/Authstorage';

type SignInScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

function SignIn() {
  const navigation = useNavigation<SignInScreenNavigationProp>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Both email and password are required!');
      return;
    }

    const isValid = await validateUser(email, password);

    if (isValid) {
      Alert.alert('Login successful!');
      navigation.navigate('Dashboard'); 
    } else {
      Alert.alert('Invalid email or password.');
    }
  };

  const goToSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.box}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="Enter your email"
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          onChangeText={setPassword}
          placeholder="Enter your password"
          placeholderTextColor="#999"
          autoCapitalize="none"
          textContentType="password"
        />

        <View style={styles.buttonContainer}>
          <Button title="Sign In" onPress={handleSignIn} color="#6F2E0E" />
        </View>

        <TouchableOpacity onPress={goToSignUp} style={styles.signUpLink}>
          <Text style={styles.signUpText}>
            Not registered? <Text style={styles.signUpTextHighlight}>Sign up here</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6E8DC',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 25,
    shadowColor: '#6F2E0E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#6F2E0E',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6F2E0E',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  label: {
    fontWeight: '600',
    color: '#6F2E0E',
    marginBottom: 6,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#6F2E0E',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 18,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 15,
  },
  signUpLink: {
    alignItems: 'center',
  },
  signUpText: {
    color: '#6F2E0E',
    fontSize: 14,
  },
  signUpTextHighlight: {
    color: '#A75423',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});

export default SignIn;
