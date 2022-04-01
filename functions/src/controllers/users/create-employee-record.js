const {
  admin,
  auth,
  usersCollection,
  employeesCollection,
} = require('../../services/firebase-admin');

const createEmployeeRecord = async ({ email, firstName, lastName, userId }) => {
  try {
    const payload = {
      contactNumber: '',
      email: email,
      createdBy: userId,
      linkedUser: userId,
      name: `${firstName} ${lastName}`,
      role: 'employee',
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await employeesCollection.add(payload);
  } catch (ex) {
    console.log('========= error at create employee record =============');
    console.log(ex.response?.data || ex.message);
  }
};

module.exports = createEmployeeRecord;
