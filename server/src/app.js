const express = require('express');
const cors = require('cors');

const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const learningRoutes = require('./routes/learningRoutes');
const aiRoutes = require('./routes/aiRoutes');
const progressRoutes = require('./routes/progressRoutes');
const offlineRoutes = require('./routes/offlineRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

function createCorsOptions() {
	const clientUrl = process.env.CLIENT_URL;

	return {
		origin(origin, callback) {
			// Requests without an Origin header (health checks, curl, server-to-server)
			// do not need browser CORS permission.
			if (!origin || origin === clientUrl) {
				return callback(null, true);
			}

			const error = new Error('CORS origin is not allowed');
			error.statusCode = 403;
			return callback(error);
		},
		credentials: true,
	};
}

function createApp() {
	const app = express();

	app.use(express.json());
	app.use(cors(createCorsOptions()));

	app.use('/api/health', healthRoutes);
	app.use('/api/auth', authRoutes);
	app.use('/api/assessments', assessmentRoutes);
	app.use('/api/learning-path', learningRoutes);
	app.use('/api/ai', aiRoutes);
	app.use('/api/progress', progressRoutes);
	app.use('/api/offline', offlineRoutes);

	app.use(notFoundHandler);
	app.use(errorHandler);

	return app;
}

module.exports = createApp;
