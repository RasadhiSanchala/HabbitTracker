import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoadingScreen from '../screens/Loading.screen';
import Home from '../screens/Home.screen';
import SignIn from '../screens/auth/SignIn.screen';
import SignUp from '../screens/auth/SignUp.screen';
import Dashboard from '../screens/Dashboard.screen';
import AddHabbit from '../screens/AddHabbit.screen';
import SelectDays from '../screens/SelectDays.screen';
import { RootStackParamList } from '../types/navigation'; 


const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Loading" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="AddHabbit" component={AddHabbit} />
      <Stack.Screen name="SelectDays" component={SelectDays} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
