import { View,ActivityIndicator,Image } from 'react-native';
import styles from '../styles/Loading.styles';


const LoadingScreen = () => {


  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default LoadingScreen;
