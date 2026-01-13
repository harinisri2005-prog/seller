const mongoose = require('mongoose');
require('dotenv').config();

// Connect to user_details database
async function viewUsers() {
    try {
        console.log('🔌 Connecting to MongoDB...\n');

        const userDbConnection = await mongoose.createConnection(
            process.env.USER_DB_URI || 'mongodb://localhost:27017/user_details'
        );

        userDbConnection.on('connected', () => {
            console.log('✅ Connected to user_details database\n');
        });

        userDbConnection.on('error', (err) => {
            console.log('❌ Connection error:', err);
            process.exit(1);
        });

        // Wait for connection
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Count total users
        const userCount = await userDbConnection.db.collection('user').countDocuments();
        console.log(`👥 Total Registered Users: ${userCount}\n`);

        if (userCount === 0) {
            console.log('📝 No users registered yet.');
            console.log('💡 Register a user at: http://localhost:3000/vendor/signup\n');
        } else {
            console.log('📋 Registered Users:\n');
            console.log('='.repeat(80));

            // Fetch all users (without passwords)
            const users = await userDbConnection.db.collection('user').find(
                {},
                { projection: { password: 0 } }
            ).toArray();

            // Display each user
            users.forEach((user, index) => {
                console.log(`\n${index + 1}. User ID: ${user._id}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Shop Name: ${user.shopName}`);
                console.log(`   Owner Name: ${user.ownerName}`);
                console.log(`   Phone: ${user.phone || 'N/A'}`);
                console.log(`   Location: ${user.city || 'N/A'}, ${user.state || 'N/A'} - ${user.pincode || 'N/A'}`);
                console.log(`   Address: ${user.address || 'N/A'}`);
                console.log(`   Status: ${user.status}`);

                // Show KYC documents
                if (user.kycUrls && Object.keys(user.kycUrls).length > 0) {
                    console.log(`   KYC Documents:`);
                    Object.entries(user.kycUrls).forEach(([type, url]) => {
                        console.log(`     - ${type}: ${url.substring(0, 50)}...`);
                    });
                }

                console.log(`   Registered: ${new Date(user.createdAt).toLocaleString()}`);
                console.log('-'.repeat(80));
            });
        }

        console.log('\n✨ Done!\n');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

viewUsers();
