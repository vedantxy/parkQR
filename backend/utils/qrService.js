const QRCode = require('qrcode');
const QRPass = require('../models/QRPass');

/**
 * QR Service for Smart Visitor Management System
 * Handles generation of structured, secure QR codes and database persistence.
 */
class QRService {
    /**
     * Generates and stores a Base64 QR code from a structured visitor payload.
     * @param {Object} visitor - The visitor document from the database.
     * @param {Number} expiryMinutes - Expiry time in minutes (default 30).
     * @returns {Promise<Object>} Object containing qrCode (Base64) and expiresAt.
     */
    static async generateAndStoreQR(visitor, expiryMinutes = 30) {
        try {
            const expiresAt = new Date(Date.now() + (expiryMinutes * 60 * 1000));

            // 1. Define structured payload (MANDATORY DESIGN RULE)
            const payload = {
                vId: visitor._id.toString(), // Unique visitor ID
                flat: visitor.flatNumber,    // Destination
                iat: Date.now(),             // Issued At (timestamp)
                exp: expiresAt.getTime()     // Expiry timestamp
            };

            // 2. Convert payload to QR image (Base64)
            // JSON structure improves verification & prevents arbitrary data misuse
            const qrString = JSON.stringify(payload);
            const qrCode = await QRCode.toDataURL(qrString, {
                errorCorrectionLevel: 'H',
                margin: 2
            });

            // 3. Persist QR Pass in Database (Audit + Verification Layer)
            const qrPass = await QRPass.create({
                visitorId: visitor._id,
                qrCode,
                expiresAt
            });

            return { qrCode, expiresAt: qrPass.expiresAt };
        } catch (err) {
            console.error('QR Generation/Storage Error:', err);
            throw new Error('Failed to generate secure QR pass');
        }
    }

    /**
     * Validates a scanned QR payload (Static check)
     * @param {String} scannedData - The JSON string from the QR code.
     */
    static validateFormat(scannedData) {
        try {
            const data = JSON.parse(scannedData);
            if (Date.now() > data.exp) {
                return { valid: false, message: 'QR Code has expired' };
            }
            return { valid: true, data };
        } catch (err) {
            return { valid: false, message: 'Invalid QR Format' };
        }
    }
}

module.exports = QRService;

