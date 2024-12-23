import crypto from 'crypto';
// Function to encrypt the token

function encryptToken(token, password) {
    return new Promise((resolve, reject) => {
        try {
            const iv = crypto.randomBytes(16); // Initialization vector
            const key = crypto.scryptSync(password, 'salt', 32); // Derive key from password
            const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
            let encrypted = cipher.update(token, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            resolve(iv.toString('hex') + ':' + encrypted); // Prepend IV for decryption
        } catch (error) {
            reject(new Error('Encryption failed: ' + error.message));
        }
    });
}

// Function to decrypt the token
function decryptToken(encryptedToken, password) {
    return new Promise((resolve, reject) => {
        try {
            const parts = encryptedToken.split(':');
            const iv = Buffer.from(parts.shift(), 'hex'); // Extract IV
            const encryptedText = Buffer.from(parts.join(':'), 'hex');
            const key = crypto.scryptSync(password, 'salt', 32);
            const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
            let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            resolve(decrypted);
        } catch (error) {
            reject(new Error('Decryption failed: ' + error.message));
        }
    });
}

// console.log("here: ", await decryptToken("5c1ad7faecdc49b93b43427e57ffbbd3:2869a786ea5fc43d6faa9ea8ad64fc6c47d7482b0910457ad2de7a093c7605d7b292ec8ab9080fe576726d050ccd5348", "q;q"))

export {decryptToken, encryptToken};