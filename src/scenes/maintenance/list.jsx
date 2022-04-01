import React, { memo, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  View,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Divider,
  List,
  StyleService,
  TopNavigation,
  TopNavigationAction,
  Text,
} from '@ui-kitten/components';

import { MenuIcon, NotificationIcon } from '../../components/icons';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { auth, jobService, poolService } from '../../services/firebase-service';
import { screens } from '../../app/app-screens';

import { ContactItem } from './list-item';

const initialState = {
  status: 'Loading...',
  savedData: [],
  masterData: [],
  FinalArray: [],
  NameArray: [],
  isLoader: true,
  newData: [],
  DisplayContactList: [],
  refreshing: false,
};

export const ManitenanceList = () => {
  const navigation = useNavigation();
  const styles = themedStyles;

  const [state, setState] = useState(initialState);

  const { height } = Dimensions.get('window');
  const { currentUser: user } = auth;

  const getContacts = async () => {
    let userContacts = [];

    try {
      const data = await jobService.fetchMaintenance(user.uid);

      data.forEach(doc => {
        userContacts.push({ ...doc.data(), contactId: doc.id });
      });

      userContacts = await Promise.all(
        userContacts.map(async c => {
          const currentObj = { ...c };

          try {
            const poolData = await poolService.getPoolDetails(c.pool);
            currentObj.pool = poolData.data();
          } catch {
            currentObj.pool = null;
          }

          return currentObj;
        })
      );
    } catch (ex) {
      console.error(ex.message);
    } finally {
      setState(prev => ({ ...prev, savedData: userContacts, isLoader: false }));
    }
  };

  useEffect(() => {
    navigation.addListener('focus', () => {
      getContacts();
    });
  }, []);

  function refreshControl() {
    setState(prev => ({ ...prev, refreshing: true, Searchstring: '' }));
    getContacts();

    setTimeout(() => {
      setState(prev => ({ ...prev, refreshing: false }));
    }, 1500);
  }

  const renderDrawerAction = () => (
    <TopNavigationAction icon={MenuIcon} onPress={navigation.toggleDrawer} />
  );

  const renderNotificationAction = () => (
    <TopNavigationAction icon={NotificationIcon} />
  );

  const renderItem = ({ item, index }) => (
    <View style={{ flex: 1 }}>
      <ContactItem
        style={styles.item}
        item={item}
        onPress={() => {
          navigation.navigate(screens.MaintenanceDetails, { item, index });
        }}
      />
    </View>
  );

  const renderEmptyContent = () => (
    <View style={styles.emptyContent}>
      <Text>List is empty!</Text>
    </View>
  );

  return (
    <SafeAreaLayout style={styles.safeArea} insets="top">
      <TopNavigation
        title="Maintenance"
        accessoryLeft={renderDrawerAction}
        accessoryRight={renderNotificationAction}
      />

      <Divider />

      <View style={styles.flexHeader}></View>

      {state.isLoader ? (
        <View style={{ height: height / 1.3, justifyContent: 'center' }}>
          <ActivityIndicator size="small" style={{ alignSelf: 'center' }} />
        </View>
      ) : (
        <List
          data={state.savedData}
          ListEmptyComponent={renderEmptyContent}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl
              refreshing={state.refreshing}
              onRefresh={() => refreshControl()}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaLayout>
  );
};

const themedStyles = StyleService.create({
  safeArea: {
    flex: 1,
  },

  list: {
    flex: 1,
    paddingTop: 40,
  },

  flexHeader: {
    marginBottom: 16,
  },

  emptyContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingTop: 50,
  },

  item: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF1F7',
  },
});
