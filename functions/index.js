require('dotenv').config();
const functions = require('firebase-functions');

const checkCreatedCustomer = require('./src/controllers/customers/check-created-customer');
const checkUpdatedCustomer = require('./src/controllers/customers/check-updated-customer');
const checkCreatedEmployee = require('./src/controllers/employees/check-created-employee');
const checkUpdatedEmployee = require('./src/controllers/employees/check-updated-employee');
const checkCreatedUser = require('./src/controllers/users/check-created-user');

const { auth, tokensCollection } = require('./src/services/firebase-admin');

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});

exports.resetPasswordWithToken = functions.https.onCall(
  async (data, context) => {
    const { token, password } = data;

    if (!token || !password) {
      throw new functions.https.HttpsError(
        400,
        'Token or password is missing!'
      );
    }

    const doc = await tokensCollection.where('token', '==', token).get();
    if (!doc) {
      throw new functions.https.HttpsError(
        404,
        'Data with the given token is not found in our records!'
      );
    }

    await auth.updateUser(doc.userId, { password: password });
    return { success: true };
  }
);

exports.checkNewCustomer = functions.firestore
  .document('customers/{custId}')
  .onCreate(checkCreatedCustomer);

exports.checkExistingCustomer = functions.firestore
  .document('customers/{custId}')
  .onUpdate(checkUpdatedCustomer);

exports.checkNewEmployee = functions.firestore
  .document('employees/{empId}')
  .onCreate(checkCreatedEmployee);

exports.checkExistingEmployee = functions.firestore
  .document('employees/{empId}')
  .onUpdate(checkUpdatedEmployee);

exports.checkNewUser = functions.firestore
  .document('users/{userId}')
  .onCreate(checkCreatedUser);
