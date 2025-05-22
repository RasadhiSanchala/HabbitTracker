import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import BottomNavBar from '../components/BottomNavBar';

const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const fullDays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

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
  const handleLogout = () => navigation.navigate('Home');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text style={styles.title}>Select Days</Text>
          <Text style={styles.subtitle}>Choose your habit recurrence pattern</Text>

          <View style={styles.optionContainer}>
            <TouchableOpacity
              onPress={handleDailySelect}
              style={[styles.optionButton, isDaily && styles.selectedOption]}
              activeOpacity={0.7}
            >
              <Text style={[styles.optionText, isDaily && styles.selectedOptionText]}>
                Daily
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleWeeklySelect}
              style={[styles.optionButton, !isDaily && styles.selectedOption]}
              activeOpacity={0.7}
            >
              <Text style={[styles.optionText, !isDaily && styles.selectedOptionText]}>
                Weekly
              </Text>
            </TouchableOpacity>
          </View>

          {!isDaily && (
            <View style={styles.daysContainer}>
              {daysOfWeek.map((dayLetter, index) => {
                const isSelected = selectedDays.includes(fullDays[index]);
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.dayCircle, isSelected && styles.selectedDay]}
                    onPress={() => toggleDay(index)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.dayLetter, isSelected && styles.selectedDayLetter]}>
                      {dayLetter}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Button title="Save" onPress={handleSave} color="#6F2E0E" />
          </View>
        </View>
      </ScrollView>

      <BottomNavBar
        onHome={handleHome}
        onDashboard={handleDashboard}
        onAdd={handleAdd}
        onProgress={handleProgress}
        onLogout={handleLogout}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#F6E8DC',
  },
  scrollContent: {
    paddingVertical: 40,
    paddingHorizontal: 30,
    flexGrow: 1,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 25,
    shadowColor: '#6F2E0E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    elevation: 8,
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#6F2E0E',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6F2E0E',
    marginBottom: 25,
    fontWeight: '500',
    textAlign: 'center',
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
  },
  optionButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    backgroundColor: '#F0E8E0',
    borderRadius: 20,
    shadowColor: '#6F2E0E44',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  selectedOption: {
    backgroundColor: '#6F2E0E',
    shadowColor: '#6F2E0E99',
    elevation: 7,
  },
  optionText: {
    fontSize: 18,
    color: '#6F2E0E',
    fontWeight: '600',
  },
  selectedOptionText: {
    color: '#FFF8F0',
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  dayCircle: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#F0E8E0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6F2E0E22',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedDay: {
    backgroundColor: '#6F2E0E',
    shadowColor: '#6F2E0E99',
    elevation: 7,
  },
  dayLetter: {
    fontSize: 22,
    color: '#6F2E0E',
    fontWeight: '700',
  },
  selectedDayLetter: {
    color: '#FFF8F0',
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
});
