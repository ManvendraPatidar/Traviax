import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card } from "@/components/common/Card";
import { apiService } from "@/services/api";
import { theme } from "@/theme";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const FULL_HEIGHT = SCREEN_HEIGHT;

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  suggestions?: string[];
}

export interface ChatBottomSheetRef {
  open: () => void;
  close: () => void;
}

interface ChatBottomSheetProps {
  onClose?: () => void;
}

export const ChatBottomSheet = forwardRef<
  ChatBottomSheetRef,
  ChatBottomSheetProps
>(({ onClose }, ref) => {
  const insets = useSafeAreaInsets();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Let's explore! How can I help you today?",
      isUser: false,
      timestamp: new Date(),
      suggestions: [
        "Plan a 3-day trip to Istanbul",
        "Show me hidden gems in Dubai",
        "Best food experiences in Turkey",
        "Romantic getaway ideas",
      ],
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const sheetHeight = useSharedValue(FULL_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  const openSheet = useCallback(() => {
    setIsVisible(true);
    setIsExpanded(true);
    sheetHeight.value = withTiming(FULL_HEIGHT, { duration: 400 });
    translateY.value = withTiming(0, { duration: 400 });
    backdropOpacity.value = withTiming(0.5, { duration: 400 });
  }, [translateY, backdropOpacity, sheetHeight]);

  const closeSheet = useCallback(() => {
    translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 });
    backdropOpacity.value = withTiming(0, { duration: 300 });
    sheetHeight.value = withTiming(FULL_HEIGHT, { duration: 300 });
    setIsExpanded(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  }, [translateY, backdropOpacity, sheetHeight, onClose]);

  useImperativeHandle(
    ref,
    () => ({
      open: openSheet,
      close: closeSheet,
    }),
    [openSheet, closeSheet]
  );

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newTranslateY = Math.max(
        0,
        Math.min(SCREEN_HEIGHT, translateY.value + event.translationY)
      );
      translateY.value = newTranslateY;
    })
    .onEnd((event) => {
      if (event.velocityY > 500) {
        // Fast swipe down - close
        runOnJS(closeSheet)();
      } else if (translateY.value > SCREEN_HEIGHT * 0.3) {
        // Swipe down beyond threshold - close
        runOnJS(closeSheet)();
      } else {
        // Return to full screen
        translateY.value = withTiming(0);
        sheetHeight.value = withTiming(FULL_HEIGHT);
      }
    });

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await apiService.chatWithConcierge(text.trim());

      setTimeout(() => {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.response,
          isUser: false,
          timestamp: new Date(),
          suggestions: response.suggestions,
        };

        setMessages((prev) => [...prev, aiMessage]);
        setIsTyping(false);
      }, response.typing_duration || 2000);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleInputFocus = () => {
    // Input is already in full screen mode, no action needed
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble message={item} onSuggestionPress={handleSuggestionPress} />
  );

  const renderTypingIndicator = () => (
    <View style={styles.typingContainer}>
      <Card style={styles.typingBubble}>
        <View style={styles.typingDots}>
          <TypingDot delay={0} />
          <TypingDot delay={200} />
          <TypingDot delay={400} />
        </View>
      </Card>
    </View>
  );

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    height: sheetHeight.value,
  }));

  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  useEffect(() => {
    if (messages.length > 1) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isTyping]);

  if (!isVisible) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, animatedBackdropStyle]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={closeSheet}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Bottom Sheet */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.sheet, animatedSheetStyle]}>
          <View style={styles.sheetContent}>
            {/* Handle */}
            <View style={styles.handle} />

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <LinearGradient
                  colors={[theme.colors.accent, theme.colors.accentBright]}
                  style={styles.aiIcon}
                >
                  <Ionicons
                    name="star"
                    size={20}
                    color={theme.colors.primary}
                  />
                </LinearGradient>
                <Text style={styles.headerTitle}>AI Concierge</Text>
              </View>

              <TouchableOpacity style={styles.closeButton} onPress={closeSheet}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {/* Messages */}
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              style={styles.messagesList}
              contentContainerStyle={[
                styles.messagesContent,
                { paddingBottom: insets.bottom + 80 },
              ]}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={isTyping ? renderTypingIndicator : null}
            />

            {/* Input */}
            <View
              style={[styles.inputContainer, { paddingBottom: insets.bottom }]}
            >
              <Card style={styles.inputCard}>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Ask anything..."
                    placeholderTextColor={theme.colors.textMuted}
                    value={inputText}
                    onChangeText={setInputText}
                    onFocus={handleInputFocus}
                    multiline
                    maxLength={500}
                  />
                  <TouchableOpacity
                    style={[
                      styles.sendButton,
                      !inputText.trim() && styles.sendButtonDisabled,
                    ]}
                    onPress={() => sendMessage(inputText)}
                    disabled={!inputText.trim()}
                  >
                    <LinearGradient
                      colors={
                        inputText.trim()
                          ? [theme.colors.accent, theme.colors.accentBright]
                          : ["#333", "#333"]
                      }
                      style={styles.sendButtonGradient}
                    >
                      <Ionicons
                        name="send"
                        size={18}
                        color={
                          inputText.trim()
                            ? theme.colors.primary
                            : theme.colors.textMuted
                        }
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </Card>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
});

const MessageBubble: React.FC<{
  message: Message;
  onSuggestionPress: (suggestion: string) => void;
}> = ({ message, onSuggestionPress }) => {
  return (
    <View
      style={[
        styles.messageContainer,
        message.isUser && styles.userMessageContainer,
      ]}
    >
      <Card
        style={
          message.isUser
            ? { ...styles.messageBubble, ...styles.userBubble }
            : styles.messageBubble
        }
        variant={message.isUser ? "default" : "glass"}
      >
        <Text
          style={[styles.messageText, message.isUser && styles.userMessageText]}
        >
          {message.text}
        </Text>

        {message.suggestions && (
          <View style={styles.suggestionsContainer}>
            {message.suggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => onSuggestionPress(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </Card>
    </View>
  );
};

const TypingDot: React.FC<{ delay: number }> = ({ delay }) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    const animate = () => {
      opacity.value = withDelay(
        delay,
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0.3, { duration: 600 })
        )
      );
    };

    animate();
    const interval = setInterval(animate, 1200);
    return () => clearInterval(interval);
  }, [delay, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.typingDot, animatedStyle]} />;
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  sheetContent: {
    flex: 1,
    backgroundColor: "#000000",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.textMuted,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  aiIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  messageContainer: {
    marginBottom: theme.spacing.md,
    alignItems: "flex-start",
  },
  userMessageContainer: {
    alignItems: "flex-end",
  },
  messageBubble: {
    maxWidth: "80%",
  },
  userBubble: {
    backgroundColor: theme.colors.accent,
  },
  messageText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    lineHeight:
      theme.typography.lineHeight.relaxed * theme.typography.fontSize.base,
  },
  userMessageText: {
    color: theme.colors.primary,
  },
  suggestionsContainer: {
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  suggestionChip: {
    backgroundColor: "rgba(212, 175, 55, 0.2)",
    borderWidth: 1,
    borderColor: theme.colors.accent,
    borderRadius: theme.spacing.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  suggestionText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.accent,
    fontWeight: theme.typography.fontWeight.medium,
  },
  typingContainer: {
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },
  typingBubble: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  typingDots: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.accent,
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing.lg,
    backgroundColor: "#000000",
  },
  inputCard: {
    padding: theme.spacing.sm,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: theme.spacing.sm,
  },
  textInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    maxHeight: 100,
  },
  sendButton: {
    borderRadius: theme.spacing.borderRadius.full,
    overflow: "hidden",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonGradient: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
});
