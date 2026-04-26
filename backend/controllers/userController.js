const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { isDBConnected, mockStore } = require('../utils/mockData');
const { sendOTP } = require('../utils/smsService');

const otpStore = new Map(); // In-memory OTP store for demo: phone -> { otp, expires }

/**
 * @desc    Standard Enterprise Login
 * @route   POST /api/users/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`🔐 Login Attempt: ${email} (DB Connected: ${isDBConnected()})`);

    if (!isDBConnected()) {
        console.log('⚠️ Running in Mock Security Mode');
        const cleanEmail = email?.trim().toLowerCase();
        const mockUser = mockStore.users.find(u => 
            u.email.toLowerCase() === cleanEmail && 
            u.password === password.trim()
        );
        
        if (mockUser) {
            console.log(`✅ Mock Auth Success for ${cleanEmail}`);
            return res.status(200).json({
                success: true,
                token: 'mock-jwt-token-pro-4455',
                user: { id: mockUser._id, name: mockUser.name, role: mockUser.role }
            });
        }
        console.log(`❌ Mock Auth Failed for ${cleanEmail}. Check password: [${password}]`);
        return res.status(401).json({ success: false, message: 'Invalid Mock Credentials' });
    }

    // 1. Check if user exists
    console.log('🌐 Checking Production DB...');
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid Credentials' });
    }

    // 2. Validate password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid Credentials' });
    }

    // 3. Generate JWT
    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '8h' }
    );

    res.status(200).json({
        success: true,
        token,
        user: { id: user._id, name: user.name, role: user.role }
    });
  } catch (err) {
    console.error('🔥 CRITICAL AUTH ERROR:', err);
    res.status(500).json({ success: false, message: `Auth Error: ${err.message}` });
  }
};

/**
 * @desc    Send OTP for Mobile Login
 * @route   POST /api/users/send-otp
 */
exports.sendOtp = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) return res.status(400).json({ success: false, message: 'Phone is required' });
        
        const otp = await sendOTP(phone);
        otpStore.set(phone, { otp: otp.toString(), expires: Date.now() + 5 * 60000 }); // 5 min
        
        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }
};

/**
 * @desc    Verify OTP and Login
 * @route   POST /api/users/verify-otp
 */
exports.verifyOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        const stored = otpStore.get(phone);
        
        // Demo backdoor: 123456 always works
        if (otp !== '123456') {
            if (!stored || stored.expires < Date.now() || stored.otp !== otp) {
                return res.status(401).json({ success: false, message: 'Invalid or expired OTP' });
            }
        }
        
        otpStore.delete(phone);
        
        const token = jwt.sign(
            { id: `res-${phone}`, role: 'resident' },
            process.env.JWT_SECRET || 'fallback_secret',
            { expiresIn: '8h' }
        );
        
        res.status(200).json({
            success: true,
            token,
            user: { id: `res-${phone}`, name: 'Verified Resident', role: 'resident', phone }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'OTP Verification Failed' });
    }
};
