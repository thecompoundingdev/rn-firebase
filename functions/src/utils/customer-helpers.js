const { customAlphabet } = require('nanoid');
const {
  admin,
  auth,
  customersCollection,
  usersCollection,
} = require('../services/firebase-admin');

exports.getRandomPassword = size =>
  customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', size || 21)();

exports.getUserByEmail = email => auth.getUserByEmail(email);
exports.getUserById = uid => auth.getUser(uid);

exports.updateLinkedUser = async (contactId, linkedUserId) => {
  try {
    await customersCollection
      .doc(contactId)
      .update({ linkedUser: linkedUserId });
  } catch (ex) {
    console.log('========= failed to update linked user =============');
    console.log(ex.message);
  }
};

exports.createInvitedUser = async email => {
  try {
    const payload = { email, password: this.getRandomPassword() };
    const newUser = await auth.createUser(payload);
    await usersCollection.doc(newUser.uid).set({
      email: payload.email,
      role: 'customer',
      isInvited: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return newUser;
  } catch (ex) {
    console.log('========= failed to create new user =============');
    console.log(ex.message);
    return null;
  }
};
