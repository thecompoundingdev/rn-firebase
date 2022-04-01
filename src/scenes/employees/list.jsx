import React, { memo, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  View,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Divider,
  Input,
  Layout,
  List,
  StyleService,
  // useStyleSheet,
  TopNavigation,
  TopNavigationAction,
  Text,
} from '@ui-kitten/components';

import { PlusIcon, MenuIcon, NotificationIcon } from '../../components/icons';
import { SafeAreaLayout } from '../../components/safe-area-layout.component';
import { auth, employeeService } from '../../services/firebase-service';
import { screens } from '../../app/app-screens';

import { ContactItem } from '../../utils/extra/ContactItem';
import { SearchIcon } from '../../utils/extra/icons';
import CommonStyle from '../Style';

const initialState = {
  switchValue: false,
  selected: false,
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

const Searchbox = memo(({ value, onChange }) => {
  // const styles = useStyleSheet(themedStyles);
  const styles = themedStyles;

  return (
    <Layout style={styles.header} level="1">
      <Input
        accessoryRight={SearchIcon}
        onChangeText={onChange}
        placeholder="Search"
        size="large"
        value={value}
      />
    </Layout>
  );
});

export const EmployeeList = () => {
  const navigation = useNavigation();
  // const styles = useStyleSheet(themedStyles);
  const styles = themedStyles;

  const [state, setState] = useState(initialState);

  const { height } = Dimensions.get('window');
  const { currentUser: user } = auth;

  const handleDocSnapshots = userContacts => {
    try {
      if (userContacts.length === 0) {
        setState(prev => ({
          ...prev,
          status: 'No Data',
          savedData: [],
          masterData: [],
          isLoader: false,
        }));
        return;
      }

      const NameArr = [];
      let FilterNameArr = [];
      const newData = [];
      const TitleArr = [];
      const myArray = [];
      const groups = {};

      const SortArr = [...userContacts].sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      SortArr.forEach(item => {
        NameArr.push({ Alpha: item.name.charAt(0) });
      });

      FilterNameArr = NameArr.filter(
        (ele, ind) =>
          ind === NameArr.findIndex(elem => elem.Alpha === ele.Alpha)
      );

      setState(prev => ({ ...prev, DisplayContactList: FilterNameArr }));
      FilterNameArr.forEach(item => {
        TitleArr.push({ title: item.Alpha });
      });

      const duplicateArr = [...TitleArr];
      duplicateArr.forEach(item => {
        SortArr.forEach(item1 => {
          if (item.title === item1.name.charAt(0)) {
            newData.push({ title: item.title, data: item1 });
          }
        });
      });

      newData.forEach(data => {
        const groupName = data.title;
        if (!groups[groupName]) {
          groups[groupName] = [];
        }
        groups[groupName].push(data.data);
      });

      Object.keys(groups).forEach(groupName => {
        myArray.push({ title: groupName, data: groups[groupName] });
      });

      setState(prev => ({
        ...prev,
        savedData: myArray,
        masterData: myArray,
        isLoader: false,
      }));
    } catch (ex) {
      console.error(ex.message);
    }
  };

  const getContacts = async () => {
    const userContacts = [];

    try {
      const [ownContactsSnapshot, linkedContactsSnapshot] = await Promise.all([
        employeeService.fetchAllEmployees(),
        employeeService.fetchLinkedEmployeesList(user.uid),
      ]);

      ownContactsSnapshot.forEach(doc => {
        userContacts.push({ ...doc.data(), contactId: doc.id });
      });

      linkedContactsSnapshot.forEach(doc => {
        userContacts.push({ ...doc.data(), contactId: doc.id, isLinked: true });
      });
    } catch (ex) {
      console.error(ex.message);
    } finally {
      handleDocSnapshots(userContacts);
    }
  };

  const filterContacts = text => {
    if (!text || text === '') {
      setState(prev => ({ ...prev, savedData: prev.masterData }));
      return;
    }

    let arr1 = [];

    const CharTitle = text.charAt(0).toUpperCase();
    state.masterData.forEach(item => {
      if (item.title.toUpperCase() === CharTitle) {
        arr1 = item.data;
      }
    });

    const SubData = arr1.filter(item => {
      const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });

    if (SubData.length === 0) {
      setState(prev => ({ ...prev, status: 'No data found', savedData: [] }));
    } else {
      const NewArr = [{ title: CharTitle, data: SubData }];
      const NameArr = [];
      let FilterNameArr = [];
      NewArr.forEach(item => {
        NameArr.push({ Alpha: item.title.toUpperCase() });
      });
      FilterNameArr = NameArr.filter(
        (ele, ind) =>
          ind === NameArr.findIndex(elem => elem.Alpha === ele.Alpha)
      );
      setState(prev => ({
        ...prev,
        savedData: NewArr,
        DisplayContactList: FilterNameArr,
      }));
      // setState(prev => ({ ...prev, savedData: NewArr }));
    }
  };

  const handleSearch = text => {
    setState(prev => ({ ...prev, Searchstring: text }));
  };

  useEffect(() => {
    navigation.addListener('focus', () => {
      getContacts();
    });
  }, []);

  useEffect(() => {
    filterContacts(state.Searchstring);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.Searchstring]);

  function refreshControl() {
    setState(prev => ({ ...prev, refreshing: true, Searchstring: '' }));
    getContacts();

    setTimeout(() => {
      setState(prev => ({ ...prev, refreshing: false }));
    }, 1500);
  }

  // function searchContact(text) {
  //   const newData = state.masterData.filter(item => {
  //     const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
  //     const textData = text.toUpperCase();
  //     return itemData.indexOf(textData) > -1;
  //   });

  //   setState(prev => ({ ...prev, savedData: newData }));
  // }

  const addNewItem = () => {
    navigation.navigate(screens.EmployeeDetails);
  };

  const renderDrawerAction = () => (
    <TopNavigationAction icon={MenuIcon} onPress={navigation.toggleDrawer} />
  );

  const renderNotificationAction = () => (
    <TopNavigationAction icon={NotificationIcon} />
  );

  const subrenderItem = ({ item, index }) => (
    <ContactItem
      style={styles.item}
      item={item}
      onPress={() => {
        navigation.navigate(screens.EmployeeDetails, { item, index });
      }}
    />
  );

  const renderItem = ({ item }) => (
    <View style={{ flex: 1 }}>
      <View style={CommonStyle.DGradHorizontalView}>
        <Text style={CommonStyle.DContactChar}>{item.title.toUpperCase()}</Text>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        data={item.data}
        renderItem={subrenderItem}
        scrollEnabled={false}
        keyExtractor={listItem => listItem.contactId}
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
        title="Employees"
        accessoryLeft={renderDrawerAction}
        accessoryRight={renderNotificationAction}
      />

      <Divider />

      <View style={styles.flexHeader}>
        <Searchbox onChange={handleSearch} value={state.Searchstring} />
        <TopNavigationAction icon={PlusIcon} onPress={addNewItem} />
      </View>

      {state.isLoader ? (
        <View style={{ height: height / 1.3, justifyContent: 'center' }}>
          <ActivityIndicator
            size="small"
            // color={
            //   scheme === 'dark' ? Appcolors.WHITE : Appcolors.DARK_GREEN
            // }
            style={{ alignSelf: 'center' }}
          />
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
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  header: {
    flex: 1,
    marginRight: 16,
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
