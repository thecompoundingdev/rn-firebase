const handleLinkedUser = require('./handle-linked-user');

const checkCreatedCustomer = async (snap, context) => {
  const { custId } = context.params;
  const { email, createdBy: createdUserId } = snap.data();

  const params = { custId, email, createdUserId };
  await handleLinkedUser(params);

  return null;
};

module.exports = checkCreatedCustomer;
