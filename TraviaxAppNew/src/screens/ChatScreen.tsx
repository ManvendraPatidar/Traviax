import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import {apiService} from '../services/api';
import BackButton from '../components/BackButton';

interface ChatScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  image?: string;
}

const ChatScreen: React.FC<ChatScreenProps> = ({navigation}) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI Travel Assistant. How can I help you with your travel plans today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  const sendMessage = async () => {
    const content = inputText.trim();
    if (!content || isLoading) {
      return;
    }

    const outgoing: Message = {
      id: Date.now().toString(),
      text: content,
      isUser: true,
      timestamp: new Date(),
    };

    // Append user's message locally
    setMessages(prev => [...prev, outgoing]);
    setInputText('');
    setIsLoading(true);

    // Scroll to bottom immediately after sending message
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({animated: true});
    }, 50);

    try {
      // Build conversation history (exclude the just-sent message; it's passed separately)
      const history: Array<{
        role: 'user' | 'assistant' | 'system';
        content: string;
      }> = messages.map(m => {
        const role: 'user' | 'assistant' = m.isUser ? 'user' : 'assistant';
        return {role, content: m.text};
      });

      const {reply} = await apiService.chat(content, history);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: reply || "I'm here to help!",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);

      // Scroll to bottom after AI response
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({animated: true});
      }, 100);
    } catch (error: any) {
      const aiError: Message = {
        id: (Date.now() + 2).toString(),
        text: 'Sorry, I had trouble generating a response. Please try again in a moment.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiError]);

      // Scroll to bottom after error message
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({animated: true});
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  // const resetConversation = () => {
  //   if (isLoading) {
  //     return;
  //   }
  //   setMessages([
  //     {
  //       id: '1',
  //       text: "Hello! I'm your AI Travel Assistant. How can I help you with your travel plans today?",
  //       isUser: false,
  //       timestamp: new Date(),
  //     },
  //   ]);
  // };

  const renderMessage = (message: Message) => {
    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          message.isUser ? styles.userMessage : styles.aiMessage,
        ]}>
        {!message.isUser && (
          <View style={styles.aiAvatar}>
            <Text style={styles.aiAvatarText}>🤖</Text>
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            message.isUser ? styles.userBubble : styles.aiBubble,
          ]}>
          {message.isUser ? (
            <Text style={[styles.messageText, styles.userText]}>
              {message.text}
            </Text>
          ) : (
            <Markdown style={markdownStyles}>{message.text}</Markdown>
          )}
        </View>
        {message.isUser && (
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>👤</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={navigation.goBack} style={styles.backButton} />
        <View style={styles.headerCenter}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarText}>🤖</Text>
          </View>
          <Text style={styles.headerTitle}>TraviAI Assistant</Text>
        </View>
      </View>

      {/* Today Label */}
      <View style={styles.todayContainer}>
        <Text style={styles.todayText}>Today</Text>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContent}>
        {messages.map(renderMessage)}
        {isLoading && (
          <View style={[styles.messageContainer, styles.aiMessage]}>
            <View style={styles.aiAvatar}>
              <Text style={styles.aiAvatarText}>🤖</Text>
            </View>
            <View style={[styles.messageBubble, styles.aiBubble]}>
              <ActivityIndicator color="#FFD700" />
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Ask me anything..."
          placeholderTextColor="#666666"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
          disabled={isLoading || !inputText.trim()}>
          <Text style={styles.sendIcon}>➤</Text>
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  backButton: {
    marginRight: 12,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatarText: {
    fontSize: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshIcon: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  todayContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  todayText: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  aiAvatarText: {
    fontSize: 16,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  userAvatarText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  aiBubble: {
    backgroundColor: '#1A1A1A',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#FFD700',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  aiText: {
    color: '#FFFFFF',
  },
  userText: {
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1A1A1A',
    gap: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#333333',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const markdownStyles = StyleSheet.create({
  body: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
  },
  heading1: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
    lineHeight: 30,
  },
  heading2: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 6,
    lineHeight: 28,
  },
  heading3: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 6,
    lineHeight: 26,
  },
  heading4: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 4,
    lineHeight: 24,
  },
  heading5: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 4,
    lineHeight: 22,
  },
  heading6: {
    color: '#FFD700',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 4,
    lineHeight: 20,
  },
  paragraph: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
    marginTop: 0,
    marginBottom: 10,
  },
  strong: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  em: {
    color: '#FFFFFF',
    fontStyle: 'italic',
  },
  bullet_list: {
    marginTop: 4,
    marginBottom: 10,
  },
  ordered_list: {
    marginTop: 4,
    marginBottom: 10,
  },
  list_item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bullet_list_icon: {
    color: '#FFD700',
    fontSize: 16,
    marginRight: 8,
    marginTop: 3,
  },
  ordered_list_icon: {
    color: '#FFD700',
    fontSize: 16,
    marginRight: 8,
  },
  code_inline: {
    backgroundColor: '#333333',
    color: '#FFD700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: 'monospace',
    fontSize: 14,
  },
  code_block: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333333',
  },
  fence: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333333',
  },
  blockquote: {
    backgroundColor: '#1A1A1A',
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
    paddingLeft: 12,
    paddingVertical: 8,
    marginTop: 8,
    marginBottom: 10,
  },
  link: {
    color: '#FFD700',
    textDecorationLine: 'underline',
  },
  hr: {
    backgroundColor: '#333333',
    height: 1,
    marginVertical: 12,
  },
  table: {
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 10,
  },
  thead: {
    backgroundColor: '#1A1A1A',
  },
  tbody: {},
  th: {
    color: '#FFD700',
    fontWeight: 'bold',
    padding: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
  tr: {
    borderBottomWidth: 1,
    borderColor: '#333333',
  },
  td: {
    color: '#FFFFFF',
    padding: 8,
    borderWidth: 1,
    borderColor: '#333333',
  },
});

export default ChatScreen;
