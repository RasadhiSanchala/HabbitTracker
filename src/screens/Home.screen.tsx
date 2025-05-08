
import { Text, View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation'; 

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

function Home() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>This is Home!</Text>
      <Button
        title="Get Started"
        onPress={() => navigation.navigate('SignIn')}
      />
    </View>
  );
}

export default Home;
