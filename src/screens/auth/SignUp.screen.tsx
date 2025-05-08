import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { storeUser, getUser } from '../../utils/storage';
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
    <View style={{ padding: 20 }}>
      <Text>Name:</Text>
      <TextInput style={{ borderWidth: 1, marginBottom: 10 }} onChangeText={setName} />

      <Text>Email:</Text>
      <TextInput style={{ borderWidth: 1, marginBottom: 10 }} onChangeText={setEmail} keyboardType="email-address" />

      <Text>Gender:</Text>
      <TextInput style={{ borderWidth: 1, marginBottom: 10 }} onChangeText={setGender} />

      <Text>Age:</Text>
      <TextInput style={{ borderWidth: 1, marginBottom: 10 }} onChangeText={setAge} keyboardType="numeric" />

      <Text>Password:</Text>
      <TextInput style={{ borderWidth: 1, marginBottom: 10 }} secureTextEntry onChangeText={setPassword} />

      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
}

export default SignUp;
