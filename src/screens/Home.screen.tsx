import { Text, View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';


type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const buttonColor = '#6F2E0E';

function Home() {
  const navigation = useNavigation<HomeScreenNavigationProp>();



  return (
    <ImageBackground
      source={require('../assets/bg.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.headingContainer}>
          
        </View>

        <View style={styles.contentBox}>
          <Text style={styles.subheading}>Track</Text>
          <Text style={styles.subheading}>Improve</Text>
          <Text style={styles.subheading}>Succeed</Text>

         
          <TouchableOpacity
            style={styles.customButton}
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={styles.customButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>

      
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headingContainer: {
    paddingTop: 90,
    alignItems: 'center',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: buttonColor,
  },
  contentBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft:-30,
    marginTop: 200,
    padding: 20,
  },
  subheading: {
    fontSize: 22,
    color: buttonColor,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  customButton: {
    backgroundColor: buttonColor,
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 10,
  },
  customButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Home;
