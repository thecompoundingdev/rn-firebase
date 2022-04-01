import React from 'react';
import { ViewStyle } from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-aware-scroll-view';
import { StyleService, useStyleSheet } from '@ui-kitten/components';
import { ShowcaseSection } from './showcase-section.component';
import {
  ComponentShowcase,
  ComponentShowcaseSection,
} from '../model/showcase.model';

export const Showcase = props => {
  const styles = useStyleSheet(themedStyles);
  const { showcase, settings, renderItem, ...containerProps } = props;

  const renderShowcaseElement = showcaseProps => {
    return renderItem({ ...showcaseProps, ...settings });
  };

  const renderSectionElement = item => (
    <ShowcaseSection section={item} renderItem={renderShowcaseElement} />
  );

  const renderSectionItem = (item, index) => {
    const listItemElement = renderSectionElement(item);

    const borderStyle =
      index === showcase.sections.length - 1 ? null : styles.itemBorder;

    return React.cloneElement(listItemElement, {
      key: index,
      style: [styles.item, borderStyle, listItemElement.props.style],
    });
  };

  return (
    <KeyboardAwareScrollView
      {...containerProps}
      style={[styles.container, props.style]}
      enableOnAndroid={true}
      bounces={false}
    >
      {showcase.sections.map(renderSectionItem)}
    </KeyboardAwareScrollView>
  );
};

const themedStyles = StyleService.create({
  container: {
    flex: 1,
    backgroundColor: 'background-basic-color-1',
  },
  item: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'border-basic-color-3',
  },
});
