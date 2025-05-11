import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator'; 
import { AuthProvider } from './src/context/AuthContext';
import {HabitProvider} from './src/context/HabitContext';

const App = () => {
  return (
    <AuthProvider>
       <HabitProvider>
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
     </HabitProvider>
   </AuthProvider>
  );
};

export default App;
