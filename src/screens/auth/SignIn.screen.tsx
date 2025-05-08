import { View, Text,TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation'; // adjust path if needed

type SignInScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignIn'>;

function SignIn() {
  const navigation = useNavigation<SignInScreenNavigationProp>();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>This is Sign In Page</Text>
      
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={{ color: 'blue', marginTop: 10 }}>
          New user? Go to Sign Up
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default SignIn;
