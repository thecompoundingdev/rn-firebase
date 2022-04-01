const {
  createInvitedUser,
  updateLinkedUser,
  getUserByEmail,
} = require('../../utils/employee-helpers');

const handleLinkedUser = async ({ empId, email, createdUserId }) => {
  try {
    const { uid: linkedUserId } = await getUserByEmail(email);
    if (createdUserId !== linkedUserId) {
      await updateLinkedUser(empId, linkedUserId);
    }
  } catch (ex) {
    if (ex.code === 'auth/user-not-found') {
      const newUser = await createInvitedUser(email);
      if (newUser) {
        await updateLinkedUser(empId, newUser.uid);
      }
    } else {
      console.log('========= error code =============');
      console.log(ex.code);
      console.log('========= error message =============');
      console.log(ex.message);
    }
  }
};

module.exports = handleLinkedUser;
