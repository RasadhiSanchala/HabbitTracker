import { View, Text, ActivityIndicator } from 'react-native';
import styles from '../styles/Loading.styles';


const LoadingScreen = () => {



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Habit Tracker App </Text>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default LoadingScreen;
