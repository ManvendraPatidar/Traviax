import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface GiftScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}

const GiftScreen: React.FC<GiftScreenProps> = ({navigation}) => {
  const [recipientName, setRecipientName] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');

  const handlePreviewGift = () => {
    // Handle gift preview logic
    console.log('Preview Gift:', {
      recipientName,
      personalMessage,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={navigation.goBack}
          style={styles.closeButton}>
          <Text style={styles.closeIcon}>×</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Gift This Experience</Text>
          <Text style={styles.headerSubtitle}>Gift Mode</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Trip Card */}
        <View style={styles.tripCard}>
          <ImageBackground
            source={{
              uri: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=200&fit=crop',
            }}
            style={styles.tripImage}
            imageStyle={styles.tripImageStyle}>
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.tripGradient}>
              <Text style={styles.tripTitle}>A Week in Kyoto</Text>
              <Text style={styles.tripPrice}>$2,500</Text>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Recipient Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Who is this for?</Text>
          <Text style={styles.sectionSubtitle}>Recipient's Full Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter their name"
            placeholderTextColor="#666666"
            value={recipientName}
            onChangeText={setRecipientName}
          />
        </View>

        {/* Personal Message Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add a personal touch</Text>
          <Text style={styles.sectionSubtitle}>Personalized Message</Text>
          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Write your message here..."
              placeholderTextColor="#666666"
              value={personalMessage}
              onChangeText={setPersonalMessage}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <Text style={styles.characterCount}>0 / 200</Text>
          </View>
        </View>
      </ScrollView>

      {/* Preview Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.previewButton}
          onPress={handlePreviewGift}>
          <Text style={styles.previewButtonText}>Preview Gift</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tripCard: {
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 16,
    overflow: 'hidden',
  },
  tripImage: {
    height: 120,
    justifyContent: 'flex-end',
  },
  tripImageStyle: {
    borderRadius: 16,
  },
  tripGradient: {
    padding: 16,
    borderRadius: 16,
  },
  tripTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  tripPrice: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: '#999999',
    fontSize: 14,
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  messageInputContainer: {
    position: 'relative',
  },
  messageInput: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingBottom: 40,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333333',
    minHeight: 120,
  },
  characterCount: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    color: '#666666',
    fontSize: 12,
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#000000',
  },
  previewButton: {
    backgroundColor: '#FFD700',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  previewButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GiftScreen;
