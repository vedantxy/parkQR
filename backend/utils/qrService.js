const QRCode = require('qrcode');
const QRPass = require('../models/QRPass');

/**
 * QR Service for Smart Visitor Management System
 * Handles generation of structured, secure QR codes and database persistence.
 */
class QRService {
    /**
     * Generates and stores a Base64 QR code from a structured visitor payload.
     * @param {Object} visitor - The visitor document.
     * @param {Number} expiryMinutes - Expiry time.
     * @param {Boolean} isMock - Whether to bypass DB storage.
     * @returns {Promise<Object>} 
     */
    static async generateAndStoreQR(visitor, expiryMinutes = 30, isMock = false) {
        try {
            const expiresAt = new Date(Date.now() + (expiryMinutes * 60 * 1000));

            // 1. Define structured payload
            const payload = {
                vId: visitor._id.toString(),
                flat: visitor.flatNumber,
                iat: Date.now(),
                exp: expiresAt.getTime()
            };

            // 2. Convert to QR Base64
            const qrString = JSON.stringify(payload);
            const qrCode = await QRCode.toDataURL(qrString);

            // 3. Persist only if NOT mock
            if (!isMock) {
                await QRPass.create({
                    visitorId: visitor._id,
                    qrCode,
                    expiresAt
                });
            }

            return { qrCode, expiresAt };

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

