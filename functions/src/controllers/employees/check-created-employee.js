const handleLinkedUser = require('./handle-linked-user');

const checkCreatedEmployee = async (snap, context) => {
  const { empId } = context.params;
  const { email, createdBy: createdUserId } = snap.data();

  const params = { empId, email, createdUserId };
  await handleLinkedUser(params);

  return null;
};

module.exports = checkCreatedEmployee;
