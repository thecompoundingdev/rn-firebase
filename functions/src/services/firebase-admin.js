const admin = require('firebase-admin');
const serviceAccount = require('../configs/serviceAccountKey');

// The Firebase Admin SDK to access Firestore.
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.admin = admin;
exports.db = admin.firestore();
exports.customersCollection = this.db.collection('customers');
exports.employeesCollection = this.db.collection('employees');
exports.usersCollection = this.db.collection('users');
exports.tokensCollection = this.db.collection('tokens');
exports.auth = admin.auth();
