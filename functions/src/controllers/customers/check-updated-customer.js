const handleLinkedUser = require('./handle-linked-user');

const checkUpdatedCustomer = async (change, context) => {
  const { custId } = context.params;
  const { email: previousEmail } = change.before.data();
  const { email: newEmail, createdBy: createdUserId } = change.after.data();

  if (previousEmail !== newEmail) {
    const params = { custId, email: newEmail, createdUserId };
    await handleLinkedUser(params);
  }

  return null;
};

module.exports = checkUpdatedCustomer;
