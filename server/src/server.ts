import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Vihaan Tax Solutions API Server running on port ${PORT}`);
    console.log(`🌐 Base URL: http://localhost:${PORT}/api/v1`);
    console.log(`======================================================\n`);
  });
});
