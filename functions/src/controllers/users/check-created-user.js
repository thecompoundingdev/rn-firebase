const { tokensCollection } = require('../../services/firebase-admin');
const { triggerMail } = require('../../services/mailer');
const { getDynamicLinks } = require('../../utils/dynamic-links');

const createCustomerRecord = require('./create-customer-record');
const createEmployeeRecord = require('./create-employee-record');

const checkCreatedUser = async (snap, context) => {
  const { userId } = context.params;
  const userData = snap.data();

  try {
    if (userData.isInvited) {
      const { shortLink } = await getDynamicLinks();
      const splitted = shortLink.split('/');
      const token = splitted[splitted.length - 1];

      // split token and store it with email
      await tokensCollection.add({ token, email: userData.email, userId });

      await triggerMail({
        to: userData.email,
        subject: 'name-here invites you to collaborate/anything',
        html: `Please reset your password using the below link!<br />${shortLink}`,
      });
    } else {
      if (userData.role === 'employee') {
        await createEmployeeRecord({ userId, ...userData });
      }
      if (userData.role === 'customer') {
        await createCustomerRecord({ userId, ...userData });
      }
    }
  } catch (ex) {
    console.log('========= error at check created user =============');
    console.log(ex.response?.data || ex.message);
  }

  return null;
};

module.exports = checkCreatedUser;
