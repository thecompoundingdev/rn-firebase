import React from 'react';
import { Animated, Easing, ImageProps, StyleSheet } from 'react-native';

const animationValue = new Animated.Value(0);

export const SplashImage = props => {
  const [animationCompleted, setAnimationCompleted] = React.useState(false);

  React.useEffect(() => {
    !props.loading && startAnimation();
  }, [props.loading]);

  const startAnimation = () => {
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 700,
      easing: Easing.in(Easing.exp),
      useNativeDriver: false,
    }).start(onAnimationCompleted);
  };

  const onAnimationCompleted = () => {
    setAnimationCompleted(true);
  };

  const opacity = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const transform = [
    {
      scale: animationValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.5],
      }),
    },
  ];

  const renderAnimatedComponent = () => (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.container, { opacity }]}
    >
      <Animated.Image
        {...props}
        style={[
          StyleSheet.absoluteFill,
          styles.image,
          props.style,
          { transform },
        ]}
      />
    </Animated.View>
  );

  return !animationCompleted && renderAnimatedComponent();
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: undefined,
    height: undefined,
    resizeMode: 'contain',
  },
});
