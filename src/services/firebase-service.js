import { getApps, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import {
  addDoc,
  collection,
  connectFirestoreEmulator,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from 'firebase/functions';
import { connectStorageEmulator, getStorage } from 'firebase/storage';

import { firebaseConfig } from '../configs';

const firebaseApps = getApps();
let [firebaseApp] = firebaseApps;

// initialize firebase
if (!firebaseApp) {
  firebaseApp = initializeApp(firebaseConfig);
}

// initialize auth
export const auth = getAuth();
export const db = getFirestore();
export const functions = getFunctions();
export const storage = getStorage();

if (__DEV__) {
  connectAuthEmulator(auth, 'http://localhost:9099');
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectFunctionsEmulator(functions, 'localhost', 5001);
  connectStorageEmulator(storage, 'localhost', 9199);
}

// collections
export const UserColl = collection(db, 'users');
export const CustomerColl = collection(db, 'customers');
export const EmployeeColl = collection(db, 'employees');
export const PoolColl = collection(db, 'pools');
export const JobColl = collection(db, 'jobs');

// docs
export const UserDoc = userID => doc(db, 'users', userID);
export const CustomerDoc = custId => doc(db, 'customers', custId);
export const EmployeeDoc = empId => doc(db, 'employees', empId);
export const PoolDoc = poolId => doc(db, 'pools', poolId);
export const JobDoc = jobId => doc(db, 'jobs', jobId);

export const userService = {
  getCurrentUser: userID => getDoc(UserDoc(userID)),
  addNewUser: (userID, payload) => setDoc(UserDoc(userID), payload),
};

export const customerService = {
  addNewCustomer: payload => addDoc(CustomerColl, payload),
  checkExistingCustomer: (custID, email) =>
    getDocs(
      query(
        CustomerColl,
        where('email', '==', email),
        where('createdBy', '==', custID)
      )
    ),
  updateCustomer: (custId, payload) => updateDoc(CustomerDoc(custId), payload),
  deleteCustomer: custId => deleteDoc(CustomerDoc(custId)),
  fetchCustomersList: custID =>
    getDocs(query(CustomerColl, where('createdBy', '==', custID))),

  fetchAllCustomers: () => getDocs(query(CustomerColl)),
  fetchLinkedCustomersList: custID =>
    getDocs(
      query(
        CustomerColl,
        where('linkedUser', '==', custID),
        where('createdBy', '!=', custID)
      )
    ),
};

export const employeeService = {
  addNewEmployee: payload => addDoc(EmployeeColl, payload),
  updateEmployee: (empID, payload) => updateDoc(EmployeeDoc(empID), payload),
  deleteEmployee: empID => deleteDoc(EmployeeDoc(empID)),
  checkExistingEmployee: (empID, email) =>
    getDocs(
      query(
        EmployeeColl,
        where('email', '==', email),
        where('createdBy', '==', empID)
      )
    ),
  fetchEmployeesList: empID =>
    getDocs(query(EmployeeColl, where('createdBy', '==', empID))),
  fetchAllEmployees: () => getDocs(query(EmployeeColl)),
  fetchLinkedEmployeesList: empID =>
    getDocs(
      query(
        EmployeeColl,
        where('linkedUser', '==', empID),
        where('createdBy', '!=', empID)
      )
    ),
};

export const poolService = {
  fetchAllPools: () => getDocs(query(PoolColl)),
  fetchMyPools: custID =>
    getDocs(query(PoolColl, where('createdBy', '==', custID))),
  addNewPool: payload => addDoc(PoolColl, payload),
  updatePool: (poolID, payload) => updateDoc(PoolDoc(poolID), payload),
  fetchEmployeePools: empID =>
    getDocs(query(PoolColl, where('maintenanceEmployee', '==', empID))),
  getPoolDetails: poolID => getDoc(PoolDoc(poolID)),
};

export const jobService = {
  addNewJob: payload => addDoc(JobColl, payload),
  fetchMaintenance: userID =>
    getDocs(query(JobColl, where('customer', '==', userID))),
};

export const functionsService = {
  resetPasswordWithToken: httpsCallable(functions, 'resetPasswordWithToken'),
};
