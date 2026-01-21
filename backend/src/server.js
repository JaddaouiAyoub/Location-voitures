require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

/**
 * Start Server
 */
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🚗 Car Rental Management System API');
    console.log('='.repeat(50));
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌐 API URL: http://localhost:${PORT}`);
    console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
    console.log('='.repeat(50));
});
