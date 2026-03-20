const crypto = require('crypto');

function base64url(buffer) {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

const keyPair = crypto.generateKeyPairSync('ed25519');

console.log('VAPID Keys Generated:');
console.log('====================');
console.log('VAPID_PUBLIC_KEY=' + base64url(keyPair.publicKey.export({ format: 'der', type: 'spki' })));
console.log('VAPID_PRIVATE_KEY=' + base64url(keyPair.privateKey.export({ format: 'der', type: 'pkcs8' })));
console.log('');
console.log('Add these to your .env file');
