// server.js (CommonJS)
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// allow requests from your Live Server (and others). You can restrict origin if you want.
app.use(cors()); 
app.use(express.json());

// Make uploads folder if missing

// ---------- MongoDB ----------
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://kumarvikash6382531071:2200428@cluster0.ftrkjkb.mongodb.net/bbsbec';
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ---------- Mongoose schema ----------
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollno: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  batch: { type: String, required: true },
  branch: { type: String, required: true }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);


// ---------- API route ----------
app.post('/api/students', async (req, res) => {
  try {
    const { name, rollno, phone, email, batch, branch } = req.body;

    if (!name || !rollno || !phone || !email || !batch || !branch) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const student = new Student({
      name, rollno, phone, email, batch, branch
    });

    await student.save();
    return res.json({ ok: true, id: student._id });
  } catch (err) {
    console.error('Save error:', err);
    if (err.code === 11000) return res.status(400).json({ message: 'Roll number already exists' });
    return res.status(500).json({ message: 'Server error' });
  }
});

// Optional: serve your frontend from Express (uncomment if you want)
// app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => console.log(`🚀 Server listening on http://localhost:${PORT}`));
