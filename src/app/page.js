'use client';
import { useEffect, useState, useCallback } from 'react';
import styles from './layout.module.css';

import Sidebar from '@/components/Sidebar';
import ChatWindow from '@/components/ChatWindow';
import UserList from '@/components/UserList';
import MessageInput from '@/components/MessageInput';
import { useLogin } from '@/context/LoginContext';

export default function HomePage() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useLogin();

  // 1. Fetch conversations on mount
  useEffect(() => {
    if (!user) return;
  
    const fetchConversations = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const res = await fetch(`/api/conversations?userId=${user._id}`);
        const data = await res.json();
  
        if (res.ok) {
          const formattedChats = data.map(conv => ({
            id: conv._id,
            name: conv.username,
            avatar: conv.avatar || '/default-avatar.png',
            userId: conv.userId,
          }));
          
          setChats(formattedChats);
        } else {
          setError(data.message || 'Failed to load conversations');
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
        setError('Failed to connect to server');
      } finally {
        setLoading(false);
      }
    };
  
    fetchConversations();
  }, [user]);

  // 2. Fetch messages when active chat changes
 // In your chat component
useEffect(() => {
  if (!activeChatId || !user) {
    setMessages([]);
    return;
  }

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/messages?conversationId=${activeChatId}`);
      const data = await res.json();
      
      if (res.ok) {
        // Mark messages as mine or not
        const formattedMessages = data.map(msg => ({
          ...msg,
          isMine: msg.senderId === user._id
        }));
        setMessages(formattedMessages);
      } else {
        console.error('Failed to fetch messages:', data.message);
        setMessages([]); // Clear messages on error
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setMessages([]);
    }
  };

  fetchMessages();
}, [activeChatId, user]);

  // 3. Add user to chat with better error handling
  const handleAddUser = async (otherUser) => {
    try {
      setLoading(true);
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId1: user._id,
          userId2: otherUser._id,
          userName1: user.username,
          userName2: otherUser.username
        }),
      });

      const data = await res.json();
      if (res.ok) {
        const newChat = {
          id: data.conversationId,
          name: otherUser.username,
          avatar: otherUser.avatar || '/default-avatar.png',
          userId: otherUser._id,
        };
        
        setChats((prev) => [...prev, newChat]);
        setActiveChatId(data.conversationId);
      } else {
        setError(data.message || 'Failed to create conversation');
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      setError('Failed to create conversation');
    } finally {
      setLoading(false);
    }
  };

  // 4. Improved send message function
const handleSend = useCallback(async () => {
  if (!input.trim() || !activeChatId || !user) return;

  const messageText = input.trim();
  const tempId = Date.now().toString();
  
  console.log('Sending message:', {
    conversationId: activeChatId,
    senderId: user._id,
    text: messageText
  });

  // Optimistically add message to UI
  const newMessage = {
    id: tempId,
    text: messageText,
    senderId: user._id,
    senderName: user.username,
    isMine: true,
    timestamp: new Date().toISOString(),
    status: 'sending'
  };
  
  setMessages((prev) => [...prev, newMessage]);
  setInput('');

  try {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversationId: activeChatId,
        senderId: user._id,
        senderName: user.username,
        text: messageText,
      }),
    });

    const data = await res.json();
    console.log('API Response:', { status: res.status, data });
    
    if (res.ok) {
      // Update message with server response
      setMessages((prev) => 
        prev.map(msg => 
          msg.id === tempId 
            ? { ...msg, id: data._id?.toString() || tempId, status: 'sent' }
            : msg
        )
      );
    } else {
      console.error('Send message failed:', data);
      // Mark message as failed
      setMessages((prev) => 
        prev.map(msg => 
          msg.id === tempId 
            ? { ...msg, status: 'failed', error: data.message }
            : msg
        )
      );
    }
  } catch (error) {
    console.error('Error sending message:', error);
    setMessages((prev) => 
      prev.map(msg => 
        msg.id === tempId 
          ? { ...msg, status: 'failed', error: 'Network error' }
          : msg
      )
    );
  }
}, [input, activeChatId, user]);

  // 5. Handle Enter key for sending messages
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const activeUser = chats.find((c) => c.id === activeChatId);

  if (!user) {
    return <div className={styles.loading}>Please log in to continue</div>;
  }

  return (
    <div className={styles.main}>
      <Sidebar
        chats={chats}
        activeId={activeChatId}
        onSelect={setActiveChatId}
        loading={loading}
      />

      <div className={styles.chatArea}>
        {error && (
          <div className={styles.error}>
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}
        
        {activeUser ? (
          <>
            <ChatWindow 
              activeUser={activeUser} 
              messages={messages}
              loading={loading}
              currentUserId={user._id}
            />
            <div className={styles.messageInputArea}>
              <MessageInput
                value={input}
                onChange={setInput}
                onSend={handleSend}
                onKeyPress={handleKeyPress}
                disabled={loading}
                placeholder={`Message ${activeUser.name}...`}
              />
            </div>
          </>
        ) : (
          <div className={styles.noChatSelected}>
            Select or add a user to start chatting
          </div>
        )}
      </div>

      <UserList
        onView={(u) => alert(`View profile of ${u.username}`)}
        onAdd={handleAddUser}
        hiddenUserIds={chats.map((c) => c.userId)}
        loading={loading}
      />
    </div>
  );
}