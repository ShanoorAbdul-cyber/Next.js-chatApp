import styles from './Sidebar.module.css';

export default function Sidebar({ chats, activeId, onSelect }) {
  return (
    <div className={styles.container}>
      {chats.map(chat => (
        <div
          key={chat.id}
          className={`${styles.item} ${chat.id === activeId ? styles.active : ''}`}
          onClick={() => onSelect(chat.id)}
        >
          <img src={chat.avatar || '/default-avatar.png'} className={styles.avatar} />
          <span>{chat.name}</span>
        </div>
      ))}
    </div>
  );
}
