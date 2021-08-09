const firebase = require('firebase')
const admin = require("firebase-admin");
const {storageBucket} = require('./config')
const serviceAccount = require('./serviceAccount.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: storageBucket
});

const db = admin.firestore();

exports.db = db;
exports.bucket = admin.storage().bucket();

exports.users = db.collection('users');
exports.files = db.collection('files');