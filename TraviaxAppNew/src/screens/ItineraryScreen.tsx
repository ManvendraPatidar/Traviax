import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';

interface ItineraryScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
  route?: {
    params?: {
      destination?: string;
      startDate?: string;
      endDate?: string;
      preferences?: string[];
      budget?: number;
      companion?: string;
    };
  };
}

const ItineraryScreen: React.FC<ItineraryScreenProps> = ({navigation, route}) => {
  const params = route?.params;

  const itineraryData = [
    {
      id: 1,
      date: 'SAT OCT 26',
      title: 'Historic Higashiyama',
      description: 'Immerse yourself in traditional Japan. Visit the iconic Kiyomizu-dera temple for panoramic city views, then wander through the preserved historic streets. Savor traditional cuisine. End your day in the famous Gion district.',
      image: require('../../assets/map.jpg'), // You'll need to add appropriate images
      number: 1,
    },
    {
      id: 2,
      date: 'SUN OCT 27',
      title: 'Arashiyama\'s Natural Beauty',
      description: 'Experience the serene and otherworldly Arashiyama Bamboo Grove. Walk through the towering stalks in a quintessential Kyoto experience. Explore the surrounding Saga temples and scenic river views.',
      image: require('../../assets/map.jpg'),
      number: 2,
    },
    {
      id: 3,
      date: 'MON OCT 28',
      title: 'Fushimi Inari & Sake',
      description: 'Dedicate the day to hiking through the thousands of vibrant red torii gates at Fushimi Inari Shrine. Afterwards, explore the nearby Fushimi Sake District and sample some of Japan\'s finest rice wine.',
      image: require('../../assets/map.jpg'),
      number: 3,
    },
    {
      id: 4,
      date: 'TUE OCT 29',
      title: 'Golden Pavilion',
      description: 'Visit the stunning Kinkaku-ji (Golden Pavilion), one of Japan\'s most photographed temples. Explore the beautiful gardens and reflect on the peaceful atmosphere.',
      image: require('../../assets/map.jpg'),
      number: 4,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={navigation.goBack} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Trip to Kyoto</Text>
          <Text style={styles.headerSubtitle}>OCT 26 - OCT 29</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.startSection}>
          <View style={styles.startIndicator}>
            <View style={styles.startIcon}>
              <Text style={styles.startIconText}>🏁</Text>
            </View>
            <Text style={styles.startText}>Start of your trip</Text>
          </View>
          <Text style={styles.startDescription}>
            Create a memory of for your dates
          </Text>
        </View>

        {itineraryData.map((item, index) => (
          <View key={item.id} style={styles.itineraryCard}>
            <View style={styles.cardHeader}>
              <View style={styles.numberIndicator}>
                <Text style={styles.numberText}>{item.number}</Text>
              </View>
            </View>
            
            <View style={styles.cardContent}>
              <Image source={item.image} style={styles.cardImage} />
              
              <View style={styles.cardInfo}>
                <Text style={styles.cardDate}>{item.date}</Text>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>👆</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>🔍</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#888888',
    fontSize: 14,
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  startSection: {
    marginBottom: 30,
  },
  startIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  startIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#FFD700',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  startIconText: {
    fontSize: 16,
  },
  startText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
  startDescription: {
    color: '#888888',
    fontSize: 14,
    marginLeft: 44,
  },
  itineraryCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333333',
  },
  cardHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  numberIndicator: {
    width: 28,
    height: 28,
    backgroundColor: '#FFD700',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#333333',
  },
  cardInfo: {
    gap: 8,
  },
  cardDate: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardDescription: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 20,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingVertical: 30,
  },
  actionButton: {
    width: 48,
    height: 48,
    backgroundColor: '#1A1A1A',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333333',
  },
  actionIcon: {
    fontSize: 20,
  },
});

export default ItineraryScreen;
