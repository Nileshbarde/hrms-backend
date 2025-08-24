// generate-secret.js
const crypto = require("crypto");

// 64 bytes random secret, base64 encoded
const secret = crypto.randomBytes(64).toString("base64");

console.log("Your new JWT_SECRET:");
console.log(secret);
