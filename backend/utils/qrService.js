const QRCode = require('qrcode');
const QRPass = require('../models/QRPass');
const crypto = require('crypto');

/**
 * QR Service for Smart Visitor Management System
 * Handles generation of secure, token-based QR codes.
 */
class QRService {
    /**
     * Generates and stores a unique token-based QR code.
     * @param {Object} visitor - The visitor document.
     * @param {Number} expiryMinutes - Expiry time.
     * @returns {Promise<Object>} 
     */
    static async generateAndStoreQR(visitor, expiryMinutes = 60) {
        try {
            const expiresAt = new Date(Date.now() + (expiryMinutes * 60 * 1000));
            
            // 1. Generate a secure random token
            const token = crypto.randomBytes(32).toString('hex');

            // 2. Convert raw token to QR Base64
            // We only put the token in the QR to prevent data leakage and tampering
            const qrCode = await QRCode.toDataURL(token);

            // 3. Persist QR Pass record
            await QRPass.create({
                visitorId: visitor._id,
                qrCode,
                token,
                expiresAt
            });

            return { qrCode, expiresAt, token };

        } catch (err) {
            console.error('QR Generation Error:', err);
            throw new Error('Failed to generate secure QR pass');
        }
    }

    /**
     * Basic format check
     */
    static validateFormat(scannedData) {
        if (!scannedData || typeof scannedData !== 'string') {
            return { valid: false, message: 'Invalid scanned data format' };
        }
        // Our tokens are hex strings of 64 chars (32 bytes)
        if (scannedData.length < 32) {
             return { valid: false, message: 'Invalid QR Token structure' };
        }
        return { valid: true };
    }
}

module.exports = QRService;

