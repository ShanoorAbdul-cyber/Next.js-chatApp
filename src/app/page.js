'use client';
import { useEffect, useState } from 'react';
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

  const { user } = useLogin();
  console.log(user);

  // 1. Fetch conversations on mount
  useEffect(() => {
    if (!user) return;
  
    const fetchConversations = async () => {
      try {
        const res = await fetch(`/api/conversations?userId=${user._id}`); // Now using GET
        const data = await res.json();
  
        if (res.ok) {
          const formattedChats = data.map(conv => ({
            id: conv._id,
            name: conv.username,
            avatar: '/default-avatar.png',
            userId: conv.userId,
          }));
          
          setChats(formattedChats);
        } else {
          alert(data.message || 'Failed to load conversations');
        }
      } catch (err) {
        console.error('Error fetching conversations:', err);
      }
    };
  
    fetchConversations();
  }, [user]);

  // 2. Add user to chat
  const handleAddUser = async (otherUser) => {
    try {
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
          avatar: '/default-avatar.png',
          userId: otherUser._id,
        };
        setChats((prev) => [...prev, newChat]);
        setActiveChatId(data.conversationId);
      } else {
        alert(data.message || 'Failed to create conversation');
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      alert('Something went wrong');
    }
  };

  const handleSend = () => {
    if (!input) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: input,
        isMine: true,
        timestamp: 'Now',
      },
    ]);
    setInput('');
  };

  const activeUser = chats.find((c) => c.id === activeChatId);

  return (
    <div className={styles.main}>
      <Sidebar
        chats={chats}
        activeId={activeChatId}
        onSelect={setActiveChatId}
      />

      <div className={styles.chatArea}>
        {activeUser ? (
          <>
            <ChatWindow activeUser={activeUser} messages={messages} />
            <div className={styles.messageInputArea}>
              <MessageInput
                value={input}
                onChange={setInput}
                onSend={handleSend}
              />
            </div>
          </>
        ) : (
          <div className={styles.noChatSelected}>Select or add a user to start chatting</div>
        )}
      </div>

      <UserList
        onView={(u) => alert(`View profile of ${u.username}`)}
        onAdd={handleAddUser}
        hiddenUserIds={chats.map((c) => c.userId)}
      />
    </div>
  );
}
