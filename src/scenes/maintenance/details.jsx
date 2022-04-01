import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Text,
  Button,
  Divider,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';

import { MenuIcon, NotificationIcon } from '../../components/icons';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { KeyboardAvoidingView } from '../../utils/extra/3rd-party.js';

const initialState = {
  isLoader: false,

  // existing contact's data
  contactId: '',
  isActive: false,
  isLinked: false,
};

export const MaintenanceDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [state, setState] = useState(initialState);

  const styles = themedStyles;
  const { item: existingItem } = route.params || {};

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

  const renderDrawerAction = () => (
    <TopNavigationAction icon={MenuIcon} onPress={navigation.toggleDrawer} />
  );

  const renderNotificationAction = () => (
    <TopNavigationAction icon={NotificationIcon} />
  );

  return (
    <SafeAreaLayout style={styles.safeArea} insets="top">
      <KeyboardAvoidingView>
        <TopNavigation
          title={'Maintenance Details'}
          accessoryLeft={renderDrawerAction}
          accessoryRight={renderNotificationAction}
        />

        <Divider />

        <View style={styles.container}>
          <Text>Pool Name: {existingItem.pool.name}</Text>
          <Text>
            Date:{' '}
            {new Date(existingItem.maintenanceDate.toDate()).toDateString()}
          </Text>

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
    paddingHorizontal: 16,
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
