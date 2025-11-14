import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface SimpleTabBarProps {
  activeTab: string;
  onTabPress: (tab: string) => void;
}

const SimpleTabBar = ({activeTab, onTabPress}: SimpleTabBarProps) => {
  const tabs = [
    {key: 'Home', label: 'Home', icon: '🏠'},
    {key: 'Explore', label: 'Explore', icon: '🔍'},
    {key: 'Reels', label: 'Reels', icon: '✨'},
    {key: 'Profile', label: 'Profile', icon: '👤'},
  ];

  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.key;

        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabPress(tab.key)}
            style={styles.tabItem}>
            <Text
              style={[styles.icon, {color: isActive ? '#FFD700' : '#666666'}]}>
              {tab.icon}
            </Text>
            <Text
              style={[styles.label, {color: isActive ? '#FFD700' : '#666666'}]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#000000',
    paddingBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#333333',
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 20,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default SimpleTabBar;
