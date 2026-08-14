const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const createApp = require('./app');

const PORT = process.env.PORT || 5000;

async function startServer() {
	await connectDB();

	const app = createApp();

	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`);
	});
}

startServer().catch((err) => {
	console.error('Failed to start server:', err);
	process.exit(1);
});
