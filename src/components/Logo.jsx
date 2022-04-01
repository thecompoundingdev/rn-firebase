import React from 'react';
import { Image, StyleSheet } from 'react-native';

import { Images } from '../configs';

const styles = StyleSheet.create({
  image: { height: 24, width: 24 },
  largeImage: { height: 100, width: 100 },
});

function Logo({ large }) {
  return (
    <Image
      source={Images.logo}
      style={large ? styles.largeImage : styles.image}
    />
  );
}

export default Logo;
