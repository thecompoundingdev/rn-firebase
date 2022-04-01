import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Layout, Radio } from '@ui-kitten/components';

export const RadioComp = memo(({ disabled, onSelect, options, selected }) => (
  <Layout style={styles.container} level="1">
    {options.map(option => (
      <Radio
        disabled={disabled}
        key={option.value}
        style={styles.radio}
        checked={selected === option.value}
        onChange={nextChecked => onSelect(option, nextChecked)}
      >
        {option.label}
      </Radio>
    ))}
  </Layout>
));

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 25,
  },
  radio: {
    margin: 2,
    marginBottom: 15,
  },
});
