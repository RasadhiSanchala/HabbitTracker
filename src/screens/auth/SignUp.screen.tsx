import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { storeUser, getUser } from '../../utils/Authstorage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;

function SignUp() {
  const navigation = useNavigation<SignUpScreenNavigationProp>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!name || !email || !gender || !age || !password) {
      Alert.alert('All fields are required!');
      return;
    }

    const user = { name, email, gender, age, password };

    try {
      await storeUser(user);

      const savedUser = await getUser();
      console.log('User saved in AsyncStorage:', savedUser);

      if (savedUser) {
        Alert.alert('Signup Successful!');
        navigation.navigate('SignIn');
      } else {
        Alert.alert('Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup Error:', error);
      Alert.alert('An error occurred during signup.', `${error}`);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.box}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Please fill in the details below</Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={setName}
          placeholder="Enter your full name"
          placeholderTextColor="#999"
          autoCapitalize="words"
          textContentType="name"
        />

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

        <Text style={styles.label}>Gender</Text>
        <TextInput
          style={styles.input}
          onChangeText={setGender}
          placeholder="Enter your gender"
          placeholderTextColor="#999"
          autoCapitalize="words"
        />

        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          onChangeText={setAge}
          keyboardType="numeric"
          placeholder="Enter your age"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          onChangeText={setPassword}
          placeholder="Create a password"
          placeholderTextColor="#999"
          autoCapitalize="none"
          textContentType="password"
        />

        <View style={styles.buttonContainer}>
          <Button title="Sign Up" onPress={handleSignUp} color="#6F2E0E" />
        </View>
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
  },
});

export default SignUp;
