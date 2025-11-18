import React from 'react';
import {
  TouchableOpacity,
  Image,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

interface BackButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const BackButton: React.FC<BackButtonProps> = ({onPress, style}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Image
        source={{
          uri: 'https://cdn-icons-png.flaticon.com/512/271/271220.png',
        }}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 16,
    height: 16,
    tintColor: '#FFFFFF',
    resizeMode: 'contain',
  },
});

export default BackButton;
