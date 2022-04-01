import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, ListItem, Text } from '@ui-kitten/components';

import contactImage from '../../assets/images/image-profile-1.jpeg';
// import { DoneAllIcon } from './icons';

export const ContactItem = props => {
  const { item, onPress, ...listItemProps } = props;
  // console.log(item);

  // const renderMessageDate = style => (
  //   <View style={styles.dateContainer}>
  //     {message.isRead && <DoneAllIcon />}
  //     <Text style={styles.dateText} appearance="hint" category="c1">
  //       {message.date}
  //     </Text>
  //   </View>
  // );

  const renderProfileAvatar = () => (
    <Avatar style={styles.avatar} source={contactImage} />
  );

  return (
    <ListItem
      {...listItemProps}
      onPress={onPress}
      // title={message.profile.fullName}
      title={() => (
        <Text category="h6" style={styles.itemName}>
          {item.name}
        </Text>
      )}
      description={item.contactNumber}
      accessoryLeft={renderProfileAvatar}
      // accessoryRight={renderMessageDate}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    // padding: 10,
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
