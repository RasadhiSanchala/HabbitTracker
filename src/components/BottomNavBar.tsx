import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';

type BottomNavBarProps = {
  onHome: () => void;
  onDashboard: () => void;
  onAdd: () => void;
  onProgress: () => void;
  onLogout: () => void;
};

const BottomNavBar: React.FC<BottomNavBarProps> = ({
  onHome,
  onDashboard,
  onAdd,
  onProgress,
  onLogout,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onHome} style={styles.iconButton}>
        <Image source={require('../assets/Home.png')} style={styles.iconImage} />
      </TouchableOpacity>

      <TouchableOpacity onPress={onDashboard} style={styles.iconButton}>
        <Image source={require('../assets/dashboard.png')} style={styles.iconImage} />
      </TouchableOpacity>

      <TouchableOpacity onPress={onAdd} style={styles.addButton}>
        <Image source={require('../assets/plus.png')} style={styles.addIconImage} />
      </TouchableOpacity>

      <TouchableOpacity onPress={onProgress} style={styles.iconButton}>
        <Image source={require('../assets/progress.png')} style={styles.iconImage} />
      </TouchableOpacity>

      <TouchableOpacity onPress={onLogout} style={styles.iconButton}>
        <Image source={require('../assets/logout.png')} style={styles.iconImage} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopColor: '#c2a77c',
    borderTopWidth: 5,
    backgroundColor: 'white',
    paddingVertical: 10,
  },
  iconButton: {
    padding: 10,
  },
  iconImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  addButton: {
    backgroundColor: '#6F2E0E',
    width: 60,
    height: 60,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -40,
    borderWidth: 2,
    borderColor: 'white',
  },
  addIconImage: {
    width: 28,
    height: 28,
    tintColor: 'white',
    resizeMode: 'contain',
  },
});

export default BottomNavBar;
