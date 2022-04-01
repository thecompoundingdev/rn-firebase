import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Button,
  Divider,
  Input,
  // useStyleSheet,
  TopNavigation,
  TopNavigationAction,
  Text,
} from '@ui-kitten/components';
import { Formik } from 'formik';
import { serverTimestamp } from 'firebase/firestore';

import { DeleteIcon, MenuIcon, NotificationIcon } from '../../components/icons';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import {
  auth,
  employeeService,
  poolService,
} from '../../services/firebase-service';
import { useUser } from '../../services/auth-service';
import { newCustomerApplicationSchema } from '../../utils/validations';
import { EmailIcon, PersonIcon } from '../../utils/extra/icons';
import { KeyboardAvoidingView } from '../../utils/extra/3rd-party.js';
import { RadioComp } from '../../components/radio-component';
import { SelectComp } from '../../components/select-component';

const initialState = {
  isLoader: false,

  // existing contact's data
  contactId: '',
  isActive: false,
  type: '',
  purificationSystem: '',
  maintenanceDay: '',
  maintenanceEmployee: '',
};

const radioOptions = [
  { label: 'Pool', value: 'pool' },
  { label: 'Hot Tub', value: 'hot tub' },
];

const purificationSystems = [
  { label: 'Chlorine', value: 'chlorine' },
  { label: 'Salt', value: 'salt' },
  { label: 'UV', value: 'UV' },
  { label: 'Ozone', value: 'ozone' },
  { label: 'Mineral', value: 'mineral' },
  { label: 'AOP', value: 'AOP' },
];

const weekDays = [
  { label: 'Monday', value: 'monday' },
  { label: 'Tuesday', value: 'tuesday' },
  { label: 'Wednesday', value: 'wednesday' },
  { label: 'Thursday', value: 'thursday' },
  { label: 'Friday', value: 'friday' },
  { label: 'Saturday', value: 'saturday' },
  { label: 'Sunday', value: 'sunday' },
];

export const PoolDetails = () => {
  const { currentUser } = useUser();
  const navigation = useNavigation();
  const route = useRoute();
  // const styles = useStyleSheet(themedStyles);
  const styles = themedStyles;

  const [state, setState] = useState(initialState);
  const [employees, setEmployees] = useState([]);
  const [errorState, setErrorState] = useState({});

  const { height } = Dimensions.get('window');
  const { currentUser: user } = auth;
  const { item: existingItem } = route.params || {};

  const { isAdmin, isManager } = currentUser;

  const initialValues = useMemo(
    () => ({
      name: existingItem?.name || '',
      street: existingItem?.street || '',
      city: existingItem?.city || '',
      state: existingItem?.state || '',
      zipcode: existingItem?.zipcode || '',
      volume: existingItem?.volume || '',
    }),
    [route.params]
  );

  const fetchEmployeesList = async () => {
    const userContacts = [];

    try {
      const ownContactsSnapshot = await employeeService.fetchAllEmployees();

      ownContactsSnapshot.forEach(doc => {
        userContacts.push({ ...doc.data(), contactId: doc.id });
      });

      const data = userContacts.map(c => ({
        value: c.linkedUser,
        label: c.name,
      }));
      data.unshift({ value: '', label: 'Select an employee' });
      setEmployees(data);
    } catch (ex) {
      console.error(ex.message);
    }
  };

  useEffect(() => {
    if (isAdmin || isManager) {
      fetchEmployeesList();
    }
  }, [isAdmin, isManager]);

  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (existingItem) {
      setState(prev => ({
        ...prev,
        contactId: existingItem.contactId,
        type: existingItem.type,
        purificationSystem: existingItem.purificationSystem,
        maintenanceEmployee: existingItem.maintenanceEmployee || '',
        maintenanceDay: existingItem.maintenanceDay || weekDays[0].value,
      }));
    }
  }, []);

  const createContact = async values => {
    const { name, street, city, state: addressState, zipcode, volume } = values;

    if (!state.type) {
      setErrorState({ type: 'Please select the type' });
      return;
    }

    if (!state.purificationSystem) {
      setErrorState({ purificationSystems: 'Please select one' });
      return;
    }

    const payload = {
      createdBy: user.uid,
      name,
      street,
      city,
      state: addressState,
      zipcode,
      type: state.type,
      purificationSystem: state.purificationSystem,
      volume,

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      setState(prev => ({ ...prev, isLoader: true }));
      await poolService.addNewPool(payload);
      Alert.alert('Saved successfully!');
      goBack();
    } catch (error) {
      Alert.alert('Failed to save the contact!');
      setState(prev => ({ ...prev, isLoader: false }));
    }
  };

  const updateContact = async values => {
    if (!state.maintenanceDay) {
      setErrorState({ maintenanceDay: 'Please select a maintenance day' });
      return;
    }

    if (!state.maintenanceEmployee) {
      setErrorState({ maintenanceEmployee: 'Please select the employee' });
      return;
    }

    const payload = {
      maintenanceDay: state.maintenanceDay,
      maintenanceEmployee: state.maintenanceEmployee,
      updatedBy: user.uid,
      updatedAt: serverTimestamp(),
    };

    try {
      setState(prev => ({ ...prev, isLoader: true }));
      await poolService.updatePool(state.contactId, payload);
      goBack();
    } catch (ex) {
      Alert.alert('Failed to update the contact!');
    } finally {
      setState(prev => ({ ...prev, isLoader: false }));
    }
  };

  const deleteContact = async () => {
    try {
      setState(prev => ({ ...prev, isLoader: true }));
      // await poolService.deletePool
      goBack();
    } catch (ex) {
      Alert.alert('Failed to delete the contact!');
    } finally {
      setState(prev => ({ ...prev, isLoader: false }));
    }
  };

  const renderDrawerAction = () => (
    <TopNavigationAction icon={MenuIcon} onPress={navigation.toggleDrawer} />
  );

  const renderNotificationAction = () => (
    <TopNavigationAction icon={NotificationIcon} />
    // <TopNavigationAction icon={DeleteIcon} onPress={deleteContact} />
  );

  const handlePurificationSystem = (option, isChecked) => {
    setState(prev => ({
      ...prev,
      purificationSystem:
        prev.purificationSystem === option.value ? '' : option.value,
    }));
  };

  const handleType = (option, isChecked) => {
    setState(prev => ({
      ...prev,
      type: prev.type === option.value ? '' : option.value,
    }));
  };

  const handleValueChange = (name, value) => {
    setState(prev => ({ ...prev, [name]: value }));
  };

  return (
    <SafeAreaLayout style={styles.safeArea} insets="top">
      <KeyboardAvoidingView>
        <TopNavigation
          title={existingItem ? 'Pool details' : 'New pool'}
          accessoryLeft={renderDrawerAction}
          accessoryRight={renderNotificationAction}
        />

        <Divider />

        <View style={styles.container}>
          {state.isLoader ? (
            <View style={{ height: height / 1.3, justifyContent: 'center' }}>
              <ActivityIndicator size="small" style={{ alignSelf: 'center' }} />
            </View>
          ) : (
            <Formik
              initialValues={initialValues}
              validationSchema={newCustomerApplicationSchema}
              onSubmit={existingItem ? updateContact : createContact}
            >
              {({
                values,
                touched,
                errors,
                handleChange,
                handleSubmit,
                handleBlur,
              }) => (
                <>
                  <View style={styles.formContainer}>
                    <Input
                      accessoryLeft={PersonIcon}
                      caption={(touched.name && errors.name) || ''}
                      label="Name"
                      name="name"
                      onBlur={handleBlur('name')}
                      onChangeText={handleChange('name')}
                      placeholder="Enter name"
                      size="large"
                      status="basic"
                      style={styles.nameInput}
                      value={values.name}
                      disabled={existingItem}
                    />

                    <Input
                      accessoryLeft={PersonIcon}
                      caption={(touched.street && errors.street) || ''}
                      label="Address"
                      name="street"
                      onBlur={handleBlur('street')}
                      onChangeText={handleChange('street')}
                      placeholder="Enter your street"
                      size="large"
                      status="basic"
                      style={styles.addressInput}
                      value={values.street}
                      disabled={existingItem}
                    />

                    <Input
                      accessoryLeft={PersonIcon}
                      caption={(touched.city && errors.city) || ''}
                      label=""
                      name="city"
                      onBlur={handleBlur('city')}
                      onChangeText={handleChange('city')}
                      placeholder="Enter your city"
                      size="large"
                      status="basic"
                      style={styles.addressInput}
                      value={values.city}
                      disabled={existingItem}
                    />

                    <Input
                      accessoryLeft={PersonIcon}
                      caption={(touched.state && errors.state) || ''}
                      label=""
                      name="state"
                      onBlur={handleBlur('state')}
                      onChangeText={handleChange('state')}
                      placeholder="Enter your state"
                      size="large"
                      status="basic"
                      style={styles.addressInput}
                      value={values.state}
                      disabled={existingItem}
                    />

                    <Input
                      accessoryLeft={EmailIcon}
                      caption={(touched.zipcode && errors.zipcode) || ''}
                      keyboardType="numeric"
                      label=""
                      maxLength={10}
                      name="zipcode"
                      onBlur={handleBlur('zipcode')}
                      onChangeText={handleChange('zipcode')}
                      placeholder="Enter zip code"
                      size="large"
                      status="basic"
                      style={styles.addressLastInput}
                      value={values.zipcode}
                      disabled={existingItem}
                    />

                    <Text
                      category="label"
                      appearance="hint"
                      style={styles.label}
                    >
                      Type
                    </Text>

                    <RadioComp
                      onSelect={handleType}
                      options={radioOptions}
                      selected={state.type}
                      disabled={existingItem}
                    />

                    <Text
                      category="label"
                      appearance="hint"
                      style={styles.label}
                    >
                      Purification System
                    </Text>

                    <RadioComp
                      onSelect={handlePurificationSystem}
                      options={purificationSystems}
                      selected={state.purificationSystem}
                      disabled={existingItem}
                    />

                    <Input
                      accessoryLeft={EmailIcon}
                      caption={(touched.volume && errors.volume) || ''}
                      keyboardType="numeric"
                      label="Volume"
                      maxLength={10}
                      name="volume"
                      onBlur={handleBlur('volume')}
                      onChangeText={handleChange('volume')}
                      placeholder="Enter volume"
                      returnKeyLabel="done"
                      returnKeyType="done"
                      size="large"
                      status="basic"
                      style={styles.volumeInput}
                      value={values.volume}
                      disabled={existingItem}
                    />

                    {(isAdmin || isManager) && existingItem && (
                      <>
                        <SelectComp
                          onChange={({ value }) => {
                            handleValueChange('maintenanceEmployee', value);
                          }}
                          options={employees}
                          defaultLabel="Select an employee"
                        />

                        <SelectComp
                          onChange={({ value }) => {
                            handleValueChange('maintenanceDay', value);
                          }}
                          options={weekDays}
                        />
                      </>
                    )}
                  </View>

                  {(isAdmin || isManager || !existingItem) && (
                    <Button
                      disabled={state.isLoader}
                      onPress={handleSubmit}
                      size="large"
                      style={styles.createButton}
                    >
                      {existingItem ? 'UPDATE' : 'SUBMIT'}
                    </Button>
                  )}
                </>
              )}
            </Formik>
          )}

          <Button
            style={styles.gobackButton}
            appearance="ghost"
            disabled={state.isLoader}
            status="basic"
            onPress={goBack}
          >
            Cancel
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaLayout>
  );
};

const themedStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingTop: 30,
  },

  formContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },

  nameInput: {
    marginBottom: 25,
  },

  addressInput: {
    marginBottom: 15,
  },

  addressLastInput: {
    marginBottom: 25,
  },

  volumeInput: {
    marginBottom: 25,
  },

  createButton: {
    marginHorizontal: 16,
  },

  gobackButton: {
    marginVertical: 12,
  },

  label: {
    marginBottom: 10,
  },
});
