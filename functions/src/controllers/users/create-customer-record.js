const { admin, customersCollection } = require('../../services/firebase-admin');

const createCustomerRecord = async ({ email, firstName, lastName, userId }) => {
  try {
    const payload = {
      contactNumber: '',
      email: email,
      createdBy: userId,
      linkedUser: userId,
      name: `${firstName} ${lastName}`,
      role: 'customer',
      isActive: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await customersCollection.add(payload);
  } catch (ex) {
    console.log('========= error at create customer record =============');
    console.log(ex.response?.data || ex.message);
  }
};

module.exports = createCustomerRecord;
