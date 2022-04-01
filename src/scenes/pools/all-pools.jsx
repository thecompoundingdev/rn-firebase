import { auth, poolService } from '../../services/firebase-service';
import { PoolList } from './list';

export const AllPools = () => {
  const { currentUser: user } = auth;

  const fetchData = async () => {
    const userContacts = [];

    try {
      const [applicationsSnapshot] = await Promise.all([
        poolService.fetchAllPools(user.uid),
      ]);

      applicationsSnapshot.forEach(doc => {
        userContacts.push({ ...doc.data(), contactId: doc.id });
      });
    } catch (ex) {
      console.error(ex.message);
    }

    return userContacts;
  };

  return (
    <>
      <PoolList fetchData={fetchData} hideCreate title="Pools" />
    </>
  );
};
