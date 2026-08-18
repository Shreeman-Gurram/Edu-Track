import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './src/routes/aiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Add Root Route
app.get('/', (req, res) => {
  res.send('AI Tutor Backend Server is Running!');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: "ok", message: "AI Tutor service is running." });
});

// Mount AI Module Routes
app.use('/api/ai', aiRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});