import React, {
  useState,
  useContext,
  createContext,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import { signOut } from 'firebase/auth';
import PropTypes from 'prop-types';

import { auth, userService } from './firebase-service';

export const AuthenticatedUserContext = createContext();

export function AuthenticatedUserProvider({ children }) {
  const [user, setUser] = useState();
  const [currentUser, setCurrentUser] = useState(null);
  const [loadStatus, setLoadStatus] = useState(true);

  const value = useMemo(
    () => ({ user, setUser, loadStatus, currentUser }),
    [user, currentUser, loadStatus]
  );

  const getFirestoreUser = async userID => {
    try {
      const firestoreUser = await userService.getCurrentUser(userID);
      const userData = firestoreUser.data();
      userData.isAdmin = userData.role === 'admin';
      userData.isManager = userData.role === 'manager';
      userData.isEmployee = userData.role === 'employee';
      userData.isCustomer = userData.role === 'customer';
      setCurrentUser(userData);
    } catch (ex) {
      console.error(ex.message);
      signOut(auth).catch(() => {});
    } finally {
      setLoadStatus(false);
    }
  };

  useEffect(() => {
    if (user) {
      getFirestoreUser(user.uid);
    } else if (user !== undefined) {
      setCurrentUser(null);
      setLoadStatus(false);
    }
  }, [user]);

  return (
    <AuthenticatedUserContext.Provider value={value}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
}

AuthenticatedUserProvider.propTypes = {
  children: PropTypes.element,
};

export const useUser = () => useContext(AuthenticatedUserContext);
