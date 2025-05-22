import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import BottomNavBar from '../components/BottomNavBar';

const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const fullDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

type SelectDaysRouteProp = RouteProp<RootStackParamList, 'SelectDays'>;
type SelectDaysNavProp = NativeStackNavigationProp<RootStackParamList, 'SelectDays'>;

export default function SelectDaysScreen() {
  const route = useRoute<SelectDaysRouteProp>();
  const navigation = useNavigation<SelectDaysNavProp>();

  const { onSelectDays } = route.params;

  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isDaily, setIsDaily] = useState(false);

  const toggleDay = (index: number) => {
    const day = fullDays[index];
    if (selectedDays.includes(day)) {
      setSelectedDays(prev => prev.filter(d => d !== day));
    } else {
      setSelectedDays(prev => [...prev, day]);
    }
  };

  const handleDailySelect = () => {
    setIsDaily(true);
    setSelectedDays([...fullDays]);
  };

  const handleWeeklySelect = () => {
    setIsDaily(false);
    setSelectedDays([]);
  };

  const handleSave = () => {
    onSelectDays(selectedDays); 
    navigation.goBack();
  };

  const handleHome = () => navigation.navigate('Home');
  const handleDashboard = () => navigation.navigate('Dashboard');
  const handleAdd = () => navigation.navigate('AddHabbit');
  const handleProgress = () => navigation.navigate('Home');
  const handleLogout = () => {
    navigation.navigate('Home'); 
  };

  return (
    <View style={{ flex: 1 }}>
    <View style={styles.container}>
      <Text style={styles.heading}>Select Days</Text>

      <View style={styles.optionContainer}>
        <TouchableOpacity
          onPress={handleDailySelect}
          style={[styles.optionButton, isDaily && styles.selectedOption]}
        >
          <Text style={styles.optionText}>Daily</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleWeeklySelect}
          style={[styles.optionButton, !isDaily && styles.selectedOption]}
        >
          <Text style={styles.optionText}>Weekly</Text>
        </TouchableOpacity>
      </View>

      {!isDaily && (
        <View style={styles.daysContainer}>
          {daysOfWeek.map((dayLetter, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCircle,
                selectedDays.includes(fullDays[index]) && styles.selectedDay,
              ]}
              onPress={() => toggleDay(index)}
            >
              <Text style={styles.dayLetter}>{dayLetter}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Button title="Save" onPress={handleSave} />
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

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  heading: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  optionContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#eee',
    borderRadius: 10,
  },
  selectedOption: {
    backgroundColor: '#00bcd4',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDay: {
    backgroundColor: '#00bcd4',
  },
  dayLetter: {
    fontSize: 18,
    color: '#fff',
  },
});