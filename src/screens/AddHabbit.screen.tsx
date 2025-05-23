import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

import { useHabit } from '../context/HabitContext';
import BottomNavBar from '../components/BottomNavBar';

type AddHabitNavProp = NativeStackNavigationProp<RootStackParamList, 'AddHabbit'>;

export default function AddHabbit() {
  const navigation = useNavigation<AddHabitNavProp>();
  const { addHabit, updateHabit, editingHabit, setEditingHabit } = useHabit();

  const [habitName, setHabitName] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const handleHome = () => navigation.navigate('Home');
  const handleDashboard = () => navigation.navigate('Dashboard');
  const handleAdd = () => navigation.navigate('AddHabbit');
 const handleProgress = () => navigation.navigate('AnalyticsScreen');
  const handleLogout = () => {
    navigation.navigate('Home');
  };

  useEffect(() => {
    if (editingHabit) {
      setHabitName(editingHabit.name);
      setSelectedDays(editingHabit.days);
    } else {
      setHabitName('');
      setSelectedDays([]);
    }
  }, [editingHabit]);

  const handleSave = () => {
    if (habitName.trim() === '') return;

    if (editingHabit) {
      updateHabit({
        id: editingHabit.id,
        name: habitName,
        days: selectedDays,
      });
    } else {
      addHabit({
        id: Date.now().toString(),
        name: habitName,
        days: selectedDays,
      });
    }

    setEditingHabit(null);
    navigation.navigate('Dashboard');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text style={styles.title}>{editingHabit ? 'Edit Habit' : 'Add New Habit'}</Text>
          <Text style={styles.subtitle}>Create or update your habit below</Text>

          <Text style={styles.label}>Habit Name</Text>
          <TextInput
            placeholder="e.g. Drink Water"
            value={habitName}
            onChangeText={setHabitName}
            style={styles.input}
            placeholderTextColor="#a18a6b"
            autoCapitalize="words"
          />

          <View style={styles.row}>
            <Text style={styles.label}>Habit Days</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('SelectDays', {
                  onSelectDays: (days: string[]) => setSelectedDays(days),
                })
              }
              style={styles.arrowButton}
            >
              <Text style={styles.arrow}>➡️</Text>
            </TouchableOpacity>
          </View>

          {selectedDays.length > 0 && (
            <View style={styles.daysBoxContainer}>
              {selectedDays.map((day, index) => (
                <View key={index} style={styles.dayBox}>
                  <Text style={styles.dayBoxText}>{day.charAt(0)}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Button
              title={editingHabit ? 'Update Habit' : 'Save Habit'}
              onPress={handleSave}
              color="#6F2E0E"
            />
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
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6F2E0E',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#6F2E0E',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#FFF8F0',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  arrowButton: {
    padding: 8,
    borderRadius: 30,
    backgroundColor: '#6F2E0E22',
  },
  arrow: {
    fontSize: 24,
    color: '#6F2E0E',
  },
  daysBoxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10, // React Native doesn't support gap, so margin is used below
    marginBottom: 25,
  },
  dayBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#6F2E0E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
    shadowColor: '#6F2E0E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  dayBoxText: {
    color: '#FFF8F0',
    fontWeight: 'bold',
    fontSize: 18,
  },
  buttonContainer: {
    marginTop: 10,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
});
