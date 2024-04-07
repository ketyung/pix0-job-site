import crypto from 'crypto';
const CryptoJS = require('crypto-js');

const keySize = 256
const iterations = 100

export const encrypt = (msg: string, pass: string) => {
    try 
    {
    
        const salt = CryptoJS.lib.WordArray.random(128 / 8);
  
        const key = CryptoJS.PBKDF2(pass, salt, {
            keySize: keySize / 32,
            iterations: iterations,
        });
    
        const iv = CryptoJS.lib.WordArray.random(128 / 8);
    
        const encrypted = CryptoJS.AES.encrypt(msg, key, {
            iv: iv,
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC,
        });
  
       const transitmessage =
          salt.toString() + iv.toString() + encrypted.toString()
      
       return transitmessage
    } 
    catch (error) {
       return undefined
    }
}


export const decrypt = (transitmessage: string, pass: string) => {
    try 
    {
       
        const salt = CryptoJS.enc.Hex.parse(transitmessage.substring(0, 32));
        const iv = CryptoJS.enc.Hex.parse(transitmessage.substring(32, 64));
        const encrypted = transitmessage.substring(64);
       
        const key = CryptoJS.PBKDF2(pass, salt, {
            keySize: keySize / 32,
            iterations: iterations,
        });
    
        const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
            iv: iv,padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC,
        }).toString(CryptoJS.enc.Utf8);

        
        return decrypted;

    } 
    catch (error) {
      return undefined;
    }
}
  
export function sha256(input?: string): string {

    // Create a hash object using the SHA-256 algorithm
    const hash = crypto.createHash('sha256');

    // Update the hash object with the input data
    hash.update(input ?? "");

    // Calculate the digest (hash) of the input data as a hexadecimal string
    const hashedValue = hash.digest('hex');

    // Return the hashed value
    return hashedValue;
}