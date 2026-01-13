const mongoose = require('mongoose');
require('dotenv').config();

// Test connection to user_details database
async function testConnection() {
    try {
        const userDbConnection = await mongoose.createConnection(
            process.env.USER_DB_URI || 'mongodb://localhost:27017/user_details'
        );

        userDbConnection.on('connected', () => {
            console.log('✅ Successfully connected to user_details database');
        });

        userDbConnection.on('error', (err) => {
            console.log('❌ MongoDB connection error:', err);
        });

        // Wait a bit to see the connection status
        setTimeout(async () => {
            // List all collections in the database
            const collections = await userDbConnection.db.listCollections().toArray();
            console.log('\n📁 Collections in user_details database:');
            collections.forEach(col => console.log(`   - ${col.name}`));

            // Count documents in user collection
            const userCount = await userDbConnection.db.collection('user').countDocuments();
            console.log(`\n👥 Total registered users: ${userCount}`);

            // Show sample user (without password)
            if (userCount > 0) {
                const sampleUser = await userDbConnection.db.collection('user').findOne({}, {
                    projection: { password: 0 }
                });
                console.log('\n📄 Sample user document:');
                console.log(JSON.stringify(sampleUser, null, 2));
            }

            process.exit(0);
        }, 2000);

    } catch (error) {
        console.error('❌ Connection failed:', error);
        process.exit(1);
    }
}

testConnection();
