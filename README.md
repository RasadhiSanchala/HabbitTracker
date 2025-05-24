# HabitDone - Habit Tracker – Build Good Habits, Break Bad Ones!

## Project Overview

Habit Tracker is a mobile application built with React Native and TypeScript that helps users create, track, and maintain daily or weekly habits. The app allows users to register/login locally, add habits, mark them as completed, and monitor their progress over time. All data is stored locally using AsyncStorage, ensuring offline-first functionality.


## Features

### Core Features

#### Registration / Login (Local Only)

User registration with Name, Email, and Password (no real authentication).

User details saved securely in AsyncStorage.

#### Create Habit Screen

Add new habits with:

Habit Name

Frequency (Daily or Weekly)

Habits saved in AsyncStorage.

#### Dashboard

Displays all added habits using FlatList.

Shows habit name and completion status for today.

Button to mark habits as completed.

Filter habits by:

All Habits

Pending Habits

Completed Habits

#### Progress Tracking Screen

Displays percentage of habits completed.

daily,weekly,monthly progress tracking.

Simple charts or textual progress indicators.

#### Logout

Clears AsyncStorage.

Navigates back to the Login screen.

Bonus Features
Calendar view showing habit streaks.

Animations when marking a habit complete.

Offline-first support (fully functional without internet).



## Tech Stack & Tools

React Native CLI – Core development framework.

TypeScript – Static typing for props and state management.

React Navigation – Stack and Tab navigation.

AsyncStorage – Local data persistence.

useContext API – Optional state management.

Additional Libraries – As needed for UI components and animations.

Folder Structure
```
src/
├── assets/        # Images, fonts, and static files
├── components/    # Reusable UI components (buttons, cards, etc.)
├── context/       # Context API files for global state management
├── navigation/    # Navigation setup (stacks, tabs, navigators)
├── screens/       # App screens (Login, Dashboard, AddHabit, etc.)
├── styles/        # Shared style files (colors, themes, etc.)
├── types/         # TypeScript type definitions and interfaces
├── utils/         # Utility/helper functions (date helpers, storage, etc.)

```
Setup Instructions

1) Clone the repository
```
git clone https://github.com/RasadhiSanchala/HabbitTracker.git
cd HabbitTracker
```
2) Install dependencies

`npm install`

3) Run the app

For Android:

`npx react-native run-android`

4) start Metro bundler:

`npx react-native start`

## How to Use

### Register/Login
Launch the app and register with your name, email, and password. If already registered, login will auto-fill.

### Add New Habit
Navigate to the Add Habit screen to create new habits. Choose habit name and frequency (daily/weekly).

### Track Habits
View your habit list on the Dashboard. Mark habits as completed daily.

### View Progress
Check the Analytics screen to see your daily and weekly progress with simple charts.

### Logout
Use the logout button to clear your data and return to the login screen.

Demo Video
[Attach your demo video link here]

