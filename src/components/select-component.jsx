import React, { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { IndexPath, Layout, Select, SelectItem } from '@ui-kitten/components';

export const SelectComp = ({ options, onChange, defaultLabel = '' }) => {
  const [selectedIndex, setSelectedIndex] = React.useState(new IndexPath(0));

  const displayValue = useMemo(
    () =>
      options?.length > 0 ? options[selectedIndex.row].label : defaultLabel,
    [selectedIndex, defaultLabel]
  );

  useEffect(() => {
    const selectedValue = options[selectedIndex.row];
    if (selectedValue && onChange) {
      onChange(selectedValue);
    }
  }, [options, selectedIndex]);

  return (
    <Select
      size="large"
      selectedIndex={selectedIndex}
      onSelect={index => setSelectedIndex(index)}
      value={displayValue}
      style={styles.container}
    >
      {options.map(option => (
        <SelectItem key={option.value} title={option.label} />
      ))}
    </Select>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
});
