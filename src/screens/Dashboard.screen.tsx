import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useHabit } from '../context/HabitContext';
import BottomNavBar from '../components/BottomNavBar';
import ConfettiCannon from 'react-native-confetti-cannon';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [animatingHabitId, setAnimatingHabitId] = useState<string | null>(null);

 
  const animationRefs = useRef<{[key: string]: {
    scale: Animated.Value;
    opacity: Animated.Value;
  }}>({});

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

  
  useEffect(() => {
    habits.forEach(habit => {
      if (!animationRefs.current[habit.id]) {
        animationRefs.current[habit.id] = {
          scale: new Animated.Value(0),
          opacity: new Animated.Value(0),
        };
      }
    });
  }, [habits]);

  const startCompletionAnimation = (habitId: string) => {
    const animValues = animationRefs.current[habitId];
    if (!animValues) return;

    setAnimatingHabitId(habitId);

   
    animValues.scale.setValue(0);
    animValues.opacity.setValue(1);

    Animated.sequence([
      
      Animated.timing(animValues.scale, {
        toValue: 1.2,
        duration: 300,
        useNativeDriver: true,
      }),
     
      Animated.timing(animValues.scale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
     
      Animated.delay(400),
    
      Animated.timing(animValues.opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setAnimatingHabitId(null);
    });
  };

  const handleCirclePress = (habitId: string) => {
    const isAlreadyCompleted = completedHabits[selectedDate]?.includes(habitId) ?? false;
    toggleHabitComplete(habitId, selectedDate);

    if (!isAlreadyCompleted) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      
    
      startCompletionAnimation(habitId);
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

  const renderCompletionAnimation = (habitId: string) => {
    const animValues = animationRefs.current[habitId];
    if (!animValues || animatingHabitId !== habitId) return null;

    return (
      <Animated.View
        style={[
          styles.completionAnimation,
          {
            transform: [{ scale: animValues.scale }],
            opacity: animValues.opacity,
          },
        ]}
      >
        <Text style={styles.completionText}>✓</Text>
        <Text style={styles.completionSubText}>Great Job!</Text>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
   
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Dashboard</Text>
      </View>

 
      {showConfetti && (
        <ConfettiCannon
          count={80}
          origin={{ x: 180, y: 0 }}
          autoStart={true}
          fadeOut={true}
          fallSpeed={3000}
        />
      )}

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
            <View style={styles.habitContainer}>
              <View style={[styles.habitBox, isCompleted && styles.habitBoxCompleted]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity
                    style={[styles.checkbox, isCompleted && styles.checkboxFilled]}
                    onPress={() => handleCirclePress(item.id)}
                  >
                    {isCompleted && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
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
              
      
              {renderCompletionAnimation(item.id)}
            </View>
          );
        }}
      />

      <BottomNavBar
        onHome={() => navigation.navigate('Home')}
        onDashboard={() => navigation.navigate('Dashboard')}
        onAdd={() => navigation.navigate('AddHabbit')}
        onProgress={() => navigation.navigate('AnalyticsScreen')}
        onLogout={() => navigation.navigate('SignIn')}
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
  habitContainer: {
    position: 'relative',
  },
  habitBox: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 15,
    borderColor: '#d6c7b5',
    borderWidth: 1.5,
    backgroundColor: '#fffefc',
    shadowColor: '#6F2E0E',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitBoxCompleted: {
    backgroundColor: '#f5f0e8',
    borderColor: '#c2a77c',
    borderWidth: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#c2a77c',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxFilled: {
    backgroundColor: '#c2a77c',
    borderColor: '#6F2E0E',
  },
  checkmark: {
    color: '#6F2E0E',
    fontSize: 16,
    fontWeight: 'bold',
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
  completionAnimation: {
    position: 'absolute',
    right: 10,
    top: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#c2a77c',
    borderRadius: 40,
    width: 80,
    height: 80,
    shadowColor: '#6F2E0E',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#6F2E0E',
  },
  completionText: {
    color: '#6F2E0E',
    fontSize: 24,
    fontWeight: 'bold',
  },
  completionSubText: {
    color: '#6F2E0E',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 2,
  },
});

export default Dashboard;