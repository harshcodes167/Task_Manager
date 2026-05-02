import { useState, useEffect } from 'react';

export default function TaskModal({ isOpen, onClose, onSubmit, task, loading }) {
  const [form, setForm] = useState({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '' });

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      });
    } else {
      setForm({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '' });
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...form };
    if (!data.dueDate) delete data.dueDate;
    onSubmit(data);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} className="fade-in" onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>{task ? 'Edit Task' : 'New Task'}</h2>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input type="text" placeholder="What needs to be done?" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows={3} placeholder="Optional details..." value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              style={{ resize: 'vertical' }} />
          </div>
          <div style={styles.row}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Priority</label>
              <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
          </div>
          <div style={styles.actions}>
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <><span className="spinner" style={{width:14,height:14}} /> Saving...</> : (task ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 16, backdropFilter: 'blur(4px)' },
  modal: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: '28px 28px', width: '100%', maxWidth: 500 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontFamily: 'var(--font-head)', fontSize: 20, fontWeight: 700 },
  closeBtn: { background: 'transparent', border: 'none', color: 'var(--text2)', fontSize: 18, cursor: 'pointer', padding: 4, lineHeight: 1 },
  row: { display: 'flex', gap: 16 },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 },
};
