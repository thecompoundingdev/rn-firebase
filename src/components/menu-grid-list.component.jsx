import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Card, List, Text } from '@ui-kitten/components';
// import { MenuItem } from '../model/menu-item.model';

export const MenuGridList = props => {
  const { contentContainerStyle, onItemPress, ...listProps } = props;

  const renderItem = info => (
    <Card style={styles.item} onPress={() => props.onItemPress(info.index)}>
      {info.item.icon({ width: 64, height: 64, alignSelf: 'center' })}
      <Text style={styles.itemTitle} category="s2">
        {info.item.title}
      </Text>
    </Card>
  );

  return (
    <List
      {...listProps}
      contentContainerStyle={[styles.container, contentContainerStyle]}
      numColumns={2}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  item: {
    flex: 1,
    justifyContent: 'center',
    aspectRatio: 1.0,
    margin: 8,
    maxWidth: Dimensions.get('window').width / 2 - 24,
  },
  itemImage: {
    alignSelf: 'center',
    width: 64,
    height: 64,
  },
  itemTitle: {
    alignSelf: 'center',
    marginTop: 8,
  },
});
