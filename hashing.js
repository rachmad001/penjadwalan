require('dotenv').config()
const crypto = require('crypto');
const key = process.env.SECRET_KEY;
const iv = Buffer.from(process.env.IV, 'base64');
const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//Encrypting text
const encrypt = (text) => {
   var cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key, 'base64'), iv);
   var encrypted = cipher.update(text);
   encrypted = Buffer.concat([encrypted, cipher.final()])
   return encrypted.toString('hex');
}

// Decrypting text
const decrypt = (text) => {
   let encryptedText = Buffer.from(text, 'hex');
   let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key, 'base64'), iv);
   let decrypted = decipher.update(encryptedText);
   decrypted = Buffer.concat([decrypted, decipher.final()]);
   return decrypted.toString();
}

const generateString = (length) => {
   let result = '';
   const charactersLength = characters.length;
   for ( let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }

   return result;
}
module.exports = {
    encrypt,
    decrypt,
    generateString
}