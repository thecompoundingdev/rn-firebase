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
  Toggle,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import { Formik } from 'formik';
import { serverTimestamp } from 'firebase/firestore';

import { DeleteIcon, MenuIcon, NotificationIcon } from '../../components/icons';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import {
  auth,
  customerService,
  employeeService,
} from '../../services/firebase-service';
import { newCustomerSchema } from '../../utils/validations';
import { EmailIcon, PersonIcon } from '../../utils/extra/icons';
import { KeyboardAvoidingView } from '../../utils/extra/3rd-party.js';

const initialState = {
  isLoader: false,

  // existing contact's data
  contactId: '',
  isActive: false,
  isLinked: false,
};

export const CustomerDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  // const styles = useStyleSheet(themedStyles);
  const styles = themedStyles;
  // const { t } = useTranslation();
  const [state, setState] = useState(initialState);

  const { height } = Dimensions.get('window');
  const { currentUser: user } = auth;
  const { item: existingItem } = route.params || {};

  const initialValues = useMemo(
    () => ({
      name: existingItem?.name || '',
      email: existingItem?.email || '',
      contactNumber: existingItem?.contactNumber || '',
    }),
    [route.params]
  );

  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (existingItem) {
      setState(prev => ({
        ...prev,
        contactId: existingItem.contactId,
        isActive: existingItem.isActive,
        isLinked: existingItem.isLinked,
      }));
    }
  }, []);

  const createContact = async values => {
    const { name, email, contactNumber } = values;
    if (email === user.email) {
      Alert.alert('Should not be your own email.');
      return;
    }

    const newContact = {
      createdBy: user.uid,
      name,
      email,
      contactNumber,
      role: 'customer',
      isActive: state.isActive,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      setState(prev => ({ ...prev, isLoader: true }));
      const [custData, empData] = await Promise.all([
        customerService.checkExistingCustomer(user.uid, email),
        employeeService.checkExistingEmployee(user.uid, email),
      ]);
      if (!custData.empty || !empData.empty) {
        Alert.alert('Email already registered!');
        setState(prev => ({ ...prev, isLoader: false }));
        return;
      }
      await customerService.addNewCustomer(newContact);
      Alert.alert('Saved successfully!');
      goBack();
    } catch (error) {
      Alert.alert('Failed to save the contact!');
      setState(prev => ({ ...prev, isLoader: false }));
    }
  };

  const updateContact = async values => {
    const { name, email, contactNumber } = values;
    const payload = {
      name,
      email,
      contactNumber,
      isActive: state.isActive,
      updatedAt: serverTimestamp(),
    };

    try {
      setState(prev => ({ ...prev, isLoader: true }));
      await customerService.updateCustomer(state.contactId, payload);
      goBack();
    } catch (ex) {
      Alert.alert('Failed to update the contact!');
      setState(prev => ({ ...prev, isLoader: false }));
    }
  };

  const deleteContact = async () => {
    try {
      setState(prev => ({ ...prev, isLoader: true }));
      await customerService.deleteCustomer(state.contactId);
      goBack();
    } catch (ex) {
      console.log(ex.message);
      Alert.alert('Failed to delete the contact!');
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

  const toggleActive = checked => {
    setState(prev => ({ ...prev, isActive: checked }));
  };

  return (
    <SafeAreaLayout style={styles.safeArea} insets="top">
      <KeyboardAvoidingView>
        <TopNavigation
          title={existingItem ? 'Customer Details' : 'New Customer'}
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
              validationSchema={newCustomerSchema}
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
                      label="Contact Name"
                      name="name"
                      onBlur={handleBlur('name')}
                      onChangeText={handleChange('name')}
                      placeholder="Enter name here"
                      size="large"
                      status="basic"
                      style={styles.nameInput}
                      value={values.name}
                    />

                    <Input
                      accessoryLeft={EmailIcon}
                      autoCapitalize="none"
                      caption={(touched.email && errors.email) || ''}
                      keyboardType="email-address"
                      label="Email"
                      name="email"
                      onBlur={handleBlur('email')}
                      onChangeText={handleChange('email')}
                      placeholder="Enter email"
                      size="large"
                      status="basic"
                      style={styles.emailInput}
                      textContentType="emailAddress"
                      value={values.email}
                    />

                    <Input
                      accessoryLeft={EmailIcon}
                      caption={
                        (touched.contactNumber && errors.contactNumber) || ''
                      }
                      keyboardType="phone-pad"
                      label="Contact Number"
                      maxLength={10}
                      name="contactNumber"
                      onBlur={handleBlur('contactNumber')}
                      onChangeText={handleChange('contactNumber')}
                      placeholder="Enter contact number"
                      returnKeyLabel="done"
                      returnKeyType="done"
                      size="large"
                      status="basic"
                      style={styles.contactInput}
                      value={values.contactNumber}
                    />

                    <Toggle
                      checked={state.isActive}
                      onChange={toggleActive}
                      style={styles.toggle}
                    >
                      Active
                    </Toggle>
                  </View>

                  {!state.isLinked && (
                    <Button
                      disabled={state.isLoader}
                      onPress={handleSubmit}
                      size="large"
                      style={styles.createButton}
                    >
                      {existingItem ? 'UPDATE CONTACT' : 'CREATE CONTACT'}
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

  emailInput: {
    marginBottom: 25,
  },
  contactInput: {
    marginBottom: 16,
  },

  createButton: {
    marginHorizontal: 16,
  },

  gobackButton: {
    marginVertical: 12,
  },

  toggle: {
    marginTop: 15,
    justifyContent: 'flex-end',
    flexDirection: 'row-reverse',
  },
});
