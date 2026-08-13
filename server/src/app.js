const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');

function createApp() {
	const app = express();

	app.use(express.json());
	app.use(cors());

	app.use('/api/health', healthRoutes);
	app.use('/api/auth', authRoutes);

	return app;
}

module.exports = createApp;
