const handleLinkedUser = require('./handle-linked-user');

const checkUpdatedEmployee = async (change, context) => {
  const { empId } = context.params;
  const { email: previousEmail } = change.before.data();
  const { email: newEmail, createdBy: createdUserId } = change.after.data();

  if (previousEmail !== newEmail) {
    const params = { empId, email: newEmail, createdUserId };
    await handleLinkedUser(params);
  }

  return null;
};

module.exports = checkUpdatedEmployee;
