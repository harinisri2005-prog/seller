const User = require('../models/User');

exports.signup = async (req, res) => {
    const { email, password, shopName, ownerName, phone, state, city, pincode, address, kycUrls } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Create new user
        const newUser = new User({
            email,
            password, // Will be hashed by the pre-save hook
            shopName,
            ownerName,
            phone,
            state,
            city,
            pincode,
            address,
            kycUrls,
            status: 'APPROVED' // Auto-approve
        });

        await newUser.save();

        // Return user data (without password)
        const userResponse = {
            id: newUser._id,
            email: newUser.email,
            shop_name: newUser.shopName,
            owner_name: newUser.ownerName,
            phone: newUser.phone,
            state: newUser.state,
            city: newUser.city,
            pincode: newUser.pincode,
            address: newUser.address,
            status: newUser.status
        };

        res.status(201).json({
            message: 'Signup successful',
            user: userResponse,
            token: 'token-' + newUser._id,
            vendorStatus: newUser.status,
            vendor: userResponse
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: error.message || 'Signup failed' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Return user data (without password)
        const userResponse = {
            id: user._id,
            email: user.email,
            shop_name: user.shopName,
            owner_name: user.ownerName,
            phone: user.phone,
            state: user.state,
            city: user.city,
            pincode: user.pincode,
            address: user.address,
            status: user.status
        };

        res.status(200).json({
            message: 'Login successful',
            token: 'token-' + user._id,
            vendorStatus: user.status,
            vendor: userResponse
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
};
