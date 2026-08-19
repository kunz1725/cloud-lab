import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'https://urban-dollop-7vxvj7gq99gg2rvg4-5000.app.github.dev/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });

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
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ studentId: '', name: '', email: '' });
    fetchStudents();
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchStudents();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Quản lý sinh viên</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input name="studentId" placeholder="MSSV" value={form.studentId} onChange={handleChange} required />
        <input name="name" placeholder="Họ tên" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <button type="submit">Thêm sinh viên</button>
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