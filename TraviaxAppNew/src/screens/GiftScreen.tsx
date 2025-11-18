import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  SafeAreaView,
  Animated,
  Modal,
} from 'react-native';

import {ItineraryOption} from '../types/itinerary';

interface GiftScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
    navigateToHome: () => void;
  };
  route?: {
    params?: {
      selectedItinerary?: ItineraryOption;
    };
  };
}

const GiftScreen: React.FC<GiftScreenProps> = ({navigation, route}) => {
  const [recipientName, setRecipientName] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [selectedItinerary, setSelectedItinerary] =
    useState<ItineraryOption | null>(route?.params?.selectedItinerary ?? null);
  const [nameError, setNameError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const popupScale = useRef(new Animated.Value(0)).current;
  const popupOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (route?.params?.selectedItinerary) {
      setSelectedItinerary(route.params.selectedItinerary);
    }
  }, [route?.params?.selectedItinerary]);

  const handleSendGift = () => {
    // Validate name
    if (!recipientName.trim()) {
      setNameError('Recipient name is required');
      return;
    }

    setNameError('');
    setIsSending(true);

    // Simulate sending gift
    setTimeout(() => {
      setIsSending(false);
      setShowSuccessPopup(true);

      // Animate popup
      Animated.parallel([
        Animated.spring(popupScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(popupOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-close popup after 4 seconds
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(popupScale, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(popupOpacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setShowSuccessPopup(false);
          // Reset form
          setRecipientName('');
          setPersonalMessage('');
          setSelectedItinerary(null);
        });
      }, 4000);
    }, 3000);
  };

  const handleSelectPackage = () => {
    navigation.navigate('ItenaryList', {
      selectedItineraryId: selectedItinerary?.id,
    });
  };

  const selectedRatingLabel = useMemo(() => {
    if (!selectedItinerary?.rating) {
      return null;
    }
    return `⭐ ${selectedItinerary.rating.toFixed(1)}`;
  }, [selectedItinerary]);

  const selectedPriceLabel = useMemo(() => {
    if (!selectedItinerary) {
      return null;
    }
    return selectedItinerary.priceDisplay ?? 'Price on request';
  }, [selectedItinerary]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={navigation.navigateToHome}
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
        {/* <View style={styles.tripCard}>
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
        </View> */}

        {/* Itinerary Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Holiday Package</Text>
          {selectedItinerary ? (
            <View style={styles.itinerarySelectionBox}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.selectedItineraryCard}
                onPress={handleSelectPackage}>
                <ImageBackground
                  source={{
                    uri:
                      selectedItinerary.heroImage ??
                      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&h=400&fit=crop',
                  }}
                  style={styles.selectedImage}
                  imageStyle={styles.selectedImageRadius}
                />
                <View style={styles.selectedInfo}>
                  <View style={styles.selectedHeaderRow}>
                    <Text style={styles.selectedTitle} numberOfLines={1}>
                      {selectedItinerary.title}
                    </Text>
                    <TouchableOpacity
                      onPress={handleSelectPackage}
                      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                      <Text style={styles.changeText}>Change</Text>
                    </TouchableOpacity>
                  </View>
                  {selectedRatingLabel && (
                    <Text style={styles.selectedMeta}>
                      {selectedRatingLabel}
                    </Text>
                  )}
                  <Text style={styles.selectedMeta}>
                    {selectedItinerary.location}
                  </Text>
                  <Text style={styles.selectedPrice}>{selectedPriceLabel}</Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.itinerarySelectionBox, styles.dashedBox]}
              onPress={handleSelectPackage}>
              <Text style={styles.dashedBoxEmoji}>🎁</Text>
              <Text style={styles.dashedBoxTitle}>
                Select a holiday package
              </Text>
              <Text style={styles.dashedBoxSubtitle}>
                Browse curated itineraries to gift
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Recipient Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Who is this for?</Text>
          <Text style={styles.sectionSubtitle}>Recipient's Full Name</Text>
          <TextInput
            style={[styles.textInput, nameError ? styles.textInputError : null]}
            placeholder="Enter their name"
            placeholderTextColor="#666666"
            value={recipientName}
            onChangeText={text => {
              setRecipientName(text);
              if (nameError) setNameError('');
            }}
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
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

      {/* Send Gift Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.previewButton,
            isSending && styles.previewButtonDisabled,
          ]}
          onPress={handleSendGift}
          disabled={isSending}
          activeOpacity={0.8}>
          <Text style={styles.previewButtonText}>
            {isSending ? 'Sending…' : 'Send Gift'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Success Popup */}
      <Modal
        visible={showSuccessPopup}
        transparent
        animationType="none"
        statusBarTranslucent>
        <View style={styles.popupOverlay}>
          <Animated.View
            style={[
              styles.popupContainer,
              {
                transform: [{scale: popupScale}],
                opacity: popupOpacity,
              },
            ]}>
            <Text style={styles.popupIcon}>✓</Text>
            <Text style={styles.popupTitle}>Success!</Text>
            <Text style={styles.popupMessage}>
              Successfully sent to {recipientName}
            </Text>
          </Animated.View>
        </View>
      </Modal>
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
    marginTop: 30,
  },
  itinerarySelectionBox: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333333',
    padding: 16,
    backgroundColor: '#0F0F0F',
  },
  dashedBox: {
    borderStyle: 'dashed',
    borderColor: '#444444',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    gap: 6,
  },
  dashedBoxEmoji: {
    fontSize: 28,
  },
  dashedBoxTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  dashedBoxSubtitle: {
    color: '#888888',
    fontSize: 13,
  },
  selectedItineraryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectedImage: {
    width: 80,
    height: 80,
  },
  selectedImageRadius: {
    borderRadius: 12,
  },
  selectedInfo: {
    flex: 1,
  },
  selectedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  selectedTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  changeText: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: '600',
  },
  selectedMeta: {
    color: '#AAAAAA',
    fontSize: 13,
  },
  selectedPrice: {
    color: '#FFD700',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 6,
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
  textInputError: {
    borderColor: '#FF4444',
  },
  errorText: {
    color: '#FF4444',
    fontSize: 13,
    marginTop: 6,
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
  previewButtonDisabled: {
    opacity: 0.6,
  },
  previewButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  popupOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    minWidth: 280,
    borderWidth: 1,
    borderColor: '#333333',
  },
  popupIcon: {
    fontSize: 48,
    color: '#FFD700',
    marginBottom: 16,
  },
  popupTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  popupMessage: {
    color: '#CCCCCC',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default GiftScreen;
