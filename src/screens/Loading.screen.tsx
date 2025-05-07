import React, { useCallback } from 'react';
import { View, ActivityIndicator, Image } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import styles from '../styles/Loading.styles';
import { RootStackParamList } from '../types/navigation';


const LoadingScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        navigation.navigate('Home');
      }, 3000);

      return () => clearTimeout(timer); 
    }, [navigation])
  );

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default LoadingScreen;
