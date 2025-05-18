import styles from './ChatWindow.module.css';

export default function ChatWindow({ activeUser, messages = [] }) {
  if (!activeUser) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>{activeUser.name}</div>
      <div className={styles.messages}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${
              msg.isMine ? styles.outgoing : styles.incoming
            }`}
          >
            {msg.text}
            <div className={styles.timestamp}>{msg.timestamp}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
