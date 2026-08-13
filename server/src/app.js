const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const learningRoutes = require('./routes/learningRoutes');
const aiRoutes = require('./routes/aiRoutes');
const progressRoutes = require('./routes/progressRoutes');
const offlineRoutes = require('./routes/offlineRoutes');

function createApp() {
	const app = express();

	app.use(express.json());
	app.use(cors());

	app.use('/api/health', healthRoutes);
	app.use('/api/auth', authRoutes);
	app.use('/api/assessments', assessmentRoutes);
	app.use('/api/learning-path', learningRoutes);
	app.use('/api/ai', aiRoutes);
	app.use('/api/progress', progressRoutes);
	app.use('/api/offline', offlineRoutes);

	return app;
}

module.exports = createApp;
