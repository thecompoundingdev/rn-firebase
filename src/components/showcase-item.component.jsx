import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { Text, TextElement } from '@ui-kitten/components';
import { ComponentShowcaseItem } from '../model/showcase.model';

export const ShowcaseItem = props => {
  const { style, item, renderItem } = props;

  const renderElement = () => {
    const element = renderItem(item.props);

    return React.cloneElement(element, {
      style: [element.props.style],
    });
  };

  const renderTitleElement = () => (
    <Text appearance="hint" style={styles.titleLabel}>
      {item.title}
    </Text>
  );

  const titleElement = item.title && renderTitleElement();
  const showcaseElement = renderElement();

  return (
    <View style={[styles.container, style]}>
      {titleElement}
      {showcaseElement}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleLabel: {
    minWidth: 128,
    fontSize: 13,
    textAlign: 'left',
  },
});
