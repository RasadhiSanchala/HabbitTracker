import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { validateUser } from '../../utils/auth/storage';

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
      navigation.navigate('Home'); 
    } else {
      Alert.alert('Invalid email or password.');
    }
  };

  const goToSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email:</Text>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10 }}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text>Password:</Text>
      <TextInput
        style={{ borderWidth: 1, marginBottom: 10 }}
        secureTextEntry
        onChangeText={setPassword}
      />

      <Button title="Sign In" onPress={handleSignIn} />

      <TouchableOpacity onPress={goToSignUp} style={{ marginTop: 15 }}>
        <Text style={{ color: 'blue', textAlign: 'center' }}>
          Not registered? Sign up here
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default SignIn;
