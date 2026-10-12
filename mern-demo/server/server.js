const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env')
});

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Student = require('./models/Student');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return cb(null, true);
    }
    cb(new Error('Not allowed by CORS'));
  }
}));
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Backend đang hoạt động!' });
});

// GET - danh sách sinh viên
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    console.error('Lỗi lấy danh sách sinh viên:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST - thêm sinh viên
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = await Student.create(req.body);
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT - cập nhật sinh viên
app.put('/api/students/:id', async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Không tìm thấy sinh viên' });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - xóa sinh viên
app.delete('/api/students/:id', async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Không tìm thấy sinh viên' });
    }
    res.json({ message: 'Đã xóa sinh viên' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

async function startServer() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Không tìm thấy MONGODB_URI trong file .env');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Kết nối MongoDB Atlas thành công');

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server đang chạy tại cổng ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('❌ Không thể khởi động backend:', err.message);
  process.exit(1);
});