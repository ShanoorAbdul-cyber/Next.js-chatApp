import styles from './ChatWindow.module.css';

export default function ChatWindow({ activeUser, messages = [], currentUserId }) {
  if (!activeUser) return null;

  // Enhance messages by marking isMine
  const enhancedMessages = messages.map((msg) => ({
    ...msg,
    isMine: msg.senderId === currentUserId,
  }));

  return (
    <div className={styles.container}>
      <div className={styles.header}>{activeUser.name}</div>
      <div className={styles.messages}>
        {enhancedMessages.map((msg) => (
          <div
            key={msg._id}
            className={`${styles.message} ${
              msg.isMine ? styles.outgoing : styles.incoming
            }`}
          >
            <div className={styles.text}>{msg.text}</div>
            <div className={styles.timestamp}>
              {new Date(msg.timestamp).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
