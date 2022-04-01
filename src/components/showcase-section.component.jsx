import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { Text, TextElement, TextProps } from '@ui-kitten/components';
import { ShowcaseItem, ShowcaseItemProps } from './showcase-item.component';
import {
  ComponentShowcaseItem,
  ComponentShowcaseSection,
} from '../model/showcase.model';

export const ShowcaseSection = props => {
  const { style, section, renderItem } = props;

  const renderShowcaseItem = (item, index) => (
    <ShowcaseItem
      key={index}
      style={styles.item}
      item={item}
      renderItem={renderItem}
    />
  );

  const renderTitleElement = () => (
    <Text style={styles.titleLabel}>{section.title}</Text>
  );

  const titleElement = section.title && renderTitleElement();

  return (
    <View style={[styles.container, style]}>
      {titleElement}
      {section.items.map(renderShowcaseItem)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  titleLabel: {
    marginVertical: 8,
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'left',
  },
  item: {
    marginVertical: 8,
  },
});
