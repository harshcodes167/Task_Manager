import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filters, setFilters] = useState({ status: '', priority: '' });

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      const res = await api.get('/tasks', { params });
      setTasks(res.data.data.tasks);
    } catch (err) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleCreate = async (data) => {
    setSaving(true);
    try {
      await api.post('/tasks', data);
      toast.success('Task created!');
      setModalOpen(false);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (data) => {
    setSaving(true);
    try {
      await api.put(`/tasks/${editTask._id}`, data);
      toast.success('Task updated!');
      setModalOpen(false);
      setEditTask(null);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Task deleted');
      setTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/tasks/${id}`, { status });
      setTasks(prev => prev.map(t => t._id === id ? { ...t, status } : t));
      toast.success('Status updated');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const openEdit = (task) => { setEditTask(task); setModalOpen(true); };
  const openCreate = () => { setEditTask(null); setModalOpen(true); };

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    progress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.main}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Good day, {user?.name?.split(' ')[0]} 👋</h1>
            <p style={{ color: 'var(--text2)', marginTop: 4 }}>Here's your task overview</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>+ New Task</button>
        </div>

        {/* Stats */}
        <div style={styles.statsGrid}>
          {[
            { label: 'Total Tasks', value: stats.total, color: 'var(--accent)' },
            { label: 'Todo', value: stats.todo, color: 'var(--blue)' },
            { label: 'In Progress', value: stats.progress, color: 'var(--yellow)' },
            { label: 'Completed', value: stats.done, color: 'var(--green)' },
          ].map(stat => (
            <div key={stat.label} style={styles.statCard}>
              <div style={{ ...styles.statValue, color: stat.color }}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={styles.filters}>
          <select className="filter-select" value={filters.status}
            onChange={e => setFilters({ ...filters, status: e.target.value })}
            style={styles.filterSelect}>
            <option value="">All Status</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select value={filters.priority}
            onChange={e => setFilters({ ...filters, priority: e.target.value })}
            style={styles.filterSelect}>
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {(filters.status || filters.priority) && (
            <button className="btn btn-ghost btn-sm" onClick={() => setFilters({ status: '', priority: '' })}>Clear Filters</button>
          )}
        </div>

        {/* Task Grid */}
        {loading ? (
          <div style={styles.center}><div className="spinner" style={{width:32,height:32}} /></div>
        ) : tasks.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>📋</div>
            <h3 style={styles.emptyTitle}>No tasks yet</h3>
            <p style={styles.emptySub}>Create your first task to get started</p>
            <button className="btn btn-primary" onClick={openCreate} style={{ marginTop: 16 }}>+ Create Task</button>
          </div>
        ) : (
          <div style={styles.grid}>
            {tasks.map(task => (
              <TaskCard key={task._id} task={task} onEdit={openEdit} onDelete={handleDelete} onStatusChange={handleStatusChange} />
            ))}
          </div>
        )}
      </div>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTask(null); }}
        onSubmit={editTask ? handleUpdate : handleCreate}
        task={editTask}
        loading={saving}
      />
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: 'var(--bg)' },
  main: { maxWidth: 1200, margin: '0 auto', padding: '32px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 },
  title: { fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 700 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 },
  statCard: { background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 22px' },
  statValue: { fontSize: 32, fontFamily: 'var(--font-head)', fontWeight: 700, lineHeight: 1 },
  statLabel: { fontSize: 13, color: 'var(--text2)', marginTop: 6, fontWeight: 500 },
  filters: { display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' },
  filterSelect: { background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)', padding: '8px 14px', borderRadius: 8, fontSize: 14, cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 },
  center: { display: 'flex', justifyContent: 'center', padding: '60px 0' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0' },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontFamily: 'var(--font-head)', fontSize: 22, fontWeight: 700, marginBottom: 8 },
  emptySub: { color: 'var(--text2)', fontSize: 15 },
};
