import React from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, ListItem, Text } from '@ui-kitten/components';

import contactImage from '../../assets/images/image-profile-1.jpeg';

export const ContactItem = props => {
  const { item, onPress, ...listItemProps } = props;

  const renderProfileAvatar = () => (
    <Avatar style={styles.avatar} source={contactImage} />
  );

  return (
    <ListItem
      {...listItemProps}
      onPress={onPress}
      title={() => (
        <Text category="h6" style={styles.itemName}>
          {item.pool?.name}
        </Text>
      )}
      description={new Date(item.maintenanceDate.toDate()).toDateString()}
      accessoryLeft={renderProfileAvatar}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  itemName: {
    fontSize: 17,
    paddingLeft: 8,
    marginBottom: 5,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    textAlign: 'right',
    minWidth: 64,
  },
});
