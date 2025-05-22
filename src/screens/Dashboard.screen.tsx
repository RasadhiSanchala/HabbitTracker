import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useHabit } from '../context/HabitContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const Dashboard = () => {
  const {
    habits,
    completedHabits,
    toggleHabitComplete,
    deleteHabit,
    setEditingHabit,
  } = useHabit();

  const navigation = useNavigation<NavigationProp>();

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const [selectedTab, setSelectedTab] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [filteredHabits, setFilteredHabits] = useState(habits);

  const filterHabits = () => {
    const dayOfWeek = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
    const habitsForDate = habits.filter(habit => habit.days.includes(dayOfWeek));

    const filtered = habitsForDate.filter(habit => {
      const isCompleted = completedHabits[selectedDate]?.includes(habit.id) ?? false;
      if (selectedTab === 'All') return true;
      if (selectedTab === 'Completed') return isCompleted;
      if (selectedTab === 'Pending') return !isCompleted;
      return true;
    });

    setFilteredHabits(filtered);
  };

  useEffect(() => {
    filterHabits();
  }, [habits, completedHabits, selectedDate, selectedTab]);

  const handleCirclePress = (habitId: string) => {
    toggleHabitComplete(habitId, selectedDate);
    filterHabits();
  };

  const [calendarMonth, setCalendarMonth] = useState(() => new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(() => new Date().getFullYear());

  const generateCalendarDays = () => {
    const firstDay = new Date(calendarYear, calendarMonth, 1);
    const lastDay = new Date(calendarYear, calendarMonth + 1, 0);
    const firstWeekday = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const daysArray: (number | null)[] = [];
    for (let i = 0; i < firstWeekday; i++) daysArray.push(null);
    for (let d = 1; d <= totalDays; d++) daysArray.push(d);
    return daysArray;
  };

  const prevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(y => y - 1);
    } else setCalendarMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(y => y + 1);
    } else setCalendarMonth(m => m + 1);
  };

  const onCalendarDayPress = (day: number) => {
    const mm = (calendarMonth + 1).toString().padStart(2, '0');
    const dd = day.toString().padStart(2, '0');
    setSelectedDate(`${calendarYear}-${mm}-${dd}`);
  };

  const calendarDays = generateCalendarDays();

  const isSelectedCalendarDay = (day: number) => {
    const mm = (calendarMonth + 1).toString().padStart(2, '0');
    const dd = day.toString().padStart(2, '0');
    return `${calendarYear}-${mm}-${dd}` === selectedDate;
  };

  const monthName = new Date(calendarYear, calendarMonth).toLocaleDateString('en-US', { month: 'long' });

  return (
    <View style={styles.container}>
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={prevMonth} style={styles.navButton}>
            <Text style={styles.navButtonText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.calendarTitle}>{monthName} {calendarYear}</Text>
          <TouchableOpacity onPress={nextMonth} style={styles.navButton}>
            <Text style={styles.navButtonText}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.weekdayRow}>
          {WEEKDAYS.map(day => (
            <Text key={day} style={styles.weekdayText}>{day}</Text>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {calendarDays.map((day, i) => (
            day ? (
              <TouchableOpacity
                key={i}
                style={[styles.dayCell, isSelectedCalendarDay(day) && styles.daySelected]}
                onPress={() => onCalendarDayPress(day)}
              >
                <Text style={[styles.dayText, isSelectedCalendarDay(day) && styles.dayTextSelected]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ) : (
              <View key={i} style={styles.dayCell} />
            )
          ))}
        </View>
      </View>

      <View style={styles.tabContainer}>
        {['All', 'Pending', 'Completed'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.tabSelected]}
            onPress={() => setSelectedTab(tab as 'All' | 'Pending' | 'Completed')}
          >
            <Text style={styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        contentContainerStyle={{ paddingBottom: 100 }}
        data={filteredHabits}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const isCompleted = completedHabits[selectedDate]?.includes(item.id) ?? false;
          const isSelected = selectedHabitId === item.id;

          return (
            <TouchableOpacity onPress={() => setSelectedHabitId(s => (s === item.id ? null : item.id))}>
              <View style={[styles.habitBox, isCompleted && styles.habitBoxCompleted]}>
                <TouchableOpacity
                  style={[styles.circle, isCompleted && styles.circleFilled]}
                  onPress={() => handleCirclePress(item.id)}
                />
                <Text style={styles.habitName}>{item.name}</Text>
                <Text style={styles.habitDays}>Days: {item.days.join(', ')}</Text>

                {isSelected && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() =>
                        Alert.alert(
                          'Edit Habit',
                          'Do you want to edit this habit?',
                          [
                            { text: 'Cancel', style: 'cancel' },
                            {
                              text: 'OK',
                              onPress: () => {
                                setEditingHabit(item);
                                navigation.navigate('AddHabbit');
                              },
                            },
                          ],
                          { cancelable: true }
                        )
                      }
                    >
                      <Text style={styles.actionText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() =>
                        Alert.alert(
                          'Delete Habit',
                          'Are you sure you want to delete this habit?',
                          [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Delete', style: 'destructive', onPress: () => deleteHabit(item.id) },
                          ],
                          { cancelable: true }
                        )
                      }
                    >
                      <Text style={styles.actionText}>Delete</Text>
                    </TouchableOpacity>
                  </View>

                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />
      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddHabbit')}
        >
          <Text style={styles.addButtonText}>+ Add Habit</Text>
        </TouchableOpacity>
      </View>

    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f6f3',
  },

  calendarContainer: {
    borderWidth: 1,
    marginTop: 50,
    marginBottom: 20,
    borderColor: '#d6c7b5',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fffefc',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    padding: 8,
  },
  navButtonText: {
    fontSize: 18,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  weekdayText: {
    width: 32,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  dayCell: {
    width: '14.28%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  daySelected: {
    backgroundColor: '#c2a77c',
    borderRadius: 20,
  },
  dayText: {
    color: '#333',
  },
  dayTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#e0d2c1',
  },
  tabSelected: {
    backgroundColor: '#c2a77c',
  },
  tabText: {
    fontWeight: 'bold',
  },
  habitBox: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    borderColor: '#d6c7b5',
    borderWidth: 1,
    backgroundColor: '#fffefc',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  habitBoxCompleted: {
    backgroundColor: '#e0d2c1',
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#333',
    marginBottom: 4,
  },
  circleFilled: {
    backgroundColor: '#c2a77c',
  },
  habitName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  habitDays: {
    fontSize: 12,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  editButton: {
    marginRight: 10,
  },
  deleteButton: {},
  actionText: {
    color: '#007BFF',
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButton: {
    backgroundColor: '#f5c58b', 
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },

  addButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },

});

export default Dashboard;
