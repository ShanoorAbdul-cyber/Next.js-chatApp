import styles from './MessageInput.module.css';

export default function MessageInput({ value, onChange, onSend }) {
  return (
    <form
      className={styles.composer}
      onSubmit={e => {
        e.preventDefault();
        onSend();
      }}
    >
      <button type="button" className={styles.iconButton}>😊</button>
      <button type="button" className={styles.iconButton}>📎</button>

      <input
        type="text"
        className={styles.input}
        placeholder="Type a message…"
        value={value}
        onChange={e => onChange(e.target.value)}
      />

      <button type="submit" className={styles.sendButton}>▶</button>
    </form>
  );
}
