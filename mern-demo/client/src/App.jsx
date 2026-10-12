import { useState, useEffect } from 'react';
import './App.css';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/students`;
const emptyForm = { studentId: '', name: '', email: '' };

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    const method = editingId ? 'PUT' : 'POST';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm(emptyForm);
    setEditingId(null);
    fetchStudents();
  };

  const handleEdit = (sv) => {
    setEditingId(sv._id);
    setForm({ studentId: sv.studentId, name: sv.name, email: sv.email });
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (editingId === id) handleCancel();
    fetchStudents();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Quản lý sinh viên</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input name="studentId" placeholder="MSSV" value={form.studentId} onChange={handleChange} required />
        <input name="name" placeholder="Họ tên" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <button type="submit">{editingId ? 'Lưu' : 'Thêm sinh viên'}</button>
        {editingId && (
          <button type="button" onClick={handleCancel}>Hủy</button>
        )}
      </form>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>MSSV</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.map((sv) => (
            <tr key={sv._id}>
              <td>{sv.studentId}</td>
              <td>{sv.name}</td>
              <td>{sv.email}</td>
              <td>
                <button onClick={() => handleEdit(sv)}>Sửa</button>{' '}
                <button onClick={() => handleDelete(sv._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;