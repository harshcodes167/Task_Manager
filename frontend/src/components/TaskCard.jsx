export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const statusMap = { 'todo': 'badge-todo', 'in-progress': 'badge-progress', 'done': 'badge-done' };
  const priorityMap = { 'low': 'badge-low', 'medium': 'badge-medium', 'high': 'badge-high' };
  const statusLabel = { 'todo': 'Todo', 'in-progress': 'In Progress', 'done': 'Done' };

  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && dueDate < new Date() && task.status !== 'done';

  return (
    <div style={styles.card} className="fade-in">
      <div style={styles.top}>
        <div style={styles.badges}>
          <span className={`badge ${statusMap[task.status]}`}>{statusLabel[task.status]}</span>
          <span className={`badge ${priorityMap[task.priority]}`}>{task.priority}</span>
        </div>
        <div style={styles.actions}>
          <button style={styles.actionBtn} onClick={() => onEdit(task)} title="Edit">✎</button>
          <button style={{ ...styles.actionBtn, color: 'var(--red)' }} onClick={() => onDelete(task._id)} title="Delete">✕</button>
        </div>
      </div>

      <h3 style={{ ...styles.title, textDecoration: task.status === 'done' ? 'line-through' : 'none', opacity: task.status === 'done' ? 0.5 : 1 }}>
        {task.title}
      </h3>

      {task.description && <p style={styles.desc}>{task.description}</p>}

      <div style={styles.footer}>
        {dueDate && (
          <span style={{ ...styles.due, color: isOverdue ? 'var(--red)' : 'var(--text2)' }}>
            {isOverdue ? '⚠ ' : '📅 '}{dueDate.toLocaleDateString()}
          </span>
        )}
        <select
          value={task.status}
          onChange={e => onStatusChange(task._id, e.target.value)}
          style={styles.statusSelect}
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {task.user?.name && (
        <div style={styles.owner}>👤 {task.user.name}</div>
      )}
    </div>
  );
}

const styles = {
  card: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '18px 18px', transition: 'border-color 0.2s, transform 0.2s', cursor: 'default' },
  top: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  badges: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  actions: { display: 'flex', gap: 4 },
  actionBtn: { background: 'transparent', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: 16, padding: '2px 6px', borderRadius: 6, transition: 'color 0.2s, background 0.2s' },
  title: { fontSize: 15, fontWeight: 600, marginBottom: 8, lineHeight: 1.4 },
  desc: { fontSize: 13, color: 'var(--text2)', marginBottom: 12, lineHeight: 1.5 },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  due: { fontSize: 12 },
  statusSelect: { background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text2)', padding: '4px 8px', borderRadius: 6, fontSize: 12, cursor: 'pointer' },
  owner: { fontSize: 12, color: 'var(--text2)', marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)' },
};
