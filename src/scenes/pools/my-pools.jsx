import { auth, poolService } from '../../services/firebase-service';
import { PoolList } from './list';

export const MyPools = () => {
  const { currentUser: user } = auth;

  const fetchData = async () => {
    const resultData = [];

    try {
      const [applicationsSnapshot] = await Promise.all([
        poolService.fetchMyPools(user.uid),
      ]);

      applicationsSnapshot.forEach(doc => {
        resultData.push({ ...doc.data(), contactId: doc.id });
      });
    } catch (ex) {
      console.error(ex.message);
    }

    return resultData;
  };

  return (
    <>
      <PoolList fetchData={fetchData} title="My Pools" />
    </>
  );
};
