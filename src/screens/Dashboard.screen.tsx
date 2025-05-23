import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useHabit } from '../context/HabitContext';
import BottomNavBar from '../components/BottomNavBar';
import ConfettiCannon from 'react-native-confetti-cannon';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const Dashboard = () => {
  const {
    habits,
    completedHabits,
    toggleHabitComplete,
    deleteHabit,
  } = useHabit();

  const navigation = useNavigation<NavigationProp>();

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const [selectedTab, setSelectedTab] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [filteredHabits, setFilteredHabits] = useState(habits);

  const [calendarMonth, setCalendarMonth] = useState(() => new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(() => new Date().getFullYear());

  const [showConfetti, setShowConfetti] = useState(false);

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
    const isAlreadyCompleted = completedHabits[selectedDate]?.includes(habitId) ?? false;
    toggleHabitComplete(habitId, selectedDate);

    if (!isAlreadyCompleted) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const prevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(y => y - 1);
    } else {
      setCalendarMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(y => y + 1);
    } else {
      setCalendarMonth(m => m + 1);
    }
  };

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

  const onCalendarDayPress = (day: number) => {
    const mm = (calendarMonth + 1).toString().padStart(2, '0');
    const dd = day.toString().padStart(2, '0');
    setSelectedDate(`${calendarYear}-${mm}-${dd}`);
  };

  const isSelectedCalendarDay = (day: number) => {
    const mm = (calendarMonth + 1).toString().padStart(2, '0');
    const dd = day.toString().padStart(2, '0');
    return `${calendarYear}-${mm}-${dd}` === selectedDate;
  };

  const monthName = new Date(0, calendarMonth).toLocaleDateString('en-US', { month: 'long' });

  return (
    <View style={styles.container}>
      {/* Professional Dashboard Heading */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Dashboard</Text>
      </View>

      {/* Confetti Animation */}
      {showConfetti && (
        <ConfettiCannon
          count={80}
          origin={{ x: 180, y: 0 }}
          autoStart={true}
          fadeOut={true}
          fallSpeed={3000}
        />
      )}

      {/* Calendar */}
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
          {WEEKDAYS.map((day, idx) => (
            <Text key={idx} style={styles.weekdayText}>{day}</Text>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {generateCalendarDays().map((day, i) =>
            day ? (
              <TouchableOpacity
                key={`day-${i}`}
                style={[styles.dayCell, isSelectedCalendarDay(day) && styles.daySelected]}
                onPress={() => onCalendarDayPress(day)}
              >
                <Text style={[styles.dayText, isSelectedCalendarDay(day) && styles.dayTextSelected]}>{day}</Text>
              </TouchableOpacity>
            ) : (
              <View key={`empty-${i}`} style={styles.dayCell} />
            )
          )}
        </View>
      </View>

      <View style={styles.tabContainer}>
        {['All', 'Pending', 'Completed'].map((tab, idx) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.tabSelected]}
            onPress={() => setSelectedTab(tab as typeof selectedTab)}
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
            <View style={[styles.habitBox, isCompleted && styles.habitBoxCompleted]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  style={[styles.circle, isCompleted && styles.circleFilled]}
                  onPress={() => handleCirclePress(item.id)}
                />
                <TouchableOpacity
                  onPress={() => setSelectedHabitId(s => (s === item.id ? null : item.id))}
                  style={{ marginLeft: 12, flex: 1 }}
                  activeOpacity={0.6}
                >
                  <Text style={styles.habitName}>{item.name}</Text>
                  <Text style={styles.habitDays}>Days: {item.days.join(', ')}</Text>
                </TouchableOpacity>
              </View>

              {isSelected && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => {
                    deleteHabit(item.id);
                    setSelectedHabitId(null);
                  }}
                >
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        }}
      />

      <BottomNavBar
        onHome={() => navigation.navigate('Home')}
        onDashboard={() => navigation.navigate('Dashboard')}
        onAdd={() => navigation.navigate('AddHabbit')}
        onProgress={() => navigation.navigate('AnalyticsScreen')}
        onLogout={() => navigation.navigate('Home')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f6f3',
  },
  headerContainer: {
    marginTop: 40,
    marginBottom: 10,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6F2E0E',
    letterSpacing: 1,
  },
  calendarContainer: {
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 20,
    borderColor: '#d6c7b5',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fffefc',
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
  },
  habitBoxCompleted: {
    backgroundColor: '#e8e1d5',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#c2a77c',
  },
  circleFilled: {
    backgroundColor: '#c2a77c',
  },
  habitName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  habitDays: {
    color: '#555',
  },
  deleteButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
    backgroundColor: '#d9534f',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Dashboard;
