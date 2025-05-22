
import { Text, View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation'; 
import BottomNavBar from '../components/BottomNavBar';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

function Home() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

    const handleHome = () => navigation.navigate('Home');
  const handleDashboard = () => navigation.navigate('Dashboard');
  const handleAdd = () => navigation.navigate('AddHabbit');
  const handleProgress = () => navigation.navigate('Home');
  const handleLogout = () => {
    navigation.navigate('Home'); 
  };

  return (
    <View style={{ flex: 1 }}>
    <View style={{flex: 1 ,justifyContent: 'center', alignItems: 'center' }}>
      <Text>This is Home!</Text>
      <Button
        title="Get Started"
        onPress={() => navigation.navigate('SignIn')}
      />
    </View>
        <BottomNavBar
        onHome={handleHome}
        onDashboard={handleDashboard}
        onAdd={handleAdd}
        onProgress={handleProgress}
        onLogout={handleLogout}
      />
    </View>
  );
}

export default Home;
