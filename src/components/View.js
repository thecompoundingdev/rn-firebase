import React from 'react';
import { View as RNView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';

function View({ isSafe, style, children }) {
  const insets = useSafeAreaInsets();

  if (isSafe) {
    return (
      <RNView style={{ paddingTop: insets.top, ...style }}>{children}</RNView>
    );
  }

  return <RNView style={StyleSheet.flatten(style)}>{children}</RNView>;
}

View.propTypes = {
  isSafe: PropTypes.bool,
  style: PropTypes.any,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
};

export default View;
